import type { WeddingData } from '@/types/wedding'

interface WeddingCardProps {
  data: WeddingData
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard({ data, className, style }: WeddingCardProps) {
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
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${data.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }} />

      {/* 사진 - Figma 정확한 위치: left: 71.91px, top: 282.06px, w: 233.076px, h: 257.502px */}
      <div style={{
        position: 'absolute',
        left: '71.91px',
        top: '282.06px',
        width: '233.076px',
        height: '257.502px',
        overflow: 'hidden',
        zIndex: 1
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

      {/* 장식 이미지 - Figma 정확한 위치: left: 50%, top: 562.4px, w: 41.675px, h: 39.546px */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.559px)',
        top: '562.4px',
        transform: 'translateX(-50%)',
        width: '41.675px',
        height: '39.546px',
        zIndex: 2
      }}>
        <img
          src={data.decorationImage}
          alt="Decoration"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* 신랑 이름 - Figma: left: 72.45px, top: 573.83px */}
      <p style={{
        position: 'absolute',
        left: '72.45px',
        top: '573.83px',
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '20px',
        color: '#333333',
        letterSpacing: '-0.316px',
        margin: 0,
        zIndex: 2,
        whiteSpace: 'nowrap',
        lineHeight: 'normal',
        width: '79.034px',
        height: '27.731px'
      }}>
        {data.groom}
      </p>

      {/* 신부 이름 - Figma: right: 71.29px, top: 573.83px */}
      <p style={{
        position: 'absolute',
        right: '71.29px',
        top: '573.83px',
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '20px',
        color: '#333333',
        letterSpacing: '-0.316px',
        textAlign: 'right',
        margin: 0,
        zIndex: 2,
        whiteSpace: 'nowrap',
        lineHeight: 'normal',
        width: '79.034px',
        height: '27.731px'
      }}>
        {data.bride}
      </p>

      {/* 날짜 및 장소 - Figma: left: 50%, top: 615.89px, w: 177px */}
      <div style={{
        position: 'absolute',
        left: 'calc(50% + 0.812px)',
        top: '615.89px',
        transform: 'translateX(-50%)',
        width: '177px',
        height: '40.702px',
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#333333',
        textAlign: 'center',
        lineHeight: '20px',
        zIndex: 2
      }}>
        <p style={{ margin: 0, marginBottom: 0 }}>{data.date}</p>
        <p style={{ margin: 0 }}>{data.venue}</p>
      </div>
    </div>
  )
}
