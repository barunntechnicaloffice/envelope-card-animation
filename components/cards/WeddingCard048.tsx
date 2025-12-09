import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard048Data extends WeddingData {
  title?: string
  decoration?: string
}

interface WeddingCard048Props {
  data: WeddingCard048Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard048({
  data,
  layout,
  className,
  style
}: WeddingCard048Props) {
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
      {/* 배경 이미지 - 전체 cover */}
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

      {/* 제목 "The marriage of" */}
      {layout.title && (
        <p style={renderLayoutElement('title', layout.title, baseSize, data)}>
          {data.title || 'The marriage of'}
        </p>
      )}

      {/* 사진 (원형) */}
      {layout.photo && (
        <div style={{
          position: 'absolute',
          left: `${(layout.photo.x / baseSize.width) * 100}%`,
          top: `${(layout.photo.y / baseSize.height) * 100}%`,
          width: `${(layout.photo.width / baseSize.width) * 100}%`,
          height: `${(layout.photo.height / baseSize.height) * 100}%`,
          borderRadius: layout.photo.borderRadius || '50%',
          overflow: 'hidden',
          zIndex: layout.photo.zIndex || 1
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

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* 하트 장식 */}
      {data.decoration && layout.decoration && (
        <div style={{
          position: 'absolute',
          left: `${(layout.decoration.x / baseSize.width) * 100}%`,
          top: `${(layout.decoration.y / baseSize.height) * 100}%`,
          width: `${(layout.decoration.width / baseSize.width) * 100}%`,
          height: `${(layout.decoration.height / baseSize.height) * 100}%`,
          zIndex: layout.decoration.zIndex || 3,
          transform: layout.decoration.centerAlign ? 'translateX(-50%)' : 'none'
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

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* 날짜 */}
      {layout.date && (
        <p style={{
          ...renderLayoutElement('date', layout.date, baseSize, data),
          whiteSpace: 'pre-line'
        }}>
          {data.date}
        </p>
      )}
    </div>
  )
}
