'use client'

import type { LayoutElement, LayoutSchema } from '@/types/server-driven-ui/schema'

/**
 * 완전한 SDUI 렌더러
 * JSON layout만 보고 모든 요소를 동적으로 렌더링
 */

interface DynamicLayoutRendererProps {
  layout: LayoutSchema
  data: Record<string, any>
  className?: string
  style?: React.CSSProperties
}

/**
 * 픽셀 → 백분율 변환
 */
function pxToPercent(px: number, base: number): string {
  return `${(px / base) * 100}%`
}

/**
 * Layout Element → CSS 스타일 변환
 */
function elementToStyle(
  element: LayoutElement,
  baseWidth: number,
  baseHeight: number
): React.CSSProperties {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: pxToPercent(element.x, baseWidth),
    top: pxToPercent(element.y, baseHeight),
    zIndex: element.zIndex
  }

  // width 처리 (auto 또는 픽셀)
  if (element.width === 'auto') {
    style.width = 'auto'
  } else if (element.width !== undefined) {
    style.width = pxToPercent(element.width, baseWidth)
  }

  // height 처리
  if (element.height !== undefined) {
    style.height = pxToPercent(element.height, baseHeight)
  }

  return style
}

/**
 * Text Element 렌더링
 */
function renderTextElement(
  key: string,
  element: any,
  data: Record<string, any>,
  baseWidth: number,
  baseHeight: number
): React.ReactNode {
  const baseStyle = elementToStyle(element, baseWidth, baseHeight)

  const textStyle: React.CSSProperties = {
    ...baseStyle,
    fontSize: element.fontSize ? `${element.fontSize}px` : '16px',
    fontFamily: element.fontFamily || 'inherit',
    fontWeight: element.fontWeight || 400,
    color: element.color || '#000',
    letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : 'normal',
    lineHeight: element.lineHeight || 'normal',
    textAlign: element.align || 'left',
    textTransform: element.textTransform || 'none',
    margin: 0,
    padding: 0
  }

  // width가 auto이고 textAlign이 center인 경우 중앙 정렬 처리
  if (element.width === 'auto' && element.align === 'center') {
    textStyle.left = '50%'
    textStyle.transform = 'translateX(-50%)'
  }

  // data에서 텍스트 가져오기 (key 이름으로 매칭)
  const text = data[key] || key

  return (
    <p key={key} style={textStyle}>
      {text}
    </p>
  )
}

/**
 * Image Element 렌더링
 */
function renderImageElement(
  key: string,
  element: any,
  data: Record<string, any>,
  baseWidth: number,
  baseHeight: number
): React.ReactNode {
  const baseStyle = elementToStyle(element, baseWidth, baseHeight)

  const containerStyle: React.CSSProperties = {
    ...baseStyle,
    overflow: element.type === 'image' ? 'hidden' : 'visible'
  }

  // data에서 이미지 경로 가져오기
  // decoration → decorationImage, photo → photo
  let imageSrc = data[key]
  if (!imageSrc && key === 'decoration') {
    imageSrc = data.decorationImage
  }
  if (!imageSrc) {
    imageSrc = `/assets/common/${key}.png`
  }

  return (
    <div key={key} style={containerStyle}>
      <img
        src={imageSrc}
        alt={key}
        style={{
          width: '100%',
          height: '100%',
          objectFit: element.objectFit || 'cover',
          display: 'block'
        }}
      />
    </div>
  )
}

/**
 * Vector Element 렌더링 (SVG)
 */
function renderVectorElement(
  key: string,
  element: any,
  data: Record<string, any>,
  baseWidth: number,
  baseHeight: number
): React.ReactNode {
  const baseStyle = elementToStyle(element, baseWidth, baseHeight)

  // data에서 SVG 경로 가져오기
  const svgSrc = data[key] || `/assets/common/${key}.svg`

  return (
    <div key={key} style={baseStyle}>
      <img
        src={svgSrc}
        alt={key}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  )
}

/**
 * Background Element 렌더링
 */
function renderBackgroundElement(
  key: string,
  element: any,
  data: Record<string, any>,
  baseWidth: number,
  baseHeight: number
): React.ReactNode {
  const backgroundImage = data.backgroundImage || data.cardBackground

  if (!backgroundImage) {
    return null
  }

  return (
    <div
      key={key}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: element.backgroundSize || 'cover',
        backgroundPosition: element.backgroundPosition || 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: element.backgroundColor,
        zIndex: element.zIndex || 0
      }}
    />
  )
}

/**
 * 메인 렌더러
 */
export function DynamicLayoutRenderer({
  layout,
  data,
  className,
  style
}: DynamicLayoutRendererProps) {
  const { baseSize, ...elements } = layout

  if (!baseSize) {
    return <div>Error: baseSize is missing in layout</div>
  }

  const { width: baseWidth, height: baseHeight } = baseSize

  console.log('🎨 DynamicLayoutRenderer')
  console.log('Layout:', layout)
  console.log('Data:', data)
  console.log('Elements:', elements)

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#EFEEEB'
      }}
    >
      {/* Layout 객체의 모든 요소를 동적으로 렌더링 */}
      {Object.entries(elements).map(([key, element]) => {
        if (!element || typeof element !== 'object' || !('type' in element)) {
          console.warn(`⚠️ Skipping invalid element: ${key}`, element)
          return null
        }

        const layoutElement = element as LayoutElement

        console.log(`📍 Rendering element: ${key}`, layoutElement)

        switch (layoutElement.type) {
          case 'text':
            return renderTextElement(key, layoutElement, data, baseWidth, baseHeight)

          case 'image':
            return renderImageElement(key, layoutElement, data, baseWidth, baseHeight)

          case 'vector':
            return renderVectorElement(key, layoutElement, data, baseWidth, baseHeight)

          case 'background':
            return renderBackgroundElement(key, layoutElement, data, baseWidth, baseHeight)

          case 'container':
            // Container는 추후 구현
            console.warn(`Container element not yet implemented: ${key}`)
            return null

          default:
            console.warn(`Unknown element type: ${(layoutElement as any).type}`)
            return null
        }
      })}
    </div>
  )
}
