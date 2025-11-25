import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard026Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard026({
  data,
  layout,
  className,
  style
}: WeddingCard026Props) {
  if (!layout) {
    return (
      <div
        style={{
          ...style,
          padding: '20px',
          backgroundColor: '#fff'
        }}
      >
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
        backgroundColor: '#f5f5f0'
      }}
    >
      {/* Background - z-index 0 */}
      {data.cardBackground && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: layout.background.zIndex || 0,
            overflow: 'hidden'
          }}
        >
          <img
            src={data.cardBackground}
            alt=""
            style={{
              position: 'absolute',
              top: '-0.86%',
              left: '0',
              width: '100%',
              height: '115.71%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Photo - z-index 1 */}
      {data.photo && layout.photo && (
        <div
          style={{
            ...renderLayoutElement('photo', layout.photo, baseSize, data),
            overflow: 'hidden'
          }}
        >
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

      {/* Groom Name - z-index 2 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Separator - z-index 2 */}
      {layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          {data.separator || '그리고'}
        </p>
      )}

      {/* Bride Name - z-index 2 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* Date - z-index 2 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {/* Venue - z-index 2 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
