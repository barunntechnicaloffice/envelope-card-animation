import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard046Data extends WeddingData {
  decoration?: string
}

interface WeddingCard046Props {
  data: WeddingCard046Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard046({
  data,
  layout,
  className,
  style
}: WeddingCard046Props) {
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
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* 배경 이미지 */}
      {data.cardBackground && layout.background && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: layout.background.zIndex || 0
        }}>
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

      {/* 사진 */}
      {layout.photo && (
        <div style={{
          position: 'absolute',
          left: `${(layout.photo.x / baseSize.width) * 100}%`,
          top: `${(layout.photo.y / baseSize.height) * 100}%`,
          width: `${(layout.photo.width / baseSize.width) * 100}%`,
          height: `${(layout.photo.height / baseSize.height) * 100}%`,
          zIndex: layout.photo.zIndex || 1,
          overflow: 'hidden'
        }}>
          <img
            src={data.photo || '/assets/common/photo.png'}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.photo.objectFit || 'cover'
            }}
          />
        </div>
      )}

      {/* 장식 프레임 */}
      {data.decoration && layout.decoration && (
        <div style={{
          position: 'absolute',
          left: `${(layout.decoration.x / baseSize.width) * 100}%`,
          top: `${(layout.decoration.y / baseSize.height) * 100}%`,
          width: `${(layout.decoration.width / baseSize.width) * 100}%`,
          height: `${(layout.decoration.height / baseSize.height) * 100}%`,
          zIndex: layout.decoration.zIndex || 2,
          pointerEvents: 'none'
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
    </div>
  )
}
