'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })
const LayoutEditor = dynamic(() => import('@/components/admin/LayoutEditor'), { ssr: false })

interface FigmaElement {
  id: string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  // 텍스트 요소
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  color?: string
  textAlign?: string
  letterSpacing?: number
  lineHeight?: number
  characters?: string
}

interface ConvertedElement {
  type: 'text' | 'image' | 'vector' | 'container' | 'background'
  x: number
  y: number
  width: number | 'auto'
  height?: number | 'auto'
  zIndex: number
  editable: boolean
  // 텍스트 속성
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  color?: string
  align?: string
  letterSpacing?: number
  lineHeight?: number
  centerAlign?: boolean
}

// 카테고리 타입
interface CategoryOption {
  value: string
  label: string
}

// localStorage 키
const FIGMA_FILE_KEY_STORAGE = 'figma_file_key'
const FIGMA_TOKEN_STORAGE = 'figma_access_token'

// Figma 폰트명 → 프로젝트 CSS 폰트명 매핑
// FONTS_GUIDE.md 참고
const FONT_MAPPING: Record<string, string> = {
  // 나눔손글씨 느릿느릿체
  'Nanum NeuRisNeuRisCe': "'NanumSlow', cursive",
  'Nanum_NeuRisNeuRisCe': "'NanumSlow', cursive",
  'NanumNeuRisNeuRisCe': "'NanumSlow', cursive",
  // 나눔명조
  'Nanum Myeongjo': "'Nanum Myeongjo', serif",
  'NanumMyeongjo': "'Nanum Myeongjo', serif",
  // 나눔스퀘어네오
  'NanumSquareNeo': "'NanumSquare Neo', sans-serif",
  'Nanum Square Neo': "'NanumSquare Neo', sans-serif",
  'NanumSquare Neo': "'NanumSquare Neo', sans-serif",
  'Nanum SquareNeo': "'NanumSquare Neo', sans-serif",
  // 고운바탕
  'Gowun Batang': "'Gowun Batang', serif",
  'GowunBatang': "'Gowun Batang', serif",
  // 프리텐다드
  'Pretendard': "'Pretendard', sans-serif",
}

// Figma 폰트명을 프로젝트 CSS 폰트명으로 변환
function mapFigmaFont(figmaFontFamily: string): string {
  // 매핑 테이블에서 찾기
  if (FONT_MAPPING[figmaFontFamily]) {
    return FONT_MAPPING[figmaFontFamily]
  }

  // 부분 일치로 찾기 (대소문자 무시)
  const lowerFont = figmaFontFamily.toLowerCase()
  for (const [key, value] of Object.entries(FONT_MAPPING)) {
    if (lowerFont.includes(key.toLowerCase().replace(/[\s_]/g, ''))) {
      return value
    }
  }

  // 매핑이 없으면 기본 형식으로 반환
  return `'${figmaFontFamily}', serif`
}

// Figma URL 파싱 함수
function parseFigmaUrl(url: string): { fileKey: string; nodeId: string } | null {
  // URL 형식들:
  // https://www.figma.com/design/FILE_KEY/파일명?node-id=NODE_ID
  // https://www.figma.com/file/FILE_KEY/파일명?node-id=NODE_ID
  // https://figma.com/design/FILE_KEY/파일명?node-id=NODE_ID&...

  try {
    const urlObj = new URL(url)

    // 호스트 체크
    if (!urlObj.hostname.includes('figma.com')) {
      return null
    }

    // 경로에서 file key 추출
    const pathParts = urlObj.pathname.split('/')
    let fileKey = ''

    // /design/FILE_KEY/... 또는 /file/FILE_KEY/... 형태
    const designIndex = pathParts.indexOf('design')
    const fileIndex = pathParts.indexOf('file')

    if (designIndex !== -1 && pathParts[designIndex + 1]) {
      fileKey = pathParts[designIndex + 1]
    } else if (fileIndex !== -1 && pathParts[fileIndex + 1]) {
      fileKey = pathParts[fileIndex + 1]
    }

    // node-id 파라미터 추출
    // Figma URL에서는 하이픈(166-2333) 형식이지만,
    // 기존 템플릿들은 콜론(166:2333) 형식을 사용하므로 변환
    const rawNodeId = urlObj.searchParams.get('node-id') || ''
    const nodeId = rawNodeId.replace('-', ':')

    if (fileKey && nodeId) {
      return { fileKey, nodeId }
    }

    return null
  } catch {
    return null
  }
}

