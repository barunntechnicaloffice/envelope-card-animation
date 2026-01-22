/**
 * bdc-web 백오피스 API 클라이언트
 *
 * 카드 디자인을 bdc-web-server-backoffice에 등록/수정/삭제하는 API
 */

const BDC_WEB_API_URL = process.env.BDC_WEB_API_URL || ''
const BDC_WEB_API_KEY = process.env.BDC_WEB_API_KEY || ''

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
        'X-API-KEY': BDC_WEB_API_KEY,
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
      return {
        success: false,
        error: data.error || data.message || `HTTP ${response.status} 오류`,
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
 * card-admin JSON 구조가 cardDesigns 스키마와 동일하므로 변환 없이 그대로 전송
 */
export async function createCardDesign(
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<CardDesignCreateResponse>> {
  console.log('[bdc-web API] 카드 디자인 생성:', template.name || template.id)

  return callBdcWebApi<CardDesignCreateResponse>('/api/resources/cardDesigns', {
    method: 'POST',
    body: JSON.stringify(template),
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
