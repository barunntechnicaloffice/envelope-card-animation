import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard020Data extends WeddingData {
  title?: string
  separator?: string
}

interface WeddingCard020Props {
  data: WeddingCard020Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard020({
  data,
  layout,
  className,
  style
}: WeddingCard020Props) {
  if (!layout) {
    return <div style={{...style, padding: '20px', backgroundColor: '#fff'}}>Layout이 필요합니다</div>
  }

  const { baseSize } = layout

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      {/* 배경 이미지 */}
      {data.backgroundImage && layout.background && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${data.backgroundImage})`,
          backgroundSize: layout.background.backgroundSize || 'cover',
          backgroundPosition: layout.background.backgroundPosition || 'center',
          zIndex: layout.background.zIndex || 0
        }} />
      )}

      {/* Title (OUR LOVE STORY) */}
      {data.title && layout.title && (
        <p style={renderLayoutElement('title', layout.title, baseSize, data)}>
          {data.title}
        </p>
      )}

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Separator (&) */}
      {data.separator && layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          {data.separator}
        </p>
      )}

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* 날짜 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {/* 장소 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
