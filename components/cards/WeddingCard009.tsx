import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard009Data extends WeddingData {
  groomLabel?: string
  brideLabel?: string
  decoration?: string
}

interface WeddingCard009Props {
  data: WeddingCard009Data
  layout?: any  // JSON layout 객체
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard009({
  data,
  layout,
  className,
  style
}: WeddingCard009Props) {
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
        backgroundColor: '#F9F9F9'
      }}
    >
      {/* 배경 이미지 */}
      {data.cardBackground && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${data.cardBackground})`,
            backgroundSize: layout.background.backgroundSize || 'cover',
            backgroundPosition: layout.background.backgroundPosition || 'center',
            zIndex: layout.background.zIndex || 0
          }}
        />
      )}

      {/* 사진 */}
      {data.photo && layout.photo && (
        <div style={{
          ...renderLayoutElement('photo', layout.photo, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.photo}
            alt="Wedding Photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.photo.objectFit || 'cover'
            }}
          />
        </div>
      )}

      {/* GROOM 라벨 */}
      {data.groomLabel && layout.groomLabel && (
        <p style={renderLayoutElement('groomLabel', layout.groomLabel, baseSize, data)}>
          {data.groomLabel}
        </p>
      )}

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Decoration (중앙 장식) */}
      {data.decoration && layout.decoration && (
        <div style={{
          ...renderLayoutElement('decoration', layout.decoration, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.decoration}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* BRIDE 라벨 */}
      {data.brideLabel && layout.brideLabel && (
        <p style={renderLayoutElement('brideLabel', layout.brideLabel, baseSize, data)}>
          {data.brideLabel}
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
    </div>
  )
}
