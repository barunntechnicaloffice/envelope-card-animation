/**
 * 카드 레이아웃 타입 정의 (절대 픽셀 기반)
 *
 * 모든 위치값은 baseSize를 기준으로 한 절대 픽셀값으로 저장
 * 렌더링 시 백분율로 자동 변환됨
 */

export interface BaseSize {
  width: number   // 기준 캔버스 너비 (예: 335px)
  height: number  // 기준 캔버스 높이 (예: 515px)
}

export interface Position {
  x: number       // 컨테이너 기준 절대 X 좌표 (px)
  y: number       // 컨테이너 기준 절대 Y 좌표 (px)
}

export interface Size {
  width: number   // 요소 너비 (px)
  height: number  // 요소 높이 (px)
}

export interface ElementLayout extends Position, Size {
  zIndex?: number
}

export interface TextElementLayout extends Position {
  width?: number            // 텍스트 컨테이너 폭 (px, 선택적)
  fontSize: number          // 폰트 크기 (px)
  fontFamily: string
  color: string
  letterSpacing?: number    // letter-spacing (px)
  align?: 'left' | 'center' | 'right'
  zIndex?: number
}

export interface TextBlockLayout extends Position {
  width: number             // 텍스트 블록 너비 (px)
  fontSize: number
  fontFamily: string
  color: string
  lineHeight: number
  align: 'left' | 'center' | 'right'
  paddingX?: number         // 좌우 패딩 (px)
  zIndex?: number
}

/**
 * 청첩장 카드 레이아웃
 */
export interface WeddingCardLayout {
  // 기준 캔버스 크기 (Figma 시안 크기)
  baseSize: BaseSize

  // 배경 이미지 (전체 영역)
  background: {
    zIndex: number
  }

  // 사진 영역
  photo: ElementLayout

  // 신랑 이름
  groom: TextElementLayout

  // 신부 이름
  bride: TextElementLayout

  // 날짜 및 장소 (텍스트 블록)
  dateVenue: TextBlockLayout

  // 장식 이미지
  decoration: ElementLayout
}

/**
 * Figma MCP 기준 기본 레이아웃
 * (2072:68405 - Group 10432)
 *
 * 컨테이너 기준점: x=20, y=148
 * 모든 좌표는 이 기준점에서의 상대 위치
 */
export const DEFAULT_WEDDING_CARD_LAYOUT: WeddingCardLayout = {
  baseSize: {
    width: 335,
    height: 515
  },

  background: {
    zIndex: 0
  },

  // 사진 - Figma: x=72, y=254 → 상대: (52, 106)
  photo: {
    x: 52,        // 72 - 20 (container x)
    y: 106,       // 254 - 148 (container y)
    width: 233.076,
    height: 257.502,
    zIndex: 1
  },

  // 신랑 이름 - Figma: x=44, y=543, width=111 → 상대: (24, 395)
  groom: {
    x: 24,        // 44 - 20
    y: 395,       // 543 - 148
    width: 111,   // 텍스트 컨테이너 폭
    fontSize: 20,
    fontFamily: "'NanumMyeongjo', serif",
    color: '#333333',
    letterSpacing: -0.316,
    align: 'center',
    zIndex: 2
  },

  // 신부 이름 - Figma: x=213, y=543, width=117 → 상대: (193, 395)
  bride: {
    x: 193,       // 213 - 20
    y: 395,       // 543 - 148
    width: 117,   // 텍스트 컨테이너 폭
    fontSize: 20,
    fontFamily: "'NanumMyeongjo', serif",
    color: '#333333',
    letterSpacing: -0.316,
    align: 'center',
    zIndex: 2
  },

  // 날짜 및 장소 - Figma: x=87.81, y=585.49 → 상대: (67.81, 437.49)
  // 유연한 레이아웃을 위해 전체 폭 사용, padding으로 조정
  dateVenue: {
    x: 0,         // 전체 폭 사용
    y: 437.49,    // 585.49 - 148
    width: 335,   // 전체 폭
    fontSize: 12,
    fontFamily: "'NanumMyeongjo', serif",
    color: '#333333',
    lineHeight: 1.67,
    align: 'center',
    paddingX: 33.5,  // 좌우 여백 (10% = 33.5px)
    zIndex: 2
  },

  // 장식 이미지 - Figma: x=155.22, y=532 → 상대: (135.22, 384)
  decoration: {
    x: 135.22,    // 155.22 - 20
    y: 384,       // 532 - 148
    width: 41.675,
    height: 39.546,
    zIndex: 2
  }
}
