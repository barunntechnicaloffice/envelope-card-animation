import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard005Props {
  data: WeddingData
  layout?: any  // JSON layout 객체
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard005({
  data,
  layout,
  className,
  style
}: WeddingCard005Props) {
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
      {/* 배경 이미지 - background 타입은 특별 처리 */}
      {data.backgroundImage && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: layout.background.zIndex || 0
          }}
        >
          <img
            src={data.backgroundImage}
            alt=""
            style={{
              position: 'absolute',
              left: '-1.54%',
              top: 0,
              width: '102.49%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Decoration Frame (SVG 플로럴 프레임) */}
      {data.decorationFrame && layout.decorationFrame && (
        <div style={{
          ...renderLayoutElement('decorationFrame', layout.decorationFrame, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.decorationFrame}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.decorationFrame.objectFit || 'contain'
            }}
          />
        </div>
      )}

      {/* Decoration (작은 원형 장식) */}
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
              objectFit: layout.decoration.objectFit || 'cover'
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
