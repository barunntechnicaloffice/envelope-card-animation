import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard017Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard017({
  data,
  layout,
  className,
  style
}: WeddingCard017Props) {
  if (!layout) {
    return <div style={{...style, padding: '20px', backgroundColor: '#faf8f5'}}>Layout이 필요합니다</div>
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
        backgroundColor: '#faf8f5'
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

      {/* 장식 이미지 */}
      {data.decoration && layout.decoration && (
        <div style={renderLayoutElement('decoration', layout.decoration, baseSize, data)}>
          <img
            src={data.decoration}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
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
