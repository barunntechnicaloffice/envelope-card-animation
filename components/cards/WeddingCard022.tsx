import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard022Data extends WeddingData {
  separator?: string
  photo?: string
  decoration?: string
}

interface WeddingCard022Props {
  data: WeddingCard022Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard022({
  data,
  layout,
  className,
  style
}: WeddingCard022Props) {
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
        backgroundColor: '#000000'
      }}
    >
      {/* 배경 사진 */}
      {data.photo && layout.photo && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: layout.photo.zIndex || 0
        }}>
          <img
            src={data.photo}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* 그라데이션 딤 오버레이 */}
      {layout.dimmed && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 57.692%, rgba(0,0,0,0.5) 100%)',
          zIndex: layout.dimmed.zIndex || 1
        }} />
      )}

      {/* 장식 이미지 (전구) */}
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

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Separator (그리고) */}
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
