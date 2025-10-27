import type { WeddingData } from '@/types/wedding'

interface WeddingCard005Props {
  data: WeddingData
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard005({
  data,
  className,
  style
}: WeddingCard005Props) {
  // Figma baseSize: 335px × 515px
  const baseWidth = 335
  const baseHeight = 515

  // ⚠️ 중요: Figma 캔버스 기준 BG 시작점 (메타데이터에서 확인)
  const bgOffsetY = 148.5
  const bgOffsetX = 21

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
      {/* 배경 이미지 - Figma: left-[-1.54%] w-[102.49%] */}
      {data.backgroundImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 0
          }}
        >
          <img
            src={data.backgroundImage}
            alt=""
            style={{
              position: 'absolute',
              left: '-1.54%',
              top: 0,
              width: '102.49%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* Decoration Frame (SVG 플로럴 프레임) - canvas x:96.72 y:242.2978 → BG 기준 (75.72, 93.7978) */}
      {data.decorationFrame && (
        <div style={{
          position: 'absolute',
          left: pxToPercent(96.72, bgOffsetX, baseWidth),
          top: pxToPercent(242.2978, bgOffsetY, baseHeight),
          width: pxToPercent(183.56, 0, baseWidth),
          height: pxToPercent(45.632, 0, baseHeight),
          zIndex: 1
        }}>
          <img
            src={data.decorationFrame}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* Decoration (Small Circle) - canvas x:174.92 y:384.5 → BG 기준 (153.92, 236) */}
      {data.decoration && (
        <div style={{
          position: 'absolute',
          left: pxToPercent(174.92, bgOffsetX, baseWidth),
          top: pxToPercent(384.5, bgOffsetY, baseHeight),
          width: pxToPercent(27.155, 0, baseWidth),
          height: pxToPercent(25, 0, baseHeight),
          zIndex: 2
        }}>
          <img
            src={data.decoration}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* 신랑 이름 - canvas x:188.5 (center) y:336.9375 → BG 기준 (167.5, 188.4375) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(188.5, bgOffsetX, baseWidth),
        top: pxToPercent(336.9375, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'Gowun Batang', serif",
        fontSize: `${(18 / baseWidth) * 100}%`,
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 'normal',
        color: '#cc9052',
        letterSpacing: '-0.2844px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        zIndex: 3
      } as React.CSSProperties}>
        {data.groom}
      </p>

      {/* 신부 이름 - canvas x:188.5 (center) y:431.0625 → BG 기준 (167.5, 282.5625) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(188.5, bgOffsetX, baseWidth),
        top: pxToPercent(431.0625, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'Gowun Batang', serif",
        fontSize: `${(18 / baseWidth) * 100}%`,
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: 'normal',
        color: '#cc9052',
        letterSpacing: '-0.2844px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        zIndex: 3
      } as React.CSSProperties}>
        {data.bride}
      </p>

      {/* 날짜 - canvas x:188.5 (center) y:517.6875 → BG 기준 (167.5, 369.1875) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(188.5, bgOffsetX, baseWidth),
        top: pxToPercent(517.6875, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: `${(20 / baseWidth) * 100}%`,
        fontWeight: 700,
        fontStyle: 'normal',
        lineHeight: 'normal',
        color: '#cc9052',
        letterSpacing: '-0.316px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        fontVariantNumeric: 'tabular-nums',
        zIndex: 3
      } as React.CSSProperties}>
        {data.date}
      </p>

      {/* 장소 - canvas x:188.5 (center) y:538.6875 → BG 기준 (167.5, 390.1875) */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(188.5, bgOffsetX, baseWidth),
        top: pxToPercent(538.6875, bgOffsetY, baseHeight),
        transform: 'translateX(-50%)',
        fontFamily: "'Pretendard', sans-serif",
        fontSize: `${(12 / baseWidth) * 100}%`,
        fontWeight: 400,
        fontStyle: 'normal',
        lineHeight: '20px',
        color: '#cc9052',
        letterSpacing: '0px',
        textAlign: 'center',
        margin: 0,
        whiteSpace: 'nowrap',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'optimizeLegibility',
        zIndex: 3
      } as React.CSSProperties}>
        {data.venue}
      </p>
    </div>
  )
}
