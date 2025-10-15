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
    style.left = '50%'
    style.top = pxToPercent(layout.y, baseSize.height)
    style.transform = 'translateX(-50%)'
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
