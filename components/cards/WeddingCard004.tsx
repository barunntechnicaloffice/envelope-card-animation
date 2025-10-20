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
      {/* 배경 사진 - 전체 화면 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0
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

      {/* GIF 장식 오버레이 - 전체 화면 */}
      {data.decoration && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1
        }}>
          <img
            src={data.decoration}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* 이름 텍스트 영역 - canvas y:260.5 → BG 기준 112.5px */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: pxToPercent(260.5, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 2
      }}>
        {/* 신랑 이름 */}
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 'normal',
          color: '#FFFFFF',
          letterSpacing: '-0.2844px',
          textAlign: 'center',
          margin: 0,
          whiteSpace: 'nowrap'
        }}>
          {data.groom}
        </p>

        {/* & 구분자 */}
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 'normal',
          color: '#FFFFFF',
          letterSpacing: '-0.2844px',
          textAlign: 'center',
          margin: 0,
          whiteSpace: 'nowrap'
        }}>
          &
        </p>

        {/* 신부 이름 */}
        <p style={{
          fontFamily: "'NanumMyeongjo', serif",
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 'normal',
          color: '#FFFFFF',
          letterSpacing: '-0.2844px',
          textAlign: 'center',
          margin: 0,
          whiteSpace: 'nowrap'
        }}>
          {data.bride}
        </p>
      </div>
    </div>
  )
}
