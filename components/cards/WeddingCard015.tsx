import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard015Props {
  data: WeddingData
  layout?: any
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard015({
  data,
  layout,
  className,
  style
}: WeddingCard015Props) {
  if (!layout) {
    return <div style={{...style, padding: '20px', backgroundColor: '#f5f5f5'}}>Layout이 필요합니다</div>
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
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* 배경 이미지 */}
      {data.backgroundImage && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: layout.background.backgroundSize || 'cover',
            backgroundPosition: layout.background.backgroundPosition || 'center',
            zIndex: layout.background.zIndex || 0
          }}
        />
      )}

      {/* 신랑 이름 (왼쪽) */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* "그리고" 구분자 */}
      {layout.separator && (
        <p style={renderLayoutElement('separator', layout.separator, baseSize, data)}>
          그리고
        </p>
      )}

      {/* 신부 이름 (오른쪽) */}
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
