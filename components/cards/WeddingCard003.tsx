import type { WeddingData } from '@/types/wedding'

interface WeddingCard003Props {
  data: WeddingData
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard003({
  data,
  className,
  style
}: WeddingCard003Props) {
  // Figma baseSize: 335px × 515px
  const baseWidth = 335
  const baseHeight = 515

  // Figma 캔버스 기준 BG 시작점
  const bgOffsetY = 148
  const bgOffsetX = 20

  // 백분율 변환 헬퍼 함수 (BG 기준 상대 좌표)
  const pxToPercent = (canvasPx: number, canvasOffset: number, base: number) =>
    `${((canvasPx - canvasOffset) / base) * 100}%`

  // "auto" 또는 픽셀 값을 처리하는 헬퍼 함수
  const toStyleValue = (value: number | "auto", offset: number, base: number): string | number =>
    value === "auto" ? "auto" : pxToPercent(value, offset, base)

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

      {/* THE WEDDING OF (제목) - canvas y:175.5 → BG 기준 27.5px */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(175.5, bgOffsetY, baseHeight),
        width: pxToPercent(311, 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '10px',
        lineHeight: 'normal',
        color: '#C0B7A8',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        THE WEDDING OF
      </p>

      {/* 사진 (중앙) - canvas y:203 → BG 기준 55px */}
      <div style={{
        position: 'absolute',
        left: pxToPercent(51.25, bgOffsetX, baseWidth),
        top: pxToPercent(203, bgOffsetY, baseHeight),
        width: pxToPercent(272.5, 0, baseWidth),
        height: pxToPercent(314.5, 0, baseHeight),
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

      {/* 장식 1 (하단 배경 장식) - canvas y:505.333 → BG 기준 357.333px */}
      {data.decoration && (
        <div style={{
          position: 'absolute',
          left: pxToPercent(20, bgOffsetX, baseWidth),
          top: pxToPercent(505.333, bgOffsetY, baseHeight),
          width: pxToPercent(335, 0, baseWidth),
          height: pxToPercent(34.833, 0, baseHeight),
          zIndex: 1
        }}>
          <img
            src={data.decoration}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {/* 신랑 이름 - canvas y:555, x:82 → BG 기준 407px, 62px (width: auto) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(82, bgOffsetX, baseWidth),
        top: pxToPercent(555, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: 'normal',
        color: '#C0B7A8',
        letterSpacing: '-0.316px',
        textAlign: 'right',
        margin: 0,
        zIndex: 2
      }}>
        {data.groom}
      </p>

      {/* "그리고" 텍스트 - canvas y:562 → BG 기준 414px (width: auto) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(562, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '10px',
        lineHeight: 'normal',
        color: '#C0B7A8',
        letterSpacing: '2px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        그리고
      </p>

      {/* 신부 이름 - canvas y:555, x:225 → BG 기준 407px, 205px (width: auto) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(225, bgOffsetX, baseWidth),
        top: pxToPercent(555, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '20px',
        lineHeight: 'normal',
        color: '#C0B7A8',
        letterSpacing: '-0.316px',
        textAlign: 'left',
        margin: 0,
        zIndex: 2
      }}>
        {data.bride}
      </p>

      {/* 날짜 - canvas y:592 → BG 기준 444px (width: auto) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(592, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#C0B7A8',
        lineHeight: '20px',
        textAlign: 'center',
        margin: 0,
        zIndex: 2
      }}>
        {data.date}
      </p>

      {/* 장소 - canvas y:612 → BG 기준 464px (width: auto) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(612, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth),
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        color: '#C0B7A8',
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
