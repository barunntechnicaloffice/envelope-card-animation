import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard002Data extends WeddingData {
  text?: string
  decoration?: string
  cardBackground?: string
}

interface WeddingCard002Props {
  data: WeddingCard002Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard002({
  data,
  layout,
  className,
  style
}: WeddingCard002Props) {
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
        <div style={{
          position: 'absolute',
          left: `${(layout.background.x / baseSize.width) * 100}%`,
          top: `${(layout.background.y / baseSize.height) * 100}%`,
          width: `${(layout.background.width / baseSize.width) * 100}%`,
          height: `${(layout.background.height / baseSize.height) * 100}%`,
          zIndex: layout.background.zIndex || 0
        }}>
          <img
            src={data.cardBackground}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.background.objectFit || 'cover'
            }}
          />
        </div>
      )}

      {/* 신랑 이름 - 상단 왼쪽 */}
      {layout.groom && (
        <p style={{
          ...renderLayoutElement('groom', layout.groom, baseSize, data),
          textTransform: layout.groom.textTransform || 'none'
        }}>
          {data.groom}
        </p>
      )}

      {/* 신부 이름 - 상단 오른쪽 */}
      {layout.bride && (
        <p style={{
          ...renderLayoutElement('bride', layout.bride, baseSize, data),
          textTransform: layout.bride.textTransform || 'none'
        }}>
          {data.bride}
        </p>
      )}

      {/* 장식 이미지 - OUR LOVE STORY */}
      {data.decoration && layout.decoration && (
        <div style={{
          ...renderLayoutElement('decoration', layout.decoration, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.decoration}
            alt="Decoration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.decoration.objectFit || 'contain'
            }}
          />
        </div>
      )}

      {/* 사진 - 타원형 */}
      {layout.photo && (
        <div style={{
          ...renderLayoutElement('photo', layout.photo, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.photo}
            alt="Wedding Photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.photo.objectFit || 'cover'
            }}
          />
        </div>
      )}

      {/* 텍스트 - you are invited to join in our celebration */}
      {data.text && layout.text && (
        <p style={{
          ...renderLayoutElement('text', layout.text, baseSize, data),
          whiteSpace: 'pre-line'
        }}>
          {data.text}
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
