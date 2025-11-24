import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard023Data extends WeddingData {
  separator?: string
  photo?: string
  decoration?: string
}

interface WeddingCard023Props {
  data: WeddingCard023Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard023({
  data,
  layout,
  className,
  style
}: WeddingCard023Props) {
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
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* 배경 */}
      {layout.background && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          zIndex: layout.background.zIndex || 0
        }} />
      )}

      {/* 장식 이미지 (Wedding Day 텍스트) */}
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

      {/* 사진 */}
      {data.photo && layout.photo && (
        <div style={renderLayoutElement('photo', layout.photo, baseSize, data)}>
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
