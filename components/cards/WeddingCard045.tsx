import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard045Data extends WeddingData {
  decoration?: string
  decorationTop?: string
  groomLabel?: string
  brideLabel?: string
}

interface WeddingCard045Props {
  data: WeddingCard045Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard045({
  data,
  layout,
  className,
  style
}: WeddingCard045Props) {
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
            backgroundSize: 'cover',
            backgroundPosition: 'center',
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

      {/* 장식 이미지 Top (사진 오버레이) */}
      {data.decorationTop && layout.decorationTop && (
        <div style={{
          ...renderLayoutElement('decorationTop', layout.decorationTop, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.decorationTop}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* 신랑 라벨 "GROOM" */}
      {layout.groomLabel && (
        <p style={renderLayoutElement('groomLabel', layout.groomLabel, baseSize, data)}>
          {data.groomLabel || 'GROOM'}
        </p>
      )}

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* 장식 이미지 (하트) */}
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

      {/* 신부 라벨 "BRIDE" */}
      {layout.brideLabel && (
        <p style={renderLayoutElement('brideLabel', layout.brideLabel, baseSize, data)}>
          {data.brideLabel || 'BRIDE'}
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

      {/* 예식장 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
