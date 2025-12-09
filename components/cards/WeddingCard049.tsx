import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard049Data extends WeddingData {
  separator?: string
  decoration?: string
}

interface WeddingCard049Props {
  data: WeddingCard049Data
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard049({
  data,
  layout,
  className,
  style
}: WeddingCard049Props) {
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
        backgroundColor: '#000000'
      }}
    >
      {/* 배경 사진 */}
      {layout.photo && (
        <div style={{
          position: 'absolute',
          left: `${(layout.photo.x / baseSize.width) * 100}%`,
          top: `${(layout.photo.y / baseSize.height) * 100}%`,
          width: `${(layout.photo.width / baseSize.width) * 100}%`,
          height: `${(layout.photo.height / baseSize.height) * 100}%`,
          zIndex: layout.photo.zIndex || 0
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

      {/* Dimmed 오버레이 */}
      {layout.dimmed && (
        <div style={{
          position: 'absolute',
          left: `${(layout.dimmed.x / baseSize.width) * 100}%`,
          top: `${(layout.dimmed.y / baseSize.height) * 100}%`,
          width: `${(layout.dimmed.width / baseSize.width) * 100}%`,
          height: `${(layout.dimmed.height / baseSize.height) * 100}%`,
          backgroundColor: layout.dimmed.backgroundColor || 'rgba(0, 0, 0, 0.2)',
          zIndex: layout.dimmed.zIndex || 1
        }} />
      )}

      {/* "Love Story" 장식 */}
      {data.decoration && layout.decoration && (
        <div style={{
          position: 'absolute',
          left: `${(layout.decoration.x / baseSize.width) * 100}%`,
          top: `${(layout.decoration.y / baseSize.height) * 100}%`,
          width: `${(layout.decoration.width / baseSize.width) * 100}%`,
          height: `${(layout.decoration.height / baseSize.height) * 100}%`,
          zIndex: layout.decoration.zIndex || 2
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

      {/* 구분자 "&" */}
      {layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          {data.separator || '&'}
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

      {/* 장소 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
