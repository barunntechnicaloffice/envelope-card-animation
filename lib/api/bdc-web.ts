/**
 * bdc-web 백오피스 API 클라이언트
 *
 * 템플릿을 bdc-web-server-backoffice에 등록/수정/삭제하는 API
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

export interface TemplateCreateResponse {
  _id: string
  modified?: boolean
  updatedAt?: string
}

export interface TemplateListItem {
  id: string
  name: string
  version: string
  category: string
  thumbnail?: string
  createdAt: string
  updatedAt: string
}

export interface TemplateListResponse {
  items: TemplateListItem[]
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
 * card-admin 템플릿 JSON → backoffice cardTemplates 스키마로 변환
 *
 * card-admin JSON:
 * {
 *   id: "wedding-card-049",
 *   version: "4.0.0",
 *   name: "러브 스토리",
 *   category: "웨딩",
 *   layout: {...},
 *   data: {...},
 *   components: [...]
 * }
 *
 * backoffice cardTemplates 스키마:
 * {
 *   name: string,
 *   category: string,
 *   templateSchema: Record<string, any>,  // 전체 JSON
 *   config: Record<string, any>,
 *   aspectRatio: { x: number, y: number },
 *   thumbNail?: string,
 *   order?: number,
 *   version: number
 * }
 */
function transformTemplateForBackoffice(template: Record<string, unknown>): Record<string, unknown> {
  const layout = template.layout as Record<string, unknown> | undefined
  const baseSize = layout?.baseSize as { width: number; height: number } | undefined

  return {
    name: template.name || template.id,
    category: template.category || '웨딩',
    templateSchema: template,  // 전체 JSON을 templateSchema에 저장
    config: {
      id: template.id,
      figmaNodeId: template.figmaNodeId,
    },
    aspectRatio: {
      x: baseSize?.width || 335,
      y: baseSize?.height || 515,
    },
    thumbNail: template.thumbnail as string | undefined,
    version: typeof template.version === 'string'
      ? parseInt(template.version.split('.')[0], 10) || 1
      : (template.version as number) || 1,
  }
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
 * 템플릿 목록 조회
 */
export async function getTemplates(): Promise<BdcWebApiResponse<TemplateListResponse>> {
  return callBdcWebApi<TemplateListResponse>('/api/resources/cardTemplates')
}

/**
 * 단일 템플릿 조회
 */
export async function getTemplate(templateId: string): Promise<BdcWebApiResponse<Record<string, unknown>>> {
  return callBdcWebApi<Record<string, unknown>>(`/api/resources/cardTemplates/${templateId}`)
}

/**
 * 템플릿 생성 (bdc-web에 등록)
 */
export async function createTemplate(
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<TemplateCreateResponse>> {
  const transformedData = transformTemplateForBackoffice(template)
  console.log('[bdc-web API] 변환된 데이터:', JSON.stringify(transformedData, null, 2).substring(0, 500))

  return callBdcWebApi<TemplateCreateResponse>('/api/resources/cardTemplates', {
    method: 'POST',
    body: JSON.stringify(transformedData),
  })
}

/**
 * 템플릿 수정
 */
export async function updateTemplate(
  templateId: string,
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<TemplateCreateResponse>> {
  const transformedData = transformTemplateForBackoffice(template)
  console.log('[bdc-web API] 변환된 데이터:', JSON.stringify(transformedData, null, 2).substring(0, 500))

  return callBdcWebApi<TemplateCreateResponse>(`/api/resources/cardTemplates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(transformedData),
  })
}

/**
 * 템플릿 삭제
 */
export async function deleteTemplate(
  templateId: string
): Promise<BdcWebApiResponse<{ deleted: boolean; id: string }>> {
  return callBdcWebApi<{ deleted: boolean; id: string }>(`/api/resources/cardTemplates/${templateId}`, {
    method: 'DELETE',
  })
}

/**
 * 템플릿 생성 또는 수정 (upsert)
 *
 * 참고: backoffice는 MongoDB _id를 사용하므로,
 * card-admin의 template.id로는 조회할 수 없음.
 * 따라서 항상 POST로 생성 시도함.
 * (backoffice에서 name 기준 중복 처리 필요)
 */
export async function upsertTemplate(
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<TemplateCreateResponse>> {
  const templateId = template.id as string

  if (!templateId) {
    return {
      success: false,
      error: '템플릿 ID가 필요합니다.',
    }
  }

  // 항상 새로 생성 (backoffice에서 중복 처리)
  return createTemplate(template)
}
