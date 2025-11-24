import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard024Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard024({
  data,
  layout,
  className,
  style
}: WeddingCard024Props) {
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
        backgroundColor: '#000000'
      }}
    >
      {/* Photo Background - z-index 0 */}
      {data.photo && layout.photo && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: layout.photo.zIndex || 0
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

      {/* Dimmed Overlay - z-index 1 */}
      {layout.dimmed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            zIndex: layout.dimmed.zIndex || 1
          }}
        />
      )}

      {/* Decoration - "Together in Love" text - z-index 2 */}
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

      {/* Groom Name - z-index 3 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Separator - z-index 3 */}
      {layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          {data.separator || '&'}
        </p>
      )}

      {/* Bride Name - z-index 3 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
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
