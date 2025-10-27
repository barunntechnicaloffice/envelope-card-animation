import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard007Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard007({
  data,
  layout,
  className,
  style
}: WeddingCard007Props) {
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
      {/* 배경 이미지 */}
      {data.cardBackground && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: layout.background.zIndex || 0
          }}
        >
          <img
            src={data.cardBackground}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
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

      {/* 장소 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}

      {/* GROOM 라벨 */}
      {layout.groomLabel && data.groomLabel && (
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
      {layout.brideLabel && data.brideLabel && (
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

      {/* Decoration (Lunaria 꽃) */}
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
    </div>
  )
}
