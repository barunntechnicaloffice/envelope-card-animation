import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard018Data extends WeddingData {
  month?: string
  day?: string
}

interface WeddingCard018Props {
  data: WeddingCard018Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard018({
  data,
  layout,
  className,
  style
}: WeddingCard018Props) {
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

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* 월 */}
      {layout.month && data.month && (
        <p style={renderLayoutElement('month', layout.month, baseSize, data)}>
          {data.month}
        </p>
      )}

      {/* 날짜 구분선 */}
      {layout.dateDivider && (
        <div style={renderLayoutElement('dateDivider', layout.dateDivider, baseSize, data)}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#333333'
          }} />
        </div>
      )}

      {/* 일 */}
      {layout.day && data.day && (
        <p style={renderLayoutElement('day', layout.day, baseSize, data)}>
          {data.day}
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
