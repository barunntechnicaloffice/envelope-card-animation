import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard037Data extends WeddingData {
  decoration?: string
}

interface WeddingCard037Props {
  data: WeddingCard037Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard037({
  data,
  layout,
  className,
  style
}: WeddingCard037Props) {
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

      {/* 상단 장식 이미지 */}
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
              objectFit: 'cover'
            }}
          />
        </div>
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

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* and 텍스트 */}
      {layout.and && (
        <p style={renderLayoutElement('and', layout.and, baseSize, data)}>
          &
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
