import type { WeddingData } from '@/types/wedding'

interface WeddingCard002Props {
  data: WeddingData
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard002({
  data,
  className,
  style
}: WeddingCard002Props) {
  // Figma baseSize: 335px × 515px
  const baseWidth = 335
  const baseHeight = 515

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* 배경 이미지 */}
      {data.cardBackground && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${data.cardBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
      )}

      {/* D-day (우측 상단) */}
      <p style={{
        position: 'absolute',
        right: `${(20 / baseWidth) * 100}%`,
        top: `${(164 / baseHeight) * 100}%`,
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '20px',
        color: '#333333',
        letterSpacing: '-0.316px',
        margin: 0,
        zIndex: 2
      }}>
        D-999
      </p>

      {/* 날짜 (좌측 세로 배치) */}
      <div style={{
        position: 'absolute',
        left: `${(20 / baseWidth) * 100}%`,
        top: `${(241 / baseHeight) * 100}%`,
        zIndex: 2
      }}>
        {/* 월 */}
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '30px',
          color: '#333333',
          letterSpacing: '-0.474px',
          textAlign: 'center',
          width: '40px',
          margin: 0,
          marginBottom: '22.83px'
        }}>
          10
        </p>

        {/* 구분선 */}
        <div style={{
          width: '14.795px',
          height: '1.904px',
          margin: '0 auto 19.366px'
        }}>
          <img
            src="/assets/wedding-card-002/date-divider.svg"
            alt=""
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* 일 */}
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '30px',
          color: '#333333',
          letterSpacing: '-0.474px',
          textAlign: 'center',
          width: '40px',
          margin: 0
        }}>
          28
        </p>
      </div>

      {/* 사진 (중앙 정사각형) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: `${(226 / baseHeight) * 100}%`,
        transform: 'translateX(-50%)',
        width: '144px',
        height: '144px',
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

      {/* "lnLove" 텍스트 장식 */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: `${(389.9 / baseHeight) * 100}%`,
        transform: 'translateX(-50%)',
        width: '55.631px',
        height: '14.1px',
        zIndex: 2
      }}>
        <img
          src="/assets/wedding-card-002/decoration.svg"
          alt="lnLove"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* 영문 날짜 */}
      <p style={{
        position: 'absolute',
        left: '50%',
        top: `${(453 / baseHeight) * 100}%`,
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '30px',
        color: '#333333',
        letterSpacing: '-0.474px',
        textAlign: 'center',
        width: '313px',
        margin: 0,
        zIndex: 2
      }}>
        October 23, 2038
      </p>

      {/* GROOM 라벨 + 신랑 이름 */}
      <div style={{
        position: 'absolute',
        left: `${(20 / baseWidth) * 100}%`,
        top: `${(511 / baseHeight) * 100}%`,
        textAlign: 'right',
        zIndex: 2
      }}>
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '10px',
          color: '#333333',
          letterSpacing: '-0.158px',
          textTransform: 'uppercase',
          margin: 0,
          marginBottom: '8px'
        }}>
          GROOM
        </p>
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '18px',
          color: '#333333',
          letterSpacing: '-0.2844px',
          width: '116px',
          margin: 0
        }}>
          {data.groom}
        </p>
      </div>

      {/* BRIDE 라벨 + 신부 이름 */}
      <div style={{
        position: 'absolute',
        right: `${(20 / baseWidth) * 100}%`,
        top: `${(511 / baseHeight) * 100}%`,
        textAlign: 'left',
        zIndex: 2
      }}>
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '10px',
          color: '#333333',
          letterSpacing: '-0.158px',
          textTransform: 'uppercase',
          margin: 0,
          marginBottom: '8px'
        }}>
          BRIDE
        </p>
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '18px',
          color: '#333333',
          letterSpacing: '-0.2844px',
          width: '112px',
          margin: 0
        }}>
          {data.bride}
        </p>
      </div>

      {/* 날짜 텍스트 (하단) */}
      <p style={{
        position: 'absolute',
        left: '50%',
        top: `${(582 / baseHeight) * 100}%`,
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        width: '311px',
        margin: 0,
        zIndex: 2
      }}>
        {data.date}
      </p>

      {/* 장소 텍스트 (하단) */}
      <p style={{
        position: 'absolute',
        left: '50%',
        top: `${(602 / baseHeight) * 100}%`,
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        width: '311px',
        margin: 0,
        zIndex: 2
      }}>
        {data.venue}
      </p>
    </div>
  )
}
