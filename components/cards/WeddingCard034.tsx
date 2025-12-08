import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard034Data extends WeddingData {
  weddingDayLabel?: string
  groomLabel?: string
  brideLabel?: string
  decoration?: string
}

interface WeddingCard034Props {
  data: WeddingCard034Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard034({
  data,
  layout,
  className,
  style
}: WeddingCard034Props) {
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
        backgroundColor: '#E3ECF8'
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
            zIndex: 2
          }}
        />
      )}

      {/* WEDDING DAY 라벨 */}
      {data.weddingDayLabel && layout.weddingDayLabel && (
        <p style={renderLayoutElement('weddingDayLabel', layout.weddingDayLabel, baseSize, data)}>
          {data.weddingDayLabel}
        </p>
      )}

      {/* 날짜 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
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

      {/* 데코레이션 (비행기/꽃 디자인) */}
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
    </div>
  )
}
