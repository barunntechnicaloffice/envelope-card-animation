import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard002Props {
  data: WeddingData
  layout?: any  // JSON layout 객체
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
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${data.cardBackground})`,
            backgroundSize: layout.background.backgroundSize || 'cover',
            backgroundPosition: layout.background.backgroundPosition || 'center',
            zIndex: layout.background.zIndex || 0
          }}
        />
      )}

      {/* D-Day */}
      {(data as any).dday && layout.dday && (
        <p style={renderLayoutElement('dday', layout.dday, baseSize, data)}>
          {(data as any).dday}
        </p>
      )}

      {/* 사진 */}
      {layout.photo && (
        <div style={{
          ...renderLayoutElement('photo', layout.photo, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.photo}
            alt="Wedding Photo"
            style={{
              width: layout.photo.style?.width || '100%',
              height: layout.photo.style?.height || '100%',
              left: layout.photo.style?.left || '0',
              top: layout.photo.style?.top || '0',
              position: layout.photo.style ? 'absolute' : 'relative',
              objectFit: layout.photo.objectFit || 'cover'
            }}
          />
        </div>
      )}

      {/* 날짜 월 */}
      {(data as any).dateMonth && layout.dateMonth && (
        <p style={renderLayoutElement('dateMonth', layout.dateMonth, baseSize, data)}>
          {(data as any).dateMonth}
        </p>
      )}

      {/* 날짜 구분선 */}
      {(data as any).dateDivider && layout.dateDivider && (
        <div style={{
          ...renderLayoutElement('dateDivider', layout.dateDivider, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={(data as any).dateDivider}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* 날짜 일 */}
      {(data as any).dateDay && layout.dateDay && (
        <p style={renderLayoutElement('dateDay', layout.dateDay, baseSize, data)}>
          {(data as any).dateDay}
        </p>
      )}

      {/* 장식 이미지 */}
      {(data as any).decoration && layout.decoration && (
        <div style={{
          ...renderLayoutElement('decoration', layout.decoration, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={(data as any).decoration}
            alt="Decoration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.decoration.objectFit || 'contain'
            }}
          />
        </div>
      )}

      {/* 날짜 영문 */}
      {(data as any).dateEnglish && layout.dateEnglish && (
        <p style={renderLayoutElement('dateEnglish', layout.dateEnglish, baseSize, data)}>
          {(data as any).dateEnglish}
        </p>
      )}

      {/* 신랑 라벨 */}
      {(data as any).groomLabel && layout.groomLabel && (
        <p style={renderLayoutElement('groomLabel', layout.groomLabel, baseSize, data)}>
          {(data as any).groomLabel}
        </p>
      )}

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* 신부 라벨 */}
      {(data as any).brideLabel && layout.brideLabel && (
        <p style={renderLayoutElement('brideLabel', layout.brideLabel, baseSize, data)}>
          {(data as any).brideLabel}
        </p>
      )}

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* 날짜 한글 */}
      {(data as any).dateKorean && layout.dateKorean && (
        <p style={renderLayoutElement('dateKorean', layout.dateKorean, baseSize, data)}>
          {(data as any).dateKorean}
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
