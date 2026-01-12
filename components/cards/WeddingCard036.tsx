import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard036Data extends WeddingData {
  title?: string
  separator?: string
}

interface WeddingCard036Props {
  data: WeddingCard036Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard036({
  data,
  layout,
  className,
  style
}: WeddingCard036Props) {
  if (!layout) {
    return (
      <div style={{...style, padding: '20px', backgroundColor: '#fff'}}>
        Layout이 필요합니다
      </div>
    )
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
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* 배경 이미지 */}
      {data.cardBackground && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${data.cardBackground})`,
            backgroundSize: 'cover',
            zIndex: layout.background.zIndex || 0
          }}
        />
      )}

      {/* 타이틀 (OUR WEDDING DAY) */}
      {data.title && layout.title && (
        <p style={renderLayoutElement('title', layout.title, baseSize, data)}>
          {data.title}
        </p>
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

      {/* 날짜 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* separator */}
      {layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          {data.separator || '&'}
        </p>
      )}

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
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
