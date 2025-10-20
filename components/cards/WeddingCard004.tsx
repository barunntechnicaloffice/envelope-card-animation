import type { WeddingData } from '@/types/wedding'

interface WeddingCard004Props {
  data: WeddingData
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard004({
  data,
  className,
  style
}: WeddingCard004Props) {
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
        backgroundColor: '#000000'
      }}
    >
      {/* 배경 사진 - 카드 전체, 약간 크롭 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        <img
          src={data.photo}
          alt="Wedding Photo"
          style={{
            position: 'absolute',
            width: '103.06%',
            height: '103.89%',
            left: '-1.36%',
            top: '-3.25%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* GIF 장식 오버레이 - 카드 전체 */}
      {data.decoration && (
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 1
        }}>
          <img
            src={data.decoration}
            alt=""
            style={{
              position: 'absolute',
              width: '100%',
              height: '115.71%',
              left: 0,
              top: '-0.18%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* 신랑 이름 - canvas x:92.5 y:260.5 → BG 기준 (72.5, 112.5) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(123, bgOffsetX, baseWidth),
        top: pxToPercent(260.5, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: 'normal',
        color: '#FFFFFF',
        letterSpacing: '-0.2844px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        zIndex: 2
      }}>
        {data.groom}
      </p>

      {/* & 구분자 - 완전 중앙 */}
      <p style={{
        position: 'absolute',
        left: '50%',
        top: pxToPercent(260.5, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: 'normal',
        color: '#FFFFFF',
        letterSpacing: '-0.2844px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        zIndex: 2
      }}>
        &
      </p>

      {/* 신부 이름 - canvas x:221.5 y:260.5 → BG 기준 (201.5, 112.5) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(252, bgOffsetX, baseWidth),
        top: pxToPercent(260.5, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: 'normal',
        color: '#FFFFFF',
        letterSpacing: '-0.2844px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        zIndex: 2
      }}>
        {data.bride}
      </p>
    </div>
  )
}
