'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

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

// 카테고리 옵션 (한글 필수)
const CATEGORY_OPTIONS = [
  { value: '웨딩', label: '웨딩' },
  { value: '생일파티', label: '생일파티' },
  { value: '신년카드', label: '신년카드' },
] as const

export default function NewTemplatePage() {
  const [step, setStep] = useState(1)
  const [templateId, setTemplateId] = useState('')
  const [templateName, setTemplateName] = useState('')
  const [category, setCategory] = useState('웨딩')
  const [figmaNodeId, setFigmaNodeId] = useState('')
  const [figmaMetadata, setFigmaMetadata] = useState('')
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 })
  const [baseSize] = useState({ width: 335, height: 515 })
  const [parsedElements, setParsedElements] = useState<FigmaElement[]>([])
  const [generatedJson, setGeneratedJson] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Figma 메타데이터 파싱
  const parseFigmaMetadata = useCallback(() => {
    setError(null)
    setProcessing(true)

    try {
      // XML 형식의 Figma 메타데이터 파싱
      const parser = new DOMParser()
      const doc = parser.parseFromString(figmaMetadata, 'text/xml')

      // BG 요소 찾기
      const bgElement = doc.querySelector('[name="BG"], [name="bg"], [name="background"]')
      if (bgElement) {
        const bgX = parseFloat(bgElement.getAttribute('x') || '0')
        const bgY = parseFloat(bgElement.getAttribute('y') || '0')
        setBgOffset({ x: bgX, y: bgY })
      }

      // 모든 요소 추출
      const elements: FigmaElement[] = []
      const allElements = doc.querySelectorAll('text, rectangle, rounded-rectangle, ellipse, frame, image, vector')

      allElements.forEach((el, index) => {
        const name = el.getAttribute('name') || `element-${index}`
        const type = el.tagName.toLowerCase()

        elements.push({
          id: el.getAttribute('id') || `${index}`,
          name,
          type,
          x: parseFloat(el.getAttribute('x') || '0'),
          y: parseFloat(el.getAttribute('y') || '0'),
          width: parseFloat(el.getAttribute('width') || '0'),
          height: parseFloat(el.getAttribute('height') || '0'),
          fontSize: el.getAttribute('font-size') ? parseFloat(el.getAttribute('font-size')!) : undefined,
          fontFamily: el.getAttribute('font-family') || undefined,
          fontWeight: el.getAttribute('font-weight') ? parseFloat(el.getAttribute('font-weight')!) : undefined,
          color: el.getAttribute('fill') || el.getAttribute('color') || undefined,
          textAlign: el.getAttribute('text-align') || undefined,
          letterSpacing: el.getAttribute('letter-spacing') ? parseFloat(el.getAttribute('letter-spacing')!) : undefined,
          characters: el.textContent || undefined,
        })
      })

      setParsedElements(elements)
      setStep(3)
    } catch (err) {
      setError('메타데이터 파싱에 실패했습니다. XML 형식을 확인해주세요.')
    } finally {
      setProcessing(false)
    }
  }, [figmaMetadata])

  // JSON 생성
  const generateJson = useCallback(() => {
    const layout: Record<string, ConvertedElement> = {}

    parsedElements.forEach((el, index) => {
      // BG 요소는 건너뛰기
      if (el.name.toLowerCase() === 'bg' || el.name.toLowerCase() === 'background') {
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
      const normalizedName = el.name
        .toLowerCase()
        .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^./, (char) => char.toLowerCase())

      const converted: ConvertedElement = {
        type: elementType,
        x: Math.round(relativeX * 100) / 100,
        y: Math.round(relativeY * 100) / 100,
        width: el.width > 0 ? Math.round(el.width * 100) / 100 : 'auto',
        zIndex: index + 1,
        editable: el.name.includes('[editable]') || ['groom', 'bride', 'date', 'venue', 'photo'].includes(normalizedName),
      }

      if (el.height && el.height > 0) {
        converted.height = Math.round(el.height * 100) / 100
      }

      // 텍스트 속성 추가
      if (elementType === 'text') {
        if (el.fontSize) converted.fontSize = el.fontSize
        if (el.fontFamily) converted.fontFamily = `'${el.fontFamily}', serif`
        if (el.fontWeight) converted.fontWeight = el.fontWeight
        if (el.color) converted.color = el.color
        if (el.textAlign) converted.align = el.textAlign as 'left' | 'center' | 'right'
        if (el.letterSpacing) converted.letterSpacing = el.letterSpacing

        // 중앙 정렬 감지
        const centerX = relativeX + (el.width / 2)
        if (Math.abs(centerX - baseSize.width / 2) < 10) {
          converted.centerAlign = true
        }
      }

      layout[normalizedName] = converted
    })

    const templateJson = {
      id: templateId || 'wedding-card-new',
      version: '1.0.0',
      name: templateName || '새 웨딩 카드 템플릿',
      category: category,
      thumbnail: `/assets/${templateId}/card-bg.png`,
      figmaNodeId: figmaNodeId || undefined,
      set: {
        envelope: {
          pattern: '/assets/common/pattern.png',
          seal: '/assets/common/seal.png'
        },
        page: {
          background: '/assets/common/bg.png'
        },
        cards: {
          background: `/assets/${templateId}/card-bg.png`
        }
      },
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
        wedding: {
          groom: '신랑 이름',
          bride: '신부 이름',
          date: '2025년 1월 1일 토요일 오후 2시',
          venue: '예식장 이름',
          photo: '/assets/common/photo.png',
          cardBackground: `/assets/${templateId}/card-bg.png`
        }
      },
      components: [
        {
          id: 'wedding-card-main',
          type: 'template',
          data: {
            groom: '$.data.wedding.groom',
            bride: '$.data.wedding.bride',
            date: '$.data.wedding.date',
            venue: '$.data.wedding.venue',
            photo: '$.data.wedding.photo',
            backgroundImage: '$.data.wedding.cardBackground'
          }
        }
      ]
    }

    setGeneratedJson(JSON.stringify(templateJson, null, 2))
    setStep(4)
  }, [parsedElements, bgOffset, baseSize, templateId, templateName, category, figmaNodeId])

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
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">⚠️ 반드시 한글 카테고리 사용</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Figma Node ID (선택)
            </label>
            <input
              type="text"
              value={figmaNodeId}
              onChange={(e) => setFigmaNodeId(e.target.value)}
              placeholder="46-1150"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!templateId || !templateName}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            다음 →
          </button>
        </div>
      )}

      {/* Step 2: Figma 메타데이터 입력 */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold">2. Figma 메타데이터 입력</h2>

          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-2">Figma MCP로 메타데이터 추출하기:</p>
            <code className="block bg-blue-100 p-2 rounded text-xs">
              mcp__figma-dev-mode-mcp-server__get_metadata({'{'}nodeId: "{figmaNodeId || 'YOUR_NODE_ID'}"{'}'})
            </code>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메타데이터 (XML 형식)
            </label>
            <textarea
              value={figmaMetadata}
              onChange={(e) => setFigmaMetadata(e.target.value)}
              placeholder={`<frame id="46-1150" name="template">
  <rounded-rectangle id="2:2" name="BG" x="21" y="148.5" width="335" height="515" />
  <text id="2:4" name="groom" x="188.5" y="336.9" font-size="20" fill="#333333">신랑</text>
  ...
</frame>`}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← 이전
            </button>
            <button
              onClick={parseFigmaMetadata}
              disabled={!figmaMetadata || processing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {processing ? '파싱 중...' : '파싱하기 →'}
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
                    // 여기에 수동으로 요소 추가
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              JSON 생성 →
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
              <p className="font-medium text-green-800">JSON 스키마가 생성되었습니다!</p>
              <p className="text-sm text-green-700">아래 JSON을 확인하고 필요한 부분을 수정하세요.</p>
            </div>
          </div>

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

          <div className="flex gap-2">
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              💾 JSON 다운로드
            </button>
            <Link
              href={`/admin/templates/${templateId}`}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🔗 템플릿 편집 페이지로
            </Link>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
            <p className="font-medium mb-2">다음 단계:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>다운로드한 JSON 파일을 <code className="bg-gray-200 px-1 rounded">/public/templates/</code> 폴더에 저장</li>
              <li>에셋 이미지를 <code className="bg-gray-200 px-1 rounded">/public/assets/{templateId}/</code> 폴더에 저장</li>
              <li>필요시 React 컴포넌트 생성 (SDUI 패턴 사용)</li>
              <li>렌더러에 템플릿 등록</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
