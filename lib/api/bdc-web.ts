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
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': BDC_WEB_API_KEY,
        ...options.headers,
      },
    })

    const data = await response.json()

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
    console.error('bdc-web API 호출 실패:', error)
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
  return callBdcWebApi<TemplateListResponse>('/api/resources/templates')
}

/**
 * 단일 템플릿 조회
 */
export async function getTemplate(templateId: string): Promise<BdcWebApiResponse<Record<string, unknown>>> {
  return callBdcWebApi<Record<string, unknown>>(`/api/resources/templates/${templateId}`)
}

/**
 * 템플릿 생성 (bdc-web에 등록)
 */
export async function createTemplate(
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<TemplateCreateResponse>> {
  return callBdcWebApi<TemplateCreateResponse>('/admin/resources/templates', {
    method: 'POST',
    body: JSON.stringify(template),
  })
}

/**
 * 템플릿 수정
 */
export async function updateTemplate(
  templateId: string,
  template: Record<string, unknown>
): Promise<BdcWebApiResponse<TemplateCreateResponse>> {
  return callBdcWebApi<TemplateCreateResponse>(`/admin/resources/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(template),
  })
}

/**
 * 템플릿 삭제
 */
export async function deleteTemplate(
  templateId: string
): Promise<BdcWebApiResponse<{ deleted: boolean; id: string }>> {
  return callBdcWebApi<{ deleted: boolean; id: string }>(`/admin/resources/templates/${templateId}`, {
    method: 'DELETE',
  })
}

/**
 * 템플릿 존재 여부 확인
 */
export async function checkTemplateExists(templateId: string): Promise<boolean> {
  const result = await getTemplate(templateId)
  return result.success
}

/**
 * 템플릿 생성 또는 수정 (upsert)
 * - 이미 존재하면 수정
 * - 없으면 생성
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

  const exists = await checkTemplateExists(templateId)

  if (exists) {
    return updateTemplate(templateId, template)
  } else {
    return createTemplate(template)
  }
}
