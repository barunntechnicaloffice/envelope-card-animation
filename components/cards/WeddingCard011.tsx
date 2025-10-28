import React from 'react'
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard011Data extends WeddingData {
  decoration?: string
}

interface WeddingCard011Props {
  data: WeddingCard011Data
  layout?: any  // JSON layout 객체
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard011({
  data,
  layout,
  className,
  style
}: WeddingCard011Props) {
  if (!layout) {
    return <div style={{...style, padding: '20px', backgroundColor: '#fff'}}>Layout이 필요합니다</div>
  }

  const { baseSize } = layout

  // date를 줄바꿈 처리
  const renderDate = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5'
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

      {/* Decoration (Our Wedding Day 이미지) */}
      {data.decoration && layout.decoration && (
        <div style={{
          ...renderLayoutElement('decoration', layout.decoration, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.decoration}
            alt="Our Wedding Day"
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.decoration.objectFit || 'contain'
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

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* 날짜 */}
      {layout.date && (
        <div style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {renderDate(data.date)}
        </div>
      )}
    </div>
  )
}