export default function NewTemplatePage() {
  const [step, setStep] = useState(1)
  const [templateId, setTemplateId] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [category, setCategory] = useState('')
  const [customCategory, setCustomCategory] = useState('') // 직접 입력용
  const [figmaNodeId, setFigmaNodeId] = useState('')
  const [figmaFileKey, setFigmaFileKey] = useState('')
  const [figmaUrl, setFigmaUrl] = useState('') // Figma URL 입력
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 })
  const [baseSize, setBaseSize] = useState({ width: 335, height: 515 })
  const [parsedElements, setParsedElements] = useState<FigmaElement[]>([])
  const [generatedJson, setGeneratedJson] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchSuccess, setFetchSuccess] = useState(false)
  const [urlParseSuccess, setUrlParseSuccess] = useState(false) // URL 파싱 성공 여부
  const [figmaToken, setFigmaToken] = useState('') // 사용자가 입력한 Figma 토큰
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([])

  // localStorage에서 File Key와 토큰 불러오기 + 카테고리 로드
  useEffect(() => {
    const savedFileKey = localStorage.getItem(FIGMA_FILE_KEY_STORAGE)
    if (savedFileKey) setFigmaFileKey(savedFileKey)

    const savedToken = localStorage.getItem(FIGMA_TOKEN_STORAGE)
    if (savedToken) setFigmaToken(savedToken)

    // 카테고리 JSON 로드
    fetch('/config/categories.json')
      .then(res => res.json())
      .then(data => {
        if (data.categories && data.categories.length > 0) {
          setCategoryOptions(data.categories)
        }
      })
      .catch(() => {
        // 로드 실패 시 기본값 유지
        console.warn('카테고리 설정을 불러오지 못했습니다. 기본값을 사용합니다.')
      })
  }, [])

  // Figma URL 변경 시 자동 파싱
  const handleFigmaUrlChange = useCallback((url: string) => {
    setFigmaUrl(url)
    setUrlParseSuccess(false)

    if (!url.trim()) {
      return
    }

    const parsed = parseFigmaUrl(url)
    if (parsed) {
      setFigmaFileKey(parsed.fileKey)
      setFigmaNodeId(parsed.nodeId)
      setUrlParseSuccess(true)
      // File Key도 저장
      localStorage.setItem(FIGMA_FILE_KEY_STORAGE, parsed.fileKey)
    }
  }, [])

  // Figma API로 메타데이터 가져오기
  const fetchFigmaMetadata = useCallback(async () => {
    if (!figmaFileKey || !figmaNodeId) {
      setError('Figma URL을 입력해주세요.')
      return
    }

    if (!figmaToken) {
      setError('Figma Personal Access Token을 입력해주세요.')
      return
    }

    setError(null)
    setProcessing(true)
    setFetchSuccess(false)

    try {
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileKey: figmaFileKey,
          nodeId: figmaNodeId,
          apiKey: figmaToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Figma API 호출에 실패했습니다.')
        return
      }

      // 성공: 요소들 설정
      const elements: FigmaElement[] = result.data.elements.map((el: FigmaElement) => ({
        ...el,
        type: el.type.toLowerCase(),
      }))

      setParsedElements(elements)
      setBgOffset(result.data.bgOffset)
      setBaseSize(result.data.baseSize)
      setFetchSuccess(true)

      // 바로 Step 3으로 이동
      setStep(3)
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setProcessing(false)
    }
  }, [figmaFileKey, figmaNodeId, figmaToken])


  // JSON 생성
  const generateJson = useCallback(async () => {
    const layout: Record<string, ConvertedElement> = {}

    // Figma에서 추출한 텍스트 값 저장
    const figmaTextValues: Record<string, string> = {}

    parsedElements.forEach((el, index) => {
      const nameLower = el.name.toLowerCase()

      // BG 요소는 건너뛰기
      if (nameLower === 'bg' || nameLower === 'background') {
        return
      }

      // 불필요한 container 요소 건너뛰기:
      // - *auto 패턴의 프레임/컨테이너만 건너뛰기 (groom auto 프레임 등)
      // - 텍스트 타입은 auto가 포함되어도 유지 (date auto 텍스트 등)
      // - template, input, obj 같은 래퍼 컨테이너
      const isAutoContainer = nameLower.includes('auto') && el.type !== 'text'
      if (isAutoContainer ||
          nameLower === 'template' ||
          nameLower === 'input' ||
          nameLower === 'obj') {
        return
      }

      // 좌표 변환 (BG 기준 상대 좌표)
      const relativeX = el.x - bgOffset.x
      const relativeY = el.y - bgOffset.y

      // 요소 타입 결정
      let elementType: ConvertedElement['type'] = 'container'
      if (el.type === 'text') {
        elementType = 'text'
      } else if (el.type === 'image' || el.name.includes('photo') || el.name.includes('image')) {
        elementType = 'image'
      } else if (el.type === 'vector' || el.name.includes('icon') || el.name.includes('decoration')) {
        elementType = 'vector'
      }

      // 요소 이름 정규화 (camelCase)
      // 1. [locked], [editable] 등 태그 제거
      // 2. _name 접미사 제거 (groom_name -> groom)
      // 3. auto 접미사 제거 (date auto -> date)
      // 4. camelCase로 변환
      const cleanName = el.name
        .replace(/\[locked\]/gi, '')
        .replace(/_name$/gi, '')
        .replace(/\[editable\]/gi, '')
        .replace(/\s*auto\s*$/gi, '')  // "date auto" -> "date"
        .replace(/\s+auto\s+/gi, ' ')  // 중간에 있는 auto도 제거
        .trim()

      const normalizedName = cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^./, (char) => char.toLowerCase())

      // groom, bride는 항상 width: 'auto' 사용 (텍스트 길이에 맞춤)
      const shouldUseAutoWidth = ['groom', 'bride'].includes(normalizedName)

      // 중앙 정렬 감지: 요소의 중심이 캔버스 중앙과 10px 이내인지 확인
      const elementCenterX = relativeX + (el.width / 2)
      const isCenterAligned = Math.abs(elementCenterX - baseSize.width / 2) < 10

      // centerAlign: true일 때 x는 요소의 중앙 좌표 (bdc-web 호환)
      // translateX(-50%)와 함께 사용되어 요소가 정확히 x 위치에 중앙 정렬됨
      // 중앙 정렬 요소는 x를 캔버스 중앙(167.5)으로 설정
      const finalX = isCenterAligned
        ? baseSize.width / 2
        : Math.round(relativeX * 100) / 100

      const converted: ConvertedElement = {
        type: elementType,
        x: finalX,
        y: Math.round(relativeY * 100) / 100,
        width: shouldUseAutoWidth ? 'auto' : (el.width > 0 ? Math.round(el.width * 100) / 100 : 'auto'),
        zIndex: index + 1,
        editable: el.name.includes('[editable]') || ['groom', 'bride', 'date', 'venue', 'photo'].includes(normalizedName),
      }

      // text 타입은 height 제외 (fontSize로 결정됨)
      // image, vector 타입만 height 포함
      if (el.height && el.height > 0 && elementType !== 'text') {
        converted.height = Math.round(el.height * 100) / 100
      }

      // 중앙 정렬이면 centerAlign 추가 (모든 요소 타입에 적용 - bdc-web 호환)
      if (isCenterAligned) {
        converted.centerAlign = true
      }

      // 텍스트 속성 추가
      if (elementType === 'text') {
        if (el.fontSize) converted.fontSize = el.fontSize
        if (el.fontFamily) converted.fontFamily = mapFigmaFont(el.fontFamily)
        if (el.fontWeight) converted.fontWeight = el.fontWeight
        if (el.color) converted.color = el.color
        if (el.textAlign) converted.align = el.textAlign as 'left' | 'center' | 'right'
        if (el.letterSpacing) converted.letterSpacing = el.letterSpacing

        // lineHeight: Figma에서 가져오거나 기본값 1.0 사용
        if (el.lineHeight) {
          converted.lineHeight = el.lineHeight
        } else {
          // 기본값 1.0 (단일 행 텍스트에 적합)
          converted.lineHeight = 1.0
        }

        // Figma에서 추출한 텍스트 값 저장 (characters 필드)
        if (el.characters && el.characters.trim()) {
          figmaTextValues[normalizedName] = el.characters.trim()
        }
      }

      layout[normalizedName] = converted
    })

    // 모든 카테고리에서 data.wedding 사용 (bdc-web 호환)
    const dataKey = 'wedding'

    // layout에 있는 요소들의 키 목록
    const layoutKeys = Object.keys(layout)

    // 카테고리 data: layout에 있는 모든 텍스트 요소 추가
    // Figma에서 추출한 텍스트 값이 있으면 사용
    const categoryData: Record<string, string> = {}

    // layout의 각 요소를 순회하며 데이터 추가
    for (const key of layoutKeys) {
      const element = layout[key]
      if (!element || typeof element !== 'object') continue

      // 텍스트 타입 요소
      if (element.type === 'text') {
        categoryData[key] = figmaTextValues[key] || key
      }
      // 이미지 타입 요소
      else if (element.type === 'image') {
        categoryData[key] = `/assets/${templateId}/${key}.png`
      }
      // 벡터 타입 요소 (decoration, decoration1, decoration2 등)
      else if (element.type === 'vector') {
        categoryData[key] = `/assets/${templateId}/${key}.png`
      }
    }

    // component data: layout에 있는 요소만 추가
    const componentData: Record<string, string> = {
      backgroundImage: '$.set.cards.main'  // 배경은 항상 포함
    }

    for (const key of layoutKeys) {
      const element = layout[key]
      if (!element || typeof element !== 'object') continue
      if (element.type === 'text' || element.type === 'image' || element.type === 'vector') {
        componentData[key] = `$.data.${dataKey}.${key}`
      }
    }

    // 카테고리에 따라 set 구조 결정
    // 설문(survey) 카테고리는 cards.main만 필요
    const isMinimalSet = category === '설문카드'

    const templateSet = isMinimalSet
      ? {
          cards: {
            main: `/assets/${templateId}/card-main-bg.png`
          }
        }
      : {
          envelope: {
            pattern: `/assets/${templateId}/envelope-pattern.png`,
            seal: `/assets/${templateId}/envelope-seal.png`,
            lining: `/assets/${templateId}/envelope-lining.png`
          },
          page: {
            background: `/assets/${templateId}/page-bg.png`
          },
          cards: {
            main: `/assets/${templateId}/card-main-bg.png`,
            default: `/assets/${templateId}/card-default-bg.png`
          }
        }

    const templateJson = {
      id: templateId || 'wedding-card-new',
      version: '1.0.0',
      name: templateName || '새 웨딩 카드 템플릿',
      category: category,
      figmaNodeId: figmaNodeId || undefined,
      set: templateSet,
      layout: {
        baseSize,
        background: {
          type: 'background' as const,
          x: 0,
          y: 0,
          width: baseSize.width,
          height: baseSize.height,
          zIndex: 0,
          editable: false
        },
        ...layout
      },
      data: {
        [dataKey]: categoryData
      },
      components: [
        {
          id: 'wedding-card-main',
          type: 'template',
          data: componentData
        }
      ]
    }

    let jsonString = JSON.stringify(templateJson, null, 2)
    setGeneratedJson(jsonString)

    // JSON 생성 후 바로 서버에 저장
    setSaving(true)
    setError(null)
    setSaveSuccess(false)
    setImagesDownloaded(false)

    try {
      // 1. Figma 정보가 있으면 먼저 이미지 저장
      if (figmaFileKey && figmaNodeId && figmaToken) {
        const imageResponse = await fetch('/api/figma/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileKey: figmaFileKey,
            nodeId: figmaNodeId,
            templateId,
            apiKey: figmaToken,
          }),
        })

        const imageResult = await imageResponse.json()

        if (imageResponse.ok && imageResult.images?.length > 0) {
          setDownloadedImages(imageResult.images)
          setImagesDownloaded(true)

          // S3 업로드된 이미지 URL을 JSON에 반영
          const updatedJson = { ...templateJson }

          // 이미지 URL 매핑 (name -> path)
          const imageUrlMap: Record<string, string> = {}
          for (const img of imageResult.images) {
            // card-main-bg.png -> card-main-bg
            const nameWithoutExt = img.name.replace(/\.\w+$/, '')
            imageUrlMap[nameWithoutExt] = img.path
            imageUrlMap[img.name] = img.path
          }

          console.log('=== S3 이미지 URL 매핑 ===')
          console.log('imageUrlMap:', imageUrlMap)
          console.log('updatedJson.set:', JSON.stringify(updatedJson.set, null, 2))

          // set.cards.main 등 업데이트
          if (updatedJson.set) {
            if (updatedJson.set.cards?.main && imageUrlMap['card-main-bg']) {
              updatedJson.set.cards.main = imageUrlMap['card-main-bg']
            }
            if (updatedJson.set.cards?.default && imageUrlMap['card-default-bg']) {
              updatedJson.set.cards.default = imageUrlMap['card-default-bg']
            }
            if (updatedJson.set.envelope?.pattern && imageUrlMap['envelope-pattern']) {
              updatedJson.set.envelope.pattern = imageUrlMap['envelope-pattern']
            }
            if (updatedJson.set.envelope?.seal && imageUrlMap['envelope-seal']) {
              updatedJson.set.envelope.seal = imageUrlMap['envelope-seal']
            }
            if (updatedJson.set.envelope?.lining && imageUrlMap['envelope-lining']) {
              updatedJson.set.envelope.lining = imageUrlMap['envelope-lining']
            }
            if (updatedJson.set.page?.background && imageUrlMap['page-bg']) {
              updatedJson.set.page.background = imageUrlMap['page-bg']
            }
          }

          // data 섹션의 이미지 경로도 업데이트
          const dataSection = updatedJson.data[dataKey] as Record<string, string>
          if (dataSection) {
            for (const [key, value] of Object.entries(dataSection)) {
              if (typeof value === 'string' && value.startsWith('/assets/')) {
                // /assets/template-id/filename.png에서 filename 추출
                const filename = value.split('/').pop()?.replace(/\.\w+$/, '')
                if (filename && imageUrlMap[filename]) {
                  dataSection[key] = imageUrlMap[filename]
                }
              }
            }
          }

          console.log('=== S3 URL 업데이트 후 ===')
          console.log('updatedJson.set.cards.main:', updatedJson.set?.cards?.main)

          // 업데이트된 JSON을 저장
          jsonString = JSON.stringify(updatedJson, null, 2)
          setGeneratedJson(jsonString)
        }
      }

      // 2. JSON 저장
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          content: jsonString,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || '저장에 실패했습니다.')
        setStep(4) // 에러가 나도 Step 4로 이동하여 수동 저장 가능
        return
      }

      setSaveSuccess(true)
      setStep(4)
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
      setStep(4)
    } finally {
      setSaving(false)
    }
  }, [parsedElements, bgOffset, baseSize, templateId, templateName, category, figmaNodeId, figmaFileKey, figmaToken])

  // JSON 다운로드
  const downloadJson = useCallback(() => {
    const blob = new Blob([generatedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${templateId || 'wedding-card-new'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [generatedJson, templateId])

  // 클립보드 복사
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedJson)
      alert('클립보드에 복사되었습니다!')
    } catch {
      alert('복사에 실패했습니다.')
    }
  }, [generatedJson])

  // 서버에 JSON 저장
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // 이미지 다운로드 상태
  const [imagesDownloaded, setImagesDownloaded] = useState(false)
  const [downloadedImages, setDownloadedImages] = useState<{ name: string; path: string }[]>([])

  // Step 4 탭 상태 (미리보기가 기본)
  const [step4Tab, setStep4Tab] = useState<'preview' | 'json'>('preview')

  const saveToServer = useCallback(async () => {
    if (!templateId || !generatedJson) {
      setError('템플릿 ID와 JSON이 필요합니다.')
      return
    }

    setSaving(true)
    setError(null)
    setSaveSuccess(false)
    setImagesDownloaded(false)

    try {
      // 1. Figma 정보가 있으면 먼저 이미지 저장
      if (figmaFileKey && figmaNodeId && figmaToken) {
        const imageResponse = await fetch('/api/figma/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileKey: figmaFileKey,
            nodeId: figmaNodeId,
            templateId,
            apiKey: figmaToken,
          }),
        })

        const imageResult = await imageResponse.json()

        if (imageResponse.ok && imageResult.images?.length > 0) {
          setDownloadedImages(imageResult.images)
          setImagesDownloaded(true)

          // S3 업로드된 이미지 URL을 JSON에 반영
          try {
            const currentJson = JSON.parse(generatedJson)

            // 이미지 URL 매핑 (name -> path)
            const imageUrlMap: Record<string, string> = {}
            for (const img of imageResult.images) {
              const nameWithoutExt = img.name.replace(/\.\w+$/, '')
              imageUrlMap[nameWithoutExt] = img.path
              imageUrlMap[img.name] = img.path
            }

            // set.cards.main 등 업데이트
            if (currentJson.set) {
              if (currentJson.set.cards?.main && imageUrlMap['card-main-bg']) {
                currentJson.set.cards.main = imageUrlMap['card-main-bg']
              }
              if (currentJson.set.cards?.default && imageUrlMap['card-default-bg']) {
                currentJson.set.cards.default = imageUrlMap['card-default-bg']
              }
              if (currentJson.set.envelope?.pattern && imageUrlMap['envelope-pattern']) {
                currentJson.set.envelope.pattern = imageUrlMap['envelope-pattern']
              }
              if (currentJson.set.envelope?.seal && imageUrlMap['envelope-seal']) {
                currentJson.set.envelope.seal = imageUrlMap['envelope-seal']
              }
              if (currentJson.set.envelope?.lining && imageUrlMap['envelope-lining']) {
                currentJson.set.envelope.lining = imageUrlMap['envelope-lining']
              }
              if (currentJson.set.page?.background && imageUrlMap['page-bg']) {
                currentJson.set.page.background = imageUrlMap['page-bg']
              }
            }

            // data 섹션의 이미지 경로도 업데이트
            if (currentJson.data) {
              for (const dataKey of Object.keys(currentJson.data)) {
                const dataSection = currentJson.data[dataKey]
                if (dataSection && typeof dataSection === 'object') {
                  for (const [key, value] of Object.entries(dataSection)) {
                    if (typeof value === 'string' && value.startsWith('/assets/')) {
                      const filename = value.split('/').pop()?.replace(/\.\w+$/, '')
                      if (filename && imageUrlMap[filename]) {
                        dataSection[key] = imageUrlMap[filename]
                      }
                    }
                  }
                }
              }
            }

            // 업데이트된 JSON 저장
            const updatedJsonString = JSON.stringify(currentJson, null, 2)
            setGeneratedJson(updatedJsonString)

            // 업데이트된 JSON으로 저장 진행
            const response = await fetch('/api/templates', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                templateId,
                content: updatedJsonString,
              }),
            })

            const result = await response.json()

            if (!response.ok) {
              setError(result.error || '저장에 실패했습니다.')
              return
            }

            setSaveSuccess(true)
            alert(`템플릿이 저장되었습니다!\n- 이미지: S3에 업로드됨\n- JSON: 이미지 URL이 S3 경로로 업데이트됨`)
            return
          } catch (parseErr) {
            console.error('JSON 파싱 오류:', parseErr)
          }
        }
        // 이미지 저장 실패해도 JSON 저장은 계속 진행
      }

      // 2. JSON 저장 (이미지 업로드 없이 또는 실패 시)
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          content: generatedJson,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || '저장에 실패했습니다.')
        return
      }

      setSaveSuccess(true)

      // 성공 메시지 (이미지 포함 여부에 따라 다르게)
      if (imagesDownloaded) {
        alert(`템플릿이 저장되었습니다!\n- JSON: /templates/${templateId}.json\n- 이미지: /assets/${templateId}/`)
      } else {
        alert('템플릿이 서버에 저장되었습니다!')
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }, [templateId, generatedJson, figmaFileKey, figmaNodeId, figmaToken, imagesDownloaded])

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/templates"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← 뒤로
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">새 템플릿 만들기</h1>
            <p className="text-gray-600 mt-1">Figma 메타데이터로 JSON 스키마 자동 생성</p>
          </div>
        </div>
      </div>

      {/* 진행 단계 표시 */}
      <div className="flex items-center gap-4">
        {[
          { num: 1, label: '기본 정보' },
          { num: 2, label: 'Figma 메타데이터' },
          { num: 3, label: '좌표 확인' },
          { num: 4, label: 'JSON 생성' },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s.num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <span className={`ml-2 text-sm ${step >= s.num ? 'text-gray-900' : 'text-gray-500'}`}>
              {s.label}
            </span>
            {idx < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1: 기본 정보 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">1. 기본 정보 입력</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              템플릿 ID *
            </label>
            <input
              type="text"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              placeholder="wedding-card-051"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">형식: wedding-card-XXX</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              템플릿 이름 *
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="따뜻한 시선"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 *
            </label>
            <div className="flex gap-2">
              <select
                value={categoryOptions.some(opt => opt.value === category) ? category : '__custom__'}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCategory(customCategory)
                  } else {
                    setCategory(e.target.value)
                    setCustomCategory('')
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>카테고리 선택</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
                <option value="__custom__">직접 입력</option>
              </select>
            </div>
            {/* 직접 입력 필드 */}
            {(!categoryOptions.some(opt => opt.value === category) || category === '') && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value)
                  setCategory(e.target.value)
                }}
                placeholder="카테고리를 직접 입력하세요"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
            <p className="text-xs text-gray-500 mt-1">
              기존 카테고리를 선택하거나 새로운 카테고리를 직접 입력할 수 있습니다
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!templateId || !templateName || !category}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            다음 →
          </button>
        </div>
      )}

      {/* Step 2: Figma API 연동 */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">2. Figma에서 메타데이터 가져오기</h2>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-2">Figma URL만 붙여넣으면 자동으로 정보를 추출합니다!</p>
            <p>템플릿 프레임을 선택하고 우클릭 → Copy link로 URL을 복사하세요.</p>
          </div>

          {/* Figma URL 입력 (가장 중요!) */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border-2 border-purple-200">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Figma URL 붙여넣기 (자동 파싱)
            </label>
            <input
              type="text"
              value={figmaUrl}
              onChange={(e) => handleFigmaUrlChange(e.target.value)}
              placeholder="https://www.figma.com/design/ABC123/파일명?node-id=46-1150"
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            />
            {urlParseSuccess && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <span>✅</span>
                <span className="text-sm">URL 파싱 성공! File Key와 Node ID가 자동으로 입력되었습니다.</span>
              </div>
            )}
            {figmaUrl && !urlParseSuccess && (
              <div className="mt-2 flex items-center gap-2 text-orange-600">
                <span>⚠️</span>
                <span className="text-sm">URL 형식이 올바르지 않습니다. node-id가 포함된 URL인지 확인해주세요.</span>
              </div>
            )}
          </div>

          {/* Figma Personal Access Token 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Figma Personal Access Token *
            </label>
            <input
              type="password"
              value={figmaToken}
              onChange={(e) => {
                setFigmaToken(e.target.value)
                localStorage.setItem(FIGMA_TOKEN_STORAGE, e.target.value)
              }}
              placeholder="figd_xxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              <a
                href="https://www.figma.com/developers/api#access-tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Figma → Settings → Personal access tokens
              </a>
              에서 발급 (한 번 입력하면 브라우저에 저장됨)
            </p>
            {figmaToken && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <span>✅</span>
                <span className="text-sm">토큰이 입력되었습니다</span>
              </div>
            )}
          </div>

          {/* 자동 파싱된 값 표시 (접이식) */}
          <details className="bg-gray-50 rounded-lg">
            <summary className="px-4 py-2 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
              상세 설정 (자동 입력됨) {figmaFileKey && figmaNodeId && '✅'}
            </summary>
            <div className="px-4 pb-4 space-y-3">
              {/* Figma File Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Figma File Key
                </label>
                <input
                  type="text"
                  value={figmaFileKey}
                  onChange={(e) => {
                    setFigmaFileKey(e.target.value)
                    localStorage.setItem(FIGMA_FILE_KEY_STORAGE, e.target.value)
                  }}
                  placeholder="ABC123xyz..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Figma Node ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Figma Node ID
                </label>
                <input
                  type="text"
                  value={figmaNodeId}
                  onChange={(e) => setFigmaNodeId(e.target.value)}
                  placeholder="46-1150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          </details>

          {/* 성공 메시지 */}
          {fetchSuccess && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <span>✅</span>
              <span>메타데이터를 성공적으로 가져왔습니다! ({parsedElements.length}개 요소)</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={fetchFigmaMetadata}
              disabled={!figmaFileKey || !figmaNodeId || !figmaToken || processing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  가져오는 중...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Figma에서 가져오기
                </>
              )}
            </button>
            <button
              onClick={() => {
                // 수동 입력 모드로 건너뛰기
                setStep(4)
                const emptyTemplate = {
                  id: templateId,
                  version: '1.0.0',
                  name: templateName,
                  category: category,
                  figmaNodeId: figmaNodeId || undefined,
                  layout: {
                    baseSize: { width: 335, height: 515 },
                  },
                  data: {
                    wedding: {
                      groom: '신랑 이름',
                      bride: '신부 이름',
                      date: '2025년 1월 1일',
                      venue: '예식장',
                      photo: '/assets/common/photo.png'
                    }
                  },
                  components: []
                }
                setGeneratedJson(JSON.stringify(emptyTemplate, null, 2))
              }}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              수동 입력으로 건너뛰기
            </button>
          </div>

          {/* 도움말 */}
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-2">💡 간단 사용법:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Figma에서 템플릿 프레임 선택</li>
              <li>우클릭 → <strong>Copy link</strong></li>
              <li>위 입력창에 <strong>붙여넣기</strong> (Ctrl+V / Cmd+V)</li>
              <li><strong>Figma에서 가져오기</strong> 버튼 클릭</li>
            </ol>
          </div>
        </div>
      )}

      {/* Step 3: 좌표 확인 */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">3. 좌표 변환 확인</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">BG 오프셋 (자동 감지)</p>
              <p className="text-lg font-mono">X: {bgOffset.x}, Y: {bgOffset.y}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Base Size</p>
              <p className="text-lg font-mono">{baseSize.width}×{baseSize.height}px</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">추출된 요소 ({parsedElements.length}개)</h3>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left">이름</th>
                    <th className="px-3 py-2 text-left">타입</th>
                    <th className="px-3 py-2 text-left">원본 좌표</th>
                    <th className="px-3 py-2 text-left">변환 좌표</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedElements.map((el, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="px-3 py-2 font-mono">{el.name}</td>
                      <td className="px-3 py-2">{el.type}</td>
                      <td className="px-3 py-2 font-mono text-gray-500">
                        ({el.x}, {el.y})
                      </td>
                      <td className="px-3 py-2 font-mono text-blue-600">
                        ({Math.round((el.x - bgOffset.x) * 100) / 100}, {Math.round((el.y - bgOffset.y) * 100) / 100})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={generateJson}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  저장 중...
                </>
              ) : (
                <>
                  <span>💾</span>
                  템플릿 생성 및 저장 →
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: JSON 생성 완료 */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-800">템플릿이 저장되었습니다!</p>
              <p className="text-sm text-green-700">미리보기에서 요소 위치를 조정하고 저장하세요.</p>
            </div>
          </div>

          {/* 탭 버튼 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setStep4Tab('preview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                step4Tab === 'preview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              미리보기
            </button>
            <button
              onClick={() => setStep4Tab('json')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                step4Tab === 'json'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              JSON 코드
            </button>
          </div>

          {/* 미리보기 탭 */}
          {step4Tab === 'preview' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
              {(() => {
                try {
                  const parsed = JSON.parse(generatedJson)
                  const layout = parsed.layout || {}
                  const data = parsed.data || {}
                  const templateSet = parsed.set || {}

                  return (
                    <LayoutEditor
                      layout={layout}
                      data={data}
                      templateSet={templateSet}
                      onLayoutChange={(newLayout) => {
                        const updated = { ...parsed, layout: newLayout }
                        setGeneratedJson(JSON.stringify(updated, null, 2))
                      }}
                      onSave={async () => {
                        // 변경사항 저장
                        try {
                          const response = await fetch('/api/templates', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              templateId,
                              content: generatedJson,
                            }),
                          })
                          if (response.ok) {
                            alert('저장되었습니다!')
                          }
                        } catch {
                          alert('저장에 실패했습니다.')
                        }
                      }}
                      onReset={() => {
                        // Figma 데이터로 다시 생성
                        if (confirm('레이아웃을 초기 상태로 되돌리시겠습니까?')) {
                          generateJson()
                        }
                      }}
                    />
                  )
                } catch {
                  return (
                    <div className="p-8 text-center text-gray-500">
                      <p>JSON 파싱 오류가 발생했습니다.</p>
                      <p className="text-sm mt-2">JSON 코드 탭에서 수정해주세요.</p>
                    </div>
                  )
                }
              })()}
            </div>
          )}

          {/* JSON 코드 탭 */}
          {step4Tab === 'json' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[500px]">
                <MonacoEditor
                  height="100%"
                  language="json"
                  theme="vs-light"
                  value={generatedJson}
                  onChange={(value) => setGeneratedJson(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>
          )}

          {/* 저장 성공 메시지 */}
          {saveSuccess && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
              <span>✅</span>
              <span>템플릿이 서버에 저장되었습니다!</span>
            </div>
          )}

          {/* 이미지 다운로드 성공 메시지 */}
          {imagesDownloaded && downloadedImages.length > 0 && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span>🖼️</span>
                <span className="font-medium">{downloadedImages.length}개 이미지가 저장되었습니다!</span>
              </div>
              <ul className="text-sm space-y-1">
                {downloadedImages.map((img, idx) => (
                  <li key={idx} className="font-mono text-xs">{img.path}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={copyToClipboard}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📋 클립보드 복사
            </button>
            <button
              onClick={downloadJson}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📥 JSON 다운로드
            </button>
            <button
              onClick={saveToServer}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  저장 중...
                </>
              ) : saveSuccess ? (
                <>
                  <span>✅</span>
                  저장 완료
                </>
              ) : (
                <>
                  <span>💾</span>
                  서버에 저장 (이미지 + JSON)
                </>
              )}
            </button>
            {saveSuccess ? (
              <Link
                href={`/admin/templates/${templateId}`}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>🔗</span>
                편집 페이지로
              </Link>
            ) : (
              <button
                disabled
                className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
                title="먼저 서버에 저장해주세요"
              >
                <span>🔗</span>
                편집 페이지로
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-2">💡 저장 안내:</p>
            <p><strong>서버에 저장</strong> 버튼을 누르면:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Figma에서 이미지 자동 다운로드 → <code className="bg-gray-200 px-1 rounded">/assets/{templateId}/</code></li>
              <li>JSON 템플릿 저장 → <code className="bg-gray-200 px-1 rounded">/templates/{templateId}.json</code></li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
