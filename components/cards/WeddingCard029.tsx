import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard029Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard029({
  data,
  layout,
  className,
  style
}: WeddingCard029Props) {
  if (!layout) {
    return (
      <div style={{ ...style, padding: '20px', backgroundColor: '#fff' }}>
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
        backgroundColor: '#000000'
      }}
    >
      {/* Photo - z-index 1 */}
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

      {/* Decoration (Fireworks Overlay) - z-index 2 */}
      {data.decoration && layout.decoration && (
        <div
          style={renderLayoutElement(
            'decoration',
            layout.decoration,
            baseSize,
            data
          )}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              pointerEvents: 'none'
            }}
          >
            <img
              src={data.decoration}
              alt=""
              style={{
                position: 'absolute',
                left: 0,
                top: '-14.84%',
                width: '100%',
                height: '115.71%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      )}

      {/* Date - z-index 3 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {/* Venue - z-index 3 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
