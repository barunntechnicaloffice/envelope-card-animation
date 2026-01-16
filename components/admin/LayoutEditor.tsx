'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface LayoutElement {
  type: string
  x: number
  y: number
  width: number | 'auto'
  height?: number
  zIndex?: number
  editable?: boolean
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  color?: string
  align?: string
  centerAlign?: boolean
  letterSpacing?: number
  transform?: string
}

interface LayoutData {
  baseSize: { width: number; height: number }
  [key: string]: LayoutElement | { width: number; height: number }
}

interface TemplateSet {
  envelope?: {
    pattern?: string
    seal?: string
    lining?: string
  }
  page?: {
    background?: string
  }
  cards?: {
    main?: string
    default?: string
    background?: string
  }
}

interface LayoutEditorProps {
  layout: LayoutData
  data: Record<string, unknown>
  templateSet?: TemplateSet
  onLayoutChange: (newLayout: LayoutData) => void
  onSave?: () => void
  onReset?: () => void
  isSaving?: boolean
}

export default function LayoutEditor({ layout, data, templateSet, onLayoutChange, onSave, onReset, isSaving }: LayoutEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [guidelines, setGuidelines] = useState<{ type: 'horizontal' | 'vertical'; position: number }[]>([])
  const [showCoordinates, setShowCoordinates] = useState<{ x: number; y: number } | null>(null)
  const [pendingElement, setPendingElement] = useState<string | null>(null)

  const baseSize = layout.baseSize
  const SNAP_THRESHOLD = 5 // 스냅 임계값 (px)
  const DRAG_THRESHOLD = 5 // 드래그 시작 최소 이동 거리 (px)

  // 레이아웃 요소들 추출 (baseSize 제외)
  const layoutElements = Object.entries(layout).filter(
    ([key]) => key !== 'baseSize'
  ) as [string, LayoutElement][]

  // width를 숫자로 변환하는 헬퍼 함수
  const getNumericWidth = (width: number | 'auto'): number => {
    return typeof width === 'number' ? width : 50
  }

  // 가이드라인 계산 (중앙선 + 다른 요소들의 엣지)
  const calculateGuidelines = useCallback((currentKey: string, newX: number, newY: number) => {
    const guides: { type: 'horizontal' | 'vertical'; position: number }[] = []
    const currentElement = layout[currentKey] as LayoutElement
    const currentWidth = getNumericWidth(currentElement.width)
    const currentHeight = currentElement.height || 0

    // 중앙선
    const centerX = baseSize.width / 2
    const centerY = baseSize.height / 2

    // 현재 요소의 중앙
    const elementCenterX = newX + currentWidth / 2
    const elementCenterY = newY + currentHeight / 2

    // 수직 중앙선 스냅
    if (Math.abs(elementCenterX - centerX) < SNAP_THRESHOLD) {
      guides.push({ type: 'vertical', position: centerX })
    }

    // 수평 중앙선 스냅
    if (Math.abs(elementCenterY - centerY) < SNAP_THRESHOLD) {
      guides.push({ type: 'horizontal', position: centerY })
    }

    // 다른 요소들과 정렬
    layoutElements.forEach(([key, el]) => {
      if (key === currentKey || key === 'background') return
      const elWidth = getNumericWidth(el.width)

      // 왼쪽 엣지 정렬
      if (Math.abs(newX - el.x) < SNAP_THRESHOLD) {
        guides.push({ type: 'vertical', position: el.x })
      }
      // 오른쪽 엣지 정렬
      if (Math.abs(newX + currentWidth - (el.x + elWidth)) < SNAP_THRESHOLD) {
        guides.push({ type: 'vertical', position: el.x + elWidth })
      }
      // 위쪽 엣지 정렬
      if (Math.abs(newY - el.y) < SNAP_THRESHOLD) {
        guides.push({ type: 'horizontal', position: el.y })
      }
      // 아래쪽 엣지 정렬
      if (el.height && Math.abs(newY + currentHeight - (el.y + el.height)) < SNAP_THRESHOLD) {
        guides.push({ type: 'horizontal', position: el.y + el.height })
      }
    })

    return guides
  }, [layout, layoutElements, baseSize])

  // 스냅 적용
  const applySnap = useCallback((currentKey: string, x: number, y: number) => {
    let snappedX = x
    let snappedY = y
    const currentElement = layout[currentKey] as LayoutElement
    const currentWidth = getNumericWidth(currentElement.width)
    const currentHeight = currentElement.height || 20

    const centerX = baseSize.width / 2
    const centerY = baseSize.height / 2
    const elementCenterX = x + currentWidth / 2
    const elementCenterY = y + currentHeight / 2

    // 중앙 스냅
    if (Math.abs(elementCenterX - centerX) < SNAP_THRESHOLD) {
      snappedX = centerX - currentWidth / 2
    }
    if (Math.abs(elementCenterY - centerY) < SNAP_THRESHOLD) {
      snappedY = centerY - currentHeight / 2
    }

    // 다른 요소와 스냅
    layoutElements.forEach(([key, el]) => {
      if (key === currentKey || key === 'background') return

      if (Math.abs(x - el.x) < SNAP_THRESHOLD) {
        snappedX = el.x
      }
      if (Math.abs(y - el.y) < SNAP_THRESHOLD) {
        snappedY = el.y
      }
    })

    return { x: snappedX, y: snappedY }
  }, [layout, layoutElements, baseSize])

  // 마우스 다운 핸들러 - 선택된 요소만 드래그 가능
  const handleMouseDown = useCallback((e: React.MouseEvent, key: string) => {
    e.stopPropagation()
    const element = layout[key] as LayoutElement
    if (!element || key === 'background') return

    // 이미 선택된 요소를 클릭한 경우 → 드래그 준비
    if (selectedElement === key) {
      setPendingElement(key)

      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const scaleX = baseSize.width / rect.width
        const scaleY = baseSize.height / rect.height
        const mouseX = (e.clientX - rect.left) * scaleX
        const mouseY = (e.clientY - rect.top) * scaleY
        setDragStartPos({ x: e.clientX, y: e.clientY })
        setDragOffset({
          x: mouseX - element.x,
          y: mouseY - element.y
        })
      }
    } else {
      // 선택되지 않은 요소 클릭 → 선택만 함
      setSelectedElement(key)
    }
  }, [layout, baseSize, selectedElement])

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    // 드래그 준비 상태에서 임계값 체크
    if (pendingElement && dragStartPos && !isDragging) {
      const dx = Math.abs(e.clientX - dragStartPos.x)
      const dy = Math.abs(e.clientY - dragStartPos.y)
      if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
        // 드래그 시작
        setIsDragging(true)
      } else {
        return // 아직 임계값 미달
      }
    }

    if (!isDragging || !selectedElement || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const scaleX = baseSize.width / rect.width
    const scaleY = baseSize.height / rect.height

    let newX = (e.clientX - rect.left) * scaleX - dragOffset.x
    let newY = (e.clientY - rect.top) * scaleY - dragOffset.y

    // 경계 제한
    const element = layout[selectedElement] as LayoutElement
    const elementWidth = getNumericWidth(element.width)
    const elementHeight = element.height || 20
    newX = Math.max(0, Math.min(baseSize.width - elementWidth, newX))
    newY = Math.max(0, Math.min(baseSize.height - elementHeight, newY))

    // 스냅 적용
    const snapped = applySnap(selectedElement, newX, newY)
    newX = snapped.x
    newY = snapped.y

    // 가이드라인 업데이트
    const guides = calculateGuidelines(selectedElement, newX, newY)
    setGuidelines(guides)

    // 좌표 표시
    setShowCoordinates({ x: Math.round(newX * 100) / 100, y: Math.round(newY * 100) / 100 })

    // 레이아웃 업데이트
    const newLayout = {
      ...layout,
      [selectedElement]: {
        ...element,
        x: Math.round(newX * 100) / 100,
        y: Math.round(newY * 100) / 100
      }
    }
    onLayoutChange(newLayout)
  }, [isDragging, pendingElement, dragStartPos, selectedElement, layout, baseSize, dragOffset, applySnap, calculateGuidelines, onLayoutChange, DRAG_THRESHOLD])

  // 마우스 업 핸들러 - 선택 상태는 유지
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setPendingElement(null)
    setDragStartPos(null)
    setGuidelines([])
    // 좌표 표시만 잠시 후 숨김 (선택은 유지)
    setTimeout(() => setShowCoordinates(null), 1500)
  }, [])

  // 전역 마우스 이벤트 리스너
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp()
      }
    }

    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [isDragging, handleMouseUp])

  // 컨테이너 클릭 시 선택 해제 (빈 공간 클릭 시에만)
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // 요소가 아닌 빈 공간을 클릭했을 때만 선택 해제
    if (e.target === e.currentTarget) {
      setSelectedElement(null)
    }
  }, [])

  // 요소 데이터 가져오기
  const getElementData = (key: string) => {
    const weddingData = data.wedding as Record<string, string> | undefined
    if (!weddingData) return key

    switch (key) {
      case 'groom': return weddingData.groom || '신랑'
      case 'bride': return weddingData.bride || '신부'
      case 'date': return weddingData.date || '날짜'
      case 'venue': return weddingData.venue || '장소'
      case 'text': return weddingData.text || '초대 문구'
      case 'separator': return weddingData.separator || '&'
      default: return key
    }
  }

  // 이미지 URL 가져오기
  const getImageUrl = (key: string) => {
    const weddingData = data.wedding as Record<string, string> | undefined
    if (!weddingData) return null

    switch (key) {
      case 'photo': return weddingData.photo
      case 'decoration': return weddingData.decoration || weddingData.decorationImage
      case 'background': return weddingData.cardBackground || templateSet?.cards?.main
      // vector 키도 decoration 이미지로 시도
      case 'vector': return weddingData.decoration || weddingData.decorationImage
      default: return null
    }
  }

  // 배경 이미지 URL
  const backgroundImageUrl = (() => {
    const weddingData = data.wedding as Record<string, string> | undefined
    return weddingData?.cardBackground || templateSet?.cards?.main || null
  })()

  // 요소 렌더링 스타일
  const getElementStyle = (key: string, el: LayoutElement): React.CSSProperties => {
    const isSelected = selectedElement === key
    const pxToPercent = (px: number, base: number) => `${(px / base) * 100}%`

    // centerAlign 또는 transform 처리
    let transform: string | undefined = undefined
    let left: string = pxToPercent(el.x, baseSize.width)

    if (el.centerAlign) {
      left = '50%'
      transform = 'translateX(-50%)'
    } else if (el.transform) {
      transform = el.transform
    }

    return {
      position: 'absolute',
      left,
      top: pxToPercent(el.y, baseSize.height),
      width: typeof el.width === 'number' ? pxToPercent(el.width, baseSize.width) : 'auto',
      height: el.height ? pxToPercent(el.height, baseSize.height) : 'auto',
      zIndex: el.zIndex || 1,
      cursor: key === 'background' ? 'default' : 'move',
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      outlineOffset: '2px',
      backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      fontSize: el.fontSize ? `${el.fontSize}px` : undefined,
      fontFamily: el.fontFamily,
      fontWeight: el.fontWeight,
      color: el.color,
      textAlign: el.align as 'left' | 'center' | 'right' | undefined,
      letterSpacing: el.letterSpacing,
      transform,
      userSelect: 'none',
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* 에디터 영역 - 가운데 정렬 */}
      <div className="flex-1 flex flex-col items-center">
        {/* 상단 안내 및 버튼 영역 */}
        <div className="w-full max-w-[400px] mb-4">
          <div className="flex flex-col items-center gap-3">
            {/* 안내 문구 */}
            <p className="text-sm text-gray-500 text-center">
              요소 클릭 → 선택 / 선택된 요소 드래그 → 이동
            </p>

            {/* 좌표 표시 */}
            {showCoordinates && (
              <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono">
                x: {showCoordinates.x}, y: {showCoordinates.y}
              </div>
            )}

            {/* 버튼 영역 */}
            <div className="flex gap-2">
              {onReset && (
                <button
                  onClick={onReset}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  초기화
                </button>
              )}
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '레이아웃 저장'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 템플릿 미리보기 */}
        <div
          ref={containerRef}
          className="relative bg-white rounded-lg overflow-hidden shadow-lg border-2 border-gray-200"
          style={{ width: 335, height: 515 }}
          onClick={handleContainerClick}
          onMouseMove={handleMouseMove}
        >
          {/* 배경 이미지 */}
          {backgroundImageUrl && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ zIndex: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={backgroundImageUrl}
                alt="배경"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          {/* 중앙 가이드라인 (항상 표시, 연하게) */}
          <div
            className="absolute top-0 bottom-0 w-px bg-blue-200 pointer-events-none"
            style={{ left: '50%', opacity: 0.5, zIndex: 999 }}
          />
          <div
            className="absolute left-0 right-0 h-px bg-blue-200 pointer-events-none"
            style={{ top: '50%', opacity: 0.5, zIndex: 999 }}
          />

          {/* 동적 가이드라인 */}
          {guidelines.map((guide, idx) => (
            <div
              key={idx}
              className={`absolute pointer-events-none ${
                guide.type === 'vertical' ? 'top-0 bottom-0 w-px' : 'left-0 right-0 h-px'
              } bg-red-500`}
              style={{
                [guide.type === 'vertical' ? 'left' : 'top']:
                  `${(guide.position / (guide.type === 'vertical' ? baseSize.width : baseSize.height)) * 100}%`,
                zIndex: 1000
              }}
            />
          ))}

          {/* 레이아웃 요소들 */}
          {layoutElements.map(([key, el]) => {
            if (key === 'background') return null

            const imageUrl = getImageUrl(key)
            const isSelected = selectedElement === key

            return (
              <div
                key={key}
                style={getElementStyle(key, el)}
                onMouseDown={(e) => handleMouseDown(e, key)}
                title={`${key}: (${el.x}, ${el.y})`}
              >
                {/* 선택된 요소에 삭제 버튼 표시 */}
                {isSelected && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`"${key}" 요소를 삭제하시겠습니까?`)) {
                        const newLayout = { ...layout }
                        delete newLayout[key]
                        onLayoutChange(newLayout)
                        setSelectedElement(null)
                      }
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md z-50"
                    title="요소 삭제"
                  >
                    ×
                  </button>
                )}
                {el.type === 'text' && (
                  <span style={{ whiteSpace: 'pre-line' }}>{getElementData(key)}</span>
                )}
                {el.type === 'image' && (
                  imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={key}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // 이미지 로드 실패 시 플레이스홀더 표시
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        target.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">${key === 'photo' ? '📷 사진' : key}</div>`
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                      {key === 'photo' ? '📷 사진' : key}
                    </div>
                  )
                )}
                {el.type === 'vector' && (
                  imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={key}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  ) : (
                    // 이미지 없는 vector는 점선 테두리만 표시
                    <div className="w-full h-full border border-dashed border-purple-300 rounded flex items-center justify-center">
                      <span className="text-purple-300 text-xs">{key}</span>
                    </div>
                  )
                )}
                {el.type === 'container' && (
                  // container는 점선 테두리로 영역만 표시
                  <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center">
                    <span className="text-gray-300 text-xs">{key}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 선택된 요소 정보 - 사이드바 */}
      <div className="w-full lg:w-64 lg:flex-shrink-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center lg:text-left">요소 속성</h3>
        {selectedElement ? (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-xs text-gray-500">이름</label>
              <p className="font-mono text-sm">{selectedElement}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500">타입</label>
              <p className="font-mono text-sm">{(layout[selectedElement] as LayoutElement).type}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">X</label>
                <input
                  type="number"
                  step="0.01"
                  value={Number((layout[selectedElement] as LayoutElement).x) || 0}
                  onChange={(e) => {
                    const newLayout = {
                      ...layout,
                      [selectedElement]: {
                        ...(layout[selectedElement] as LayoutElement),
                        x: parseFloat(e.target.value) || 0
                      }
                    }
                    onLayoutChange(newLayout)
                  }}
                  className="w-full px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Y</label>
                <input
                  type="number"
                  step="0.01"
                  value={Number((layout[selectedElement] as LayoutElement).y) || 0}
                  onChange={(e) => {
                    const newLayout = {
                      ...layout,
                      [selectedElement]: {
                        ...(layout[selectedElement] as LayoutElement),
                        y: parseFloat(e.target.value) || 0
                      }
                    }
                    onLayoutChange(newLayout)
                  }}
                  className="w-full px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-500">너비</label>
                <input
                  type="number"
                  step="0.01"
                  value={typeof (layout[selectedElement] as LayoutElement).width === 'number'
                    ? (layout[selectedElement] as LayoutElement).width
                    : ''}
                  placeholder="auto"
                  onChange={(e) => {
                    const newLayout = {
                      ...layout,
                      [selectedElement]: {
                        ...(layout[selectedElement] as LayoutElement),
                        width: e.target.value ? parseFloat(e.target.value) : 'auto' as const
                      }
                    }
                    onLayoutChange(newLayout as LayoutData)
                  }}
                  className="w-full px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">높이</label>
                <input
                  type="number"
                  step="0.01"
                  value={typeof (layout[selectedElement] as LayoutElement).height === 'number'
                    ? (layout[selectedElement] as LayoutElement).height
                    : ''}
                  placeholder="auto"
                  onChange={(e) => {
                    const newLayout = {
                      ...layout,
                      [selectedElement]: {
                        ...(layout[selectedElement] as LayoutElement),
                        height: e.target.value ? parseFloat(e.target.value) : undefined
                      }
                    }
                    onLayoutChange(newLayout)
                  }}
                  className="w-full px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500">레이어 순서 (숫자가 클수록 앞)</label>
              <input
                type="number"
                value={(layout[selectedElement] as LayoutElement).zIndex || 0}
                onChange={(e) => {
                  const newLayout = {
                    ...layout,
                    [selectedElement]: {
                      ...(layout[selectedElement] as LayoutElement),
                      zIndex: parseInt(e.target.value) || 0
                    }
                  }
                  onLayoutChange(newLayout)
                }}
                className="w-full px-2 py-1 border rounded text-sm font-mono"
              />
            </div>
            {/* 텍스트 요소일 때만 text-align 표시 */}
            {(layout[selectedElement] as LayoutElement).type === 'text' && (
              <div>
                <label className="text-xs text-gray-500">텍스트 정렬</label>
                <select
                  value={(layout[selectedElement] as LayoutElement).align || 'left'}
                  onChange={(e) => {
                    const newLayout = {
                      ...layout,
                      [selectedElement]: {
                        ...(layout[selectedElement] as LayoutElement),
                        align: e.target.value as 'left' | 'center' | 'right'
                      }
                    }
                    onLayoutChange(newLayout)
                  }}
                  className="w-full px-2 py-1 border rounded text-sm bg-white"
                >
                  <option value="left">왼쪽 (left)</option>
                  <option value="center">가운데 (center)</option>
                  <option value="right">오른쪽 (right)</option>
                </select>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-400 text-sm">
            요소를 선택하세요
          </div>
        )}

        {/* 요소 목록 */}
        <h3 className="text-sm font-semibold text-gray-900 mt-6 mb-3 text-center lg:text-left">요소 목록</h3>
        <div className="space-y-1">
          {layoutElements
            .filter(([key]) => key !== 'background')
            .map(([key, el]) => (
              <button
                key={key}
                onClick={() => setSelectedElement(key)}
                className={`w-full px-3 py-2 text-left text-sm rounded transition-colors ${
                  selectedElement === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="font-mono">{key}</span>
                <span className="text-xs text-gray-400 ml-2">({el.type})</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
