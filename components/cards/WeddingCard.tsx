import type { WeddingData } from '@/types/wedding'
import type { WeddingCardLayout } from '@/types/card-layout'
import { DEFAULT_WEDDING_CARD_LAYOUT } from '@/types/card-layout'
import {
  elementLayoutToStyle,
  textLayoutToStyle,
  textBlockLayoutToStyle
} from '@/lib/layout-utils'

interface WeddingCardProps {
  data: WeddingData
  layout?: WeddingCardLayout  // 레이아웃 커스터마이징 가능
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard({
  data,
  layout = DEFAULT_WEDDING_CARD_LAYOUT,
  className,
  style
}: WeddingCardProps) {
  const { baseSize } = layout

  console.log('WeddingCard received data:', data)
  console.log('backgroundImage:', data.backgroundImage)
  console.log('decorationImage:', data.decorationImage)

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        backgroundColor: '#EFEEEB'
      }}
    >
      {/* 배경 이미지 (card-bg.png) */}
      {data.backgroundImage ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: layout.background.zIndex
          }}
        />
      ) : (
        <div style={{ display: 'none' }}>No backgroundImage</div>
      )}

      {/* 사진 - 픽셀 기반 레이아웃 → 백분율 자동 변환 */}
      <div style={{
        ...elementLayoutToStyle(layout.photo, baseSize),
        overflow: 'hidden'
      }}>
        <img
          src={data.photo}
          alt="Wedding Photo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* 장식 이미지 - 정중앙 배치 */}
      {data.decorationImage && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: `${(layout.decoration.y / baseSize.height) * 100}%`,
          transform: 'translateX(-50%)',
          width: `${(layout.decoration.width / baseSize.width) * 100}%`,
          height: `${(layout.decoration.height / baseSize.height) * 100}%`,
          zIndex: layout.decoration.zIndex
        }}>
          <img
            src={data.decorationImage}
            alt="Decoration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* 신랑 이름 */}
      <p style={textLayoutToStyle(layout.groom, baseSize)}>
        {data.groom}
      </p>

      {/* 신부 이름 */}
      <p style={textLayoutToStyle(layout.bride, baseSize)}>
        {data.bride}
      </p>

      {/* 날짜 및 장소 */}
      <div style={textBlockLayoutToStyle(layout.dateVenue, baseSize)}>
        <p style={{ margin: 0, marginBottom: 0 }}>{data.date}</p>
        <p style={{ margin: 0 }}>{data.venue}</p>
      </div>
    </div>
  )
}
