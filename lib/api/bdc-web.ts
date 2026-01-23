/**
 * bdc-web 백오피스 API 클라이언트
 *
 * 카드 디자인을 bdc-web-server-backoffice에 등록/수정/삭제하는 API
 */

const BDC_WEB_API_URL = process.env.BDC_WEB_API_URL || ''
const BDC_WEB_API_KEY = process.env.BDC_WEB_API_KEY || ''
const AWS_S3_PREFIX = process.env.AWS_S3_PREFIX || '_static/bdc/server'

/**
 * 템플릿 내 에셋 경로를 bdc-web 백오피스용 상대 경로로 변환
 *
 * 변환 케이스:
 * 1. 로컬 경로: /assets/... → /_static/bdc/server/assets/...
 * 2. S3 전체 URL: https://.../_static/bdc/server/assets/... → /_static/bdc/server/assets/...
 *
 * bdc-web 백오피스는 상대 경로를 사용하여 자체 도메인에서 이미지를 서빙함
 */
function transformAssetPaths(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // 케이스 1: 로컬 경로 (/assets/로 시작)
    if (obj.startsWith('/assets/')) {
      return `/${AWS_S3_PREFIX}${obj}`
    }

    // 케이스 2: S3/CloudFront 전체 URL → 상대 경로로 변환
    // https://도메인/_static/bdc/server/assets/... → /_static/bdc/server/assets/...
    if (obj.includes('/_static/bdc/server/')) {
      const relativePath = obj.substring(obj.indexOf('/_static/bdc/server/'))
      console.log('[transformAssetPaths] S3 URL → 상대 경로:', obj, '→', relativePath)
      return relativePath
    }

    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(transformAssetPaths)
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = transformAssetPaths(value)
    }
    return result
  }
  return obj
}

export interface BdcWebApiError {
  success: false
  error: string
  code?: string
}

export interface BdcWebApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export type BdcWebApiResponse<T = unknown> = BdcWebApiSuccess<T> | BdcWebApiError

export interface CardDesignCreateResponse {
  _id: string
  modified?: boolean
  updatedAt?: string
}

export interface CardDesignListItem {
  _id: string
  name: string
  version: number
  category: string
  createdAt: string
  updatedAt: string
}

