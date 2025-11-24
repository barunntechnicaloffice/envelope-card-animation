import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard025Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard025({
  data,
  layout,
  className,
  style
}: WeddingCard025Props) {
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

      {/* Decoration (십자가) - z-index 1 */}
      {data.decoration && layout.decoration && (
        <div
          style={{
            ...renderLayoutElement('decoration', layout.decoration, baseSize, data),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
