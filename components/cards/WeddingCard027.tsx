import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard027Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard027({
  data,
  layout,
  className,
  style
}: WeddingCard027Props) {
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
        backgroundColor: '#FFFFFF'
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
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

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

      {/* Decoration Top "happily" - z-index 2 */}
      {data.decorationTop && layout.decorationTop && (
        <div
          style={renderLayoutElement(
            'decorationTop',
            layout.decorationTop,
            baseSize,
            data
          )}
        >
          <img
            src={data.decorationTop}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Decoration Left "ever" - z-index 2 */}
      {data.decorationLeft && layout.decorationLeft && (
        <div
          style={renderLayoutElement(
            'decorationLeft',
            layout.decorationLeft,
            baseSize,
            data
          )}
        >
          <img
            src={data.decorationLeft}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Decoration Right "after" - z-index 2 */}
      {data.decorationRight && layout.decorationRight && (
        <div
          style={renderLayoutElement(
            'decorationRight',
            layout.decorationRight,
            baseSize,
            data
          )}
        >
          <img
            src={data.decorationRight}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Groom Name (Rotated 270°) - z-index 3 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* Bride Name (Rotated 90°) - z-index 3 */}
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
    </div>
  )
}
