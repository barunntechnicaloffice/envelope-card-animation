/**
 * 레이아웃 유틸리티 함수
 * 절대 픽셀 → 백분율 변환
 */

import type { BaseSize, Position, Size, ElementLayout, TextElementLayout, TextBlockLayout } from '@/types/card-layout'

/**
 * 픽셀 → 백분율 변환
 */
export function pxToPercent(px: number, base: number): string {
  return `${(px / base) * 100}%`
}

/**
 * Position 객체를 CSS 백분율로 변환
 */
export function positionToStyle(position: Position, baseSize: BaseSize): React.CSSProperties {
  return {
    left: pxToPercent(position.x, baseSize.width),
    top: pxToPercent(position.y, baseSize.height)
  }
}

/**
 * Size 객체를 CSS 백분율로 변환
 */
export function sizeToStyle(size: Size, baseSize: BaseSize): React.CSSProperties {
  return {
    width: pxToPercent(size.width, baseSize.width),
    height: pxToPercent(size.height, baseSize.height)
  }
}

/**
 * ElementLayout → CSS 스타일
 */
export function elementLayoutToStyle(
  layout: ElementLayout,
  baseSize: BaseSize
): React.CSSProperties {
  return {
    position: 'absolute',
    ...positionToStyle(layout, baseSize),
    ...sizeToStyle(layout, baseSize),
    ...(layout.zIndex !== undefined && { zIndex: layout.zIndex })
  }
}

/**
 * TextElementLayout → CSS 스타일
 */
export function textLayoutToStyle(
  layout: TextElementLayout,
  baseSize: BaseSize
): React.CSSProperties {
  const style: React.CSSProperties = {
    position: 'absolute',
    fontFamily: layout.fontFamily,
    fontSize: `${layout.fontSize}px`,
    color: layout.color,
    margin: 0,
    lineHeight: 'normal',
    whiteSpace: 'nowrap',
    ...(layout.zIndex !== undefined && { zIndex: layout.zIndex })
  }

  // letterSpacing
  if (layout.letterSpacing !== undefined) {
    style.letterSpacing = `${layout.letterSpacing}px`
  }

  // width가 있으면 추가
  if (layout.width !== undefined) {
    style.width = pxToPercent(layout.width, baseSize.width)
  }

  // 정렬에 따라 left/right 설정
  if (layout.align === 'left') {
    style.left = pxToPercent(layout.x, baseSize.width)
    style.top = pxToPercent(layout.y, baseSize.height)
    style.textAlign = 'left'
  } else if (layout.align === 'right') {
    // Figma x는 항상 텍스트의 왼쪽 시작점이므로 left 사용
    style.left = pxToPercent(layout.x, baseSize.width)
    style.top = pxToPercent(layout.y, baseSize.height)
    style.textAlign = 'right'
  } else {
    // center
    style.left = pxToPercent(layout.x, baseSize.width)
    style.top = pxToPercent(layout.y, baseSize.height)
    style.textAlign = 'center'
  }

  return style
}

/**
 * TextBlockLayout → CSS 스타일 (여러 줄 텍스트)
 */
export function textBlockLayoutToStyle(
  layout: TextBlockLayout,
  baseSize: BaseSize
): React.CSSProperties {
  const style: React.CSSProperties = {
    position: 'absolute',
    fontFamily: layout.fontFamily,
    fontSize: `${layout.fontSize}px`,
    color: layout.color,
    textAlign: layout.align,
    lineHeight: layout.lineHeight,
    ...(layout.zIndex !== undefined && { zIndex: layout.zIndex })
  }

  // width가 전체 폭이면 left: 0, right: 0 사용
  if (layout.width === baseSize.width) {
    style.left = 0
    style.right = 0
    style.top = pxToPercent(layout.y, baseSize.height)

    if (layout.paddingX !== undefined) {
      style.paddingLeft = pxToPercent(layout.paddingX, baseSize.width)
      style.paddingRight = pxToPercent(layout.paddingX, baseSize.width)
    }
  } else {
    // 고정 폭인 경우
    if (layout.align === 'center') {
      style.left = '50%'
      style.transform = 'translateX(-50%)'
    } else if (layout.align === 'left') {
      style.left = pxToPercent(layout.x, baseSize.width)
    } else {
      const rightPx = baseSize.width - layout.x
      style.right = pxToPercent(rightPx, baseSize.width)
    }

    style.top = pxToPercent(layout.y, baseSize.height)
    style.width = pxToPercent(layout.width, baseSize.width)
  }

  return style
}

/**
 * 백분율 → 픽셀 역변환 (드래그 편집 시 사용)
 */
export function percentToPx(percent: string, base: number): number {
  const value = parseFloat(percent)
  return (value / 100) * base
}

/**
 * 이벤트 좌표 → 기준 캔버스 좌표 변환 (드래그 편집용)
 */
export function eventToCanvasCoords(
  event: { clientX: number; clientY: number },
  containerElement: HTMLElement,
  baseSize: BaseSize
): Position {
  const rect = containerElement.getBoundingClientRect()
  const scale = rect.width / baseSize.width

  return {
    x: (event.clientX - rect.left) / scale,
    y: (event.clientY - rect.top) / scale
  }
}

/**
 * 범용 레이아웃 요소 렌더링 헬퍼
 * JSON layout의 모든 타입을 자동으로 처리
 */
export function renderLayoutElement(
  key: string,
  element: any,
  baseSize: BaseSize,
  data: Record<string, any>
): React.CSSProperties {
  const pxToPercent = (px: number, base: number) => `${(px / base) * 100}%`

  const style: React.CSSProperties = {
    position: 'absolute',
    zIndex: element.zIndex || 0,
    margin: 0
  }

  // right 속성이 있으면 right 사용, 없으면 left 사용
  if (element.right !== undefined) {
    style.right = pxToPercent(element.right, baseSize.width)
  } else {
    style.left = pxToPercent(element.x, baseSize.width)
  }

  style.top = pxToPercent(element.y, baseSize.height)

  // width 처리 (auto 지원)
  if (element.width !== undefined) {
    style.width = element.width === 'auto' ? 'auto' : pxToPercent(element.width, baseSize.width)
  }

  // height 처리
  if (element.height !== undefined) {
    style.height = pxToPercent(element.height, baseSize.height)
  }

  // 텍스트 스타일
  if (element.type === 'text') {
    style.fontFamily = element.fontFamily || "'NanumMyeongjo', serif"
    style.fontSize = `${element.fontSize || 16}px`
    style.fontWeight = element.fontWeight || 400
    style.color = element.color || '#333333'
    style.textAlign = element.align || 'center'
    style.lineHeight = element.lineHeight || 'normal'

    if (element.letterSpacing !== undefined) {
      style.letterSpacing = `${element.letterSpacing}px`
    }

    if (element.textTransform) {
      style.textTransform = element.textTransform as any
    }

    // centerAlign 처리
    if (element.centerAlign) {
      style.transform = 'translateX(-50%)'
    }
  }

  // 이미지 스타일
  if (element.type === 'image') {
    style.overflow = 'hidden'
  }

  // borderRadius 처리
  if (element.borderRadius !== undefined) {
    style.borderRadius = element.borderRadius
  }

  // transform 속성 처리 (JSON에서 명시적으로 제공된 경우)
  if (element.transform) {
    style.transform = element.transform
  }

  // transformOrigin 속성 처리
  if (element.transformOrigin) {
    style.transformOrigin = element.transformOrigin
  }

  return style
}
