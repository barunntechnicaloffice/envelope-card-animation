import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard030Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard030({
  data,
  layout,
  className,
  style
}: WeddingCard030Props) {
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

      {/* Dimmed Layer - z-index 2 */}
      {layout.dimmed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: layout.dimmed.zIndex || 2
          }}
        />
      )}

      {/* Decoration - z-index 3 */}
      {data.decoration && layout.decoration && (
        <div style={renderLayoutElement('decoration', layout.decoration, baseSize, data)}>
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
                top: '-12.12%',
                width: '100%',
                height: '321.81%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      )}

      {/* Groom Name - z-index 4 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Separator "&" - z-index 4 */}
      {layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          &
        </p>
      )}

      {/* Bride Name - z-index 4 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* Date - z-index 4 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {/* Venue - z-index 4 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