export interface CardDesignListResponse {
  items: CardDesignListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * API 설정 확인
 */
export function isBdcWebApiEnabled(): boolean {
  return Boolean(BDC_WEB_API_URL && BDC_WEB_API_KEY)
}

/**
 * bdc-web API 호출
 */
async function callBdcWebApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<BdcWebApiResponse<T>> {
  if (!isBdcWebApiEnabled()) {
    return {
      success: false,
      error: 'bdc-web API가 설정되지 않았습니다. BDC_WEB_API_URL과 BDC_WEB_API_KEY를 확인하세요.',
    }
  }

  const url = `${BDC_WEB_API_URL}${endpoint}`

  try {
    console.log('[bdc-web API] 요청:', { url, method: options.method || 'GET' })

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BDC_WEB_API_KEY,
        ...options.headers,
      },
    })

    console.log('[bdc-web API] 응답 상태:', response.status, response.statusText)

    // 응답 텍스트 먼저 확인
    const responseText = await response.text()
    console.log('[bdc-web API] 응답 본문 길이:', responseText.length)

    // 빈 응답 처리
    if (!responseText || responseText.trim() === '') {
      console.error('[bdc-web API] 빈 응답 수신')
      return {
        success: false,
        error: `서버로부터 빈 응답을 받았습니다. (HTTP ${response.status})`,
      }
    }

    // JSON 파싱 시도
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('[bdc-web API] JSON 파싱 실패:', responseText.substring(0, 200))
      return {
        success: false,
        error: `서버 응답을 파싱할 수 없습니다: ${responseText.substring(0, 100)}...`,
      }
    }

    if (!response.ok) {
      // 에러 응답 상세 로깅
      console.error('[bdc-web API] 에러 응답:', JSON.stringify(data, null, 2))
      return {
        success: false,
        error: data.message || data.error || `HTTP ${response.status} 오류`,
        code: data.code,
      }
    }

    return {
      success: true,
      data: data.data ?? data,
      message: data.message,
    }
  } catch (error) {
    console.error('[bdc-web API] 호출 실패:', error)

    // 네트워크 에러 또는 fetch 실패
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: `API 서버에 연결할 수 없습니다. URL을 확인하세요: ${url}`,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'API 호출 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 카드 디자인 목록 조회
 */
export async function getCardDesigns(): Promise<BdcWebApiResponse<CardDesignListResponse>> {
  return callBdcWebApi<CardDesignListResponse>('/api/resources/cardDesigns')
}

/**
 * 단일 카드 디자인 조회
 */
export async function getCardDesign(designId: string): Promise<BdcWebApiResponse<Record<string, unknown>>> {
  return callBdcWebApi<Record<string, unknown>>(`/api/resources/cardDesigns/${designId}`)
}

/**
 * 카드 디자인 생성 (bdc-web에 등록)
 *
 * card-admin JSON과 cardDesigns 스키마 간 필드 차이 처리:
 * - id: card-admin 전용 식별자 (백엔드에서는 MongoDB _id 사용)
 * - version: card-admin은 "1.0.0" 형식, 백엔드는 Number 타입 (0 기본값)
 */
export async function createCardDesign(
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<CardDesignCreateResponse>> {
  console.log('[bdc-web API] 카드 디자인 생성:', template.name || template.id)

  // 백엔드 스키마와 호환되도록 필드 정리
  const payload = { ...template }
  delete payload.id // 백엔드는 MongoDB _id 자동 생성
  delete payload.version // 백엔드는 Number 타입, 기본값 0 사용

  // 에셋 경로를 S3 경로로 변환 (/assets/... → /_static/bdc/server/assets/...)
  const transformedPayload = transformAssetPaths(payload) as Record<string, unknown>
  console.log('[bdc-web API] 에셋 경로 변환 완료')

  return callBdcWebApi<CardDesignCreateResponse>('/api/resources/cardDesigns', {
    method: 'POST',
    body: JSON.stringify(transformedPayload),
  })
}

/**
 * 카드 디자인 수정
 */
export async function updateCardDesign(
  designId: string,
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<CardDesignCreateResponse>> {
  console.log('[bdc-web API] 카드 디자인 수정:', designId)

  return callBdcWebApi<CardDesignCreateResponse>(`/api/resources/cardDesigns/${designId}`, {
    method: 'PUT',
    body: JSON.stringify(template),
  })
}

/**
 * 카드 디자인 삭제
 */
export async function deleteCardDesign(
  designId: string
): Promise<BdcWebApiResponse<{ deleted: boolean; id: string }>> {
  return callBdcWebApi<{ deleted: boolean; id: string }>(`/api/resources/cardDesigns/${designId}`, {
    method: 'DELETE',
  })
}

/**
 * 카드 디자인 생성 또는 수정 (upsert)
 *
 * 참고: backoffice는 MongoDB _id를 사용하므로,
 * card-admin의 template.id로는 조회할 수 없음.
 * 따라서 항상 POST로 생성 시도함.
 */
export async function upsertCardDesign(
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<CardDesignCreateResponse>> {
  const templateId = template.id as string

  if (!templateId) {
    return {
      success: false,
      error: '템플릿 ID가 필요합니다.',
    }
  }

  // 항상 새로 생성
  return createCardDesign(template)
}

// 하위 호환성을 위한 alias
export const getTemplates = getCardDesigns
export const getTemplate = getCardDesign
export const createTemplate = createCardDesign
export const updateTemplate = updateCardDesign
export const deleteTemplate = deleteCardDesign
export const upsertTemplate = upsertCardDesign
export type TemplateCreateResponse = CardDesignCreateResponse
export type TemplateListItem = CardDesignListItem
export type TemplateListResponse = CardDesignListResponse
