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
  // 디버깅: data 확인
  console.log('WeddingCard002 data:', {
    decoration: data.decoration,
    dateDivider: data.dateDivider,
    photo: data.photo
  })

  // Figma baseSize: 335px × 515px
  const baseWidth = 335
  const baseHeight = 515

  // Figma 캔버스 기준 BG 시작점
  const bgOffsetY = 148
  const bgOffsetX = 20

  // 백분율 변환 헬퍼 함수 (BG 기준 상대 좌표)
  const pxToPercent = (canvasPx: number, canvasOffset: number, base: number) =>
    `${((canvasPx - canvasOffset) / base) * 100}%`

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

      {/* D-day (우측 상단) - canvas y:164 → BG 기준 16px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(33, bgOffsetX, baseWidth),
        top: pxToPercent(164, bgOffsetY, baseHeight),
        width: pxToPercent(310, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '20px',
        color: '#333333',
        letterSpacing: '-0.316px',
        textAlign: 'right',
        margin: 0,
        zIndex: 2
      }}>
        D-999
      </p>

      {/* 사진 (중앙) - canvas y:226 → BG 기준 78px */}
      <div style={{
        position: 'absolute',
        left: pxToPercent(116, bgOffsetX, baseWidth),
        top: pxToPercent(226, bgOffsetY, baseHeight),
        width: pxToPercent(144, 0, baseWidth),
        height: pxToPercent(144, 0, baseHeight),
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

      {/* 날짜 월 (좌측) - canvas y:241 → BG 기준 93px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(54, bgOffsetX, baseWidth),
        top: pxToPercent(241, bgOffsetY, baseHeight),
        width: pxToPercent(40, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '30px',
        color: '#333333',
        letterSpacing: '-0.474px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        10
      </p>

      {/* 날짜 구분선 - 월과 일 사이 중간 */}
      <div style={{
        position: 'absolute',
        left: pxToPercent(67, bgOffsetX, baseWidth),
        top: '25.49%',
        width: pxToPercent(14.794921875, 0, baseWidth),
        height: pxToPercent(1.904296875, 0, baseHeight),
        zIndex: 2
      }}>
        {data.dateDivider && (
          <img
            src={data.dateDivider}
            alt=""
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* 날짜 일 (좌측) - canvas y:312 → BG 기준 164px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(54, bgOffsetX, baseWidth),
        top: pxToPercent(312, bgOffsetY, baseHeight),
        width: pxToPercent(40, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '30px',
        color: '#333333',
        letterSpacing: '-0.474px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        28
      </p>

      {/* 장식 - canvas y:389.9 → BG 기준 241.9px */}
      <div style={{
        position: 'absolute',
        left: pxToPercent(159.93157958984375, bgOffsetX, baseWidth),
        top: pxToPercent(389.8999938964844, bgOffsetY, baseHeight),
        width: pxToPercent(55.6312141418457, 0, baseWidth),
        height: pxToPercent(14.10001277923584, 0, baseHeight),
        zIndex: 2
      }}>
        {data.decoration && (
          <img
            src={data.decoration}
            alt=""
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* 영문 날짜 - canvas y:453 → BG 기준 305px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(31, bgOffsetX, baseWidth),
        top: pxToPercent(453, bgOffsetY, baseHeight),
        width: pxToPercent(313, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '30px',
        color: '#333333',
        letterSpacing: '-0.474px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        October 23, 2038
      </p>

      {/* GROOM 라벨 - canvas y:511 → BG 기준 363px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(87, bgOffsetX, baseWidth),
        top: pxToPercent(511, bgOffsetY, baseHeight),
        width: pxToPercent(42, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '10px',
        color: '#333333',
        letterSpacing: '-0.158px',
        textAlign: 'right',
        textTransform: 'uppercase',
        margin: 0,
        zIndex: 2
      }}>
        GROOM
      </p>

      {/* 신랑 이름 - canvas y:530 → BG 기준 382px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(20, bgOffsetX, baseWidth),
        top: pxToPercent(530, bgOffsetY, baseHeight),
        width: pxToPercent(116, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '18px',
        color: '#333333',
        letterSpacing: '-0.2844px',
        textAlign: 'right',
        margin: 0,
        zIndex: 2
      }}>
        {data.groom}
      </p>

      {/* BRIDE 라벨 - canvas y:511 → BG 기준 363px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(259, bgOffsetX, baseWidth),
        top: pxToPercent(511, bgOffsetY, baseHeight),
        width: pxToPercent(30, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '10px',
        color: '#333333',
        letterSpacing: '-0.158px',
        textAlign: 'left',
        textTransform: 'uppercase',
        margin: 0,
        zIndex: 2
      }}>
        BRIDE
      </p>

      {/* 신부 이름 - canvas y:530 → BG 기준 382px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(243, bgOffsetX, baseWidth),
        top: pxToPercent(530, bgOffsetY, baseHeight),
        width: pxToPercent(112, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '18px',
        color: '#333333',
        letterSpacing: '-0.2844px',
        textAlign: 'left',
        margin: 0,
        zIndex: 2
      }}>
        {data.bride}
      </p>

      {/* 한글 날짜 - canvas y:582 → BG 기준 434px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(582, bgOffsetY, baseHeight),
        width: pxToPercent(311, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        {data.date}
      </p>

      {/* 장소 - canvas y:602 → BG 기준 454px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(602, bgOffsetY, baseHeight),
        width: pxToPercent(311, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#333333',
        lineHeight: '20px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        {data.venue}
      </p>
    </div>
  )
}
