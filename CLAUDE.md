# 🎴 Wedding Card Template Development Guide

이 프로젝트의 새로운 템플릿 개발을 위한 완벽 가이드입니다.

## 📋 목차
- [템플릿 구조 개요](#템플릿-구조-개요)
- [방법 1: wedding-card-001 기반 (타입 시스템)](#방법-1-wedding-card-001-기반-타입-시스템)
- [방법 2: wedding-card-002 기반 (수동 계산)](#방법-2-wedding-card-002-기반-수동-계산)
- [어떤 방법을 선택할까?](#어떤-방법을-선택할까)
- [단계별 템플릿 개발 프로세스](#단계별-템플릿-개발-프로세스)
- [체크리스트](#체크리스트)

---

## 템플릿 구조 개요

### 프로젝트 파일 구조
```
envelope-card-animation/
├── components/cards/
│   ├── WeddingCard.tsx        # 템플릿 001 (타입 시스템 기반)
│   └── WeddingCard002.tsx     # 템플릿 002 (수동 계산 기반)
├── types/
│   ├── card-layout.ts         # 레이아웃 타입 정의 (방법 1에서 사용)
│   └── wedding.ts             # 데이터 타입 정의
├── lib/
│   └── layout-utils.ts        # 백분율 변환 유틸리티
├── public/templates/
│   ├── wedding-card-001.json  # 템플릿 001 스키마
│   └── wedding-card-002.json  # 템플릿 002 스키마
└── app/templates/[id]/
    └── page.tsx               # 템플릿 라우트
```

---

## 방법 1: wedding-card-001 기반 (타입 시스템)

**권장 사항:** 복잡한 템플릿, 재사용 가능한 레이아웃

### ✅ 장점
- 타입 안정성 (TypeScript)
- 레이아웃 유틸리티 재사용
- JSON으로 레이아웃 정의 가능
- 유지보수 쉬움

### 📁 필요한 파일
1. `types/card-layout.ts` - 레이아웃 타입 정의
2. `lib/layout-utils.ts` - 백분율 변환 함수
3. `components/cards/WeddingCardXXX.tsx` - 컴포넌트
4. `public/templates/wedding-card-xxx.json` - 템플릿 스키마

### 📝 구현 단계

#### 1. 타입 정의 추가 (`types/card-layout.ts`)

```typescript
// 기존 타입 확장 또는 새 인터페이스 생성
export interface WeddingCard003Layout {
  baseSize: BaseSize
  background: { zIndex: number }
  photo: ElementLayout
  groom: TextElementLayout
  bride: TextElementLayout
  // ... 템플릿 고유 요소 추가
  specialElement: ElementLayout
}

// 기본 레이아웃 상수 정의
export const DEFAULT_WEDDING_CARD_003_LAYOUT: WeddingCard003Layout = {
  baseSize: {
    width: 335,
    height: 515
  },
  background: { zIndex: 0 },

  photo: {
    x: 52,        // Figma 좌표 - 컨테이너 오프셋
    y: 106,       // Figma 좌표 - 컨테이너 오프셋
    width: 144,
    height: 144,
    zIndex: 1
  },

  groom: {
    x: 24,
    y: 395,
    width: 116,
    fontSize: 20,
    fontFamily: "'NanumMyeongjo', serif",
    color: '#333333',
    letterSpacing: -0.316,
    align: 'center',
    zIndex: 2
  }
  // ... 나머지 요소
}
```

#### 2. 컴포넌트 생성 (`components/cards/WeddingCard003.tsx`)

```typescript
import type { WeddingData } from '@/types/wedding'
import type { WeddingCard003Layout } from '@/types/card-layout'
import { DEFAULT_WEDDING_CARD_003_LAYOUT } from '@/types/card-layout'
import {
  elementLayoutToStyle,
  textLayoutToStyle,
  textBlockLayoutToStyle
} from '@/lib/layout-utils'

interface WeddingCard003Props {
  data: WeddingData
  layout?: WeddingCard003Layout  // 레이아웃 커스터마이징 가능
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard003({
  data,
  layout = DEFAULT_WEDDING_CARD_003_LAYOUT,
  className,
  style
}: WeddingCard003Props) {
  const { baseSize } = layout

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
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${data.cardBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: layout.background.zIndex
        }}
      />

      {/* 사진 - 레이아웃 유틸리티 사용 */}
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

      {/* 신랑 이름 - 텍스트 레이아웃 유틸리티 사용 */}
      <p style={textLayoutToStyle(layout.groom, baseSize)}>
        {data.groom}
      </p>

      {/* 신부 이름 */}
      <p style={textLayoutToStyle(layout.bride, baseSize)}>
        {data.bride}
      </p>

      {/* 날짜 및 장소 - 텍스트 블록 유틸리티 사용 */}
      <div style={textBlockLayoutToStyle(layout.dateVenue, baseSize)}>
        <p style={{ margin: 0 }}>{data.date}</p>
        <p style={{ margin: 0 }}>{data.venue}</p>
      </div>
    </div>
  )
}
```

#### 3. 레이아웃 유틸리티 참고 (`lib/layout-utils.ts`)

```typescript
// 이미 구현되어 있는 유틸리티 함수들:

// 1. 픽셀 → 백분율 변환
pxToPercent(px: number, base: number): string

// 2. Position → CSS 스타일
positionToStyle(position: Position, baseSize: BaseSize): CSSProperties

// 3. Size → CSS 스타일
sizeToStyle(size: Size, baseSize: BaseSize): CSSProperties

// 4. ElementLayout → CSS 스타일 (위치 + 크기)
elementLayoutToStyle(layout: ElementLayout, baseSize: BaseSize): CSSProperties

// 5. TextElementLayout → CSS 스타일 (텍스트)
textLayoutToStyle(layout: TextElementLayout, baseSize: BaseSize): CSSProperties

// 6. TextBlockLayout → CSS 스타일 (텍스트 블록)
textBlockLayoutToStyle(layout: TextBlockLayout, baseSize: BaseSize): CSSProperties
```

---

## 방법 2: wedding-card-002 기반 (수동 계산)

**권장 사항:** 간단한 템플릿, 빠른 프로토타입

### ✅ 장점
- 간단하고 직관적
- 외부 의존성 없음
- Figma 좌표를 바로 사용

### ❌ 단점
- 타입 안정성 부족
- 코드 중복 발생 가능
- 레이아웃 변경 시 수동 수정 필요

### 📁 필요한 파일
1. `components/cards/WeddingCardXXX.tsx` - 컴포넌트만 필요
2. `public/templates/wedding-card-xxx.json` - 템플릿 스키마

### 📝 구현 단계

#### 1. 컴포넌트 생성 (`components/cards/WeddingCard003.tsx`)

```typescript
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

  // ⚠️ 중요: Figma 캔버스 기준 BG 시작점 (메타데이터에서 확인)
  const bgOffsetY = 148  // BG의 캔버스 Y 좌표
  const bgOffsetX = 20   // BG의 캔버스 X 좌표

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

      {/* 사진 - Figma 캔버스 y:226 → BG 기준 78px */}
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

      {/* 신랑 이름 - Figma 캔버스 y:530 → BG 기준 382px */}
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

      {/* 신부 이름 */}
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

      {/* 날짜 - Figma 캔버스 y:582 → BG 기준 434px */}
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

      {/* 장소 - Figma 캔버스 y:602 → BG 기준 454px */}
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
```

#### 2. Figma 좌표 계산 방법

**⚠️ 중요: 반드시 Figma 메타데이터로 BG 오프셋 확인!**

```typescript
// 1. Figma MCP로 메타데이터 확인
mcp__figma-dev-mode-mcp-server__get_metadata({
  nodeId: "13:263"
})

// 2. 결과에서 BG(배경) 좌표 확인
<frame id="13:263" name="template" x="20" y="148">
  <rounded-rectangle id="2:2" name="BG" x="20" y="148" />
                                           ^^^  ^^^
  // bgOffsetX = 20, bgOffsetY = 148

// 3. 각 요소의 절대 좌표에서 BG 오프셋을 뺌
// 예: photo x="116" y="226"
// → BG 기준: (116-20, 226-148) = (96, 78)
```

#### 3. Figma의 "auto" 태그 처리하기

**⚠️ 새로운 기능: Figma에서 요소 이름에 `auto` 태그가 있으면 CSS `width: auto` 적용**

Figma 메타데이터에서 요소 이름에 `auto` 태그가 있는 경우 (예: `groom auto`, `date auto`), 해당 요소의 width를 CSS `auto`로 설정할 수 있습니다. 이는 텍스트 길이에 따라 자동으로 너비가 조정되도록 합니다.

**구현 방법:**

```typescript
export function WeddingCard003({
  data,
  className,
  style
}: WeddingCard003Props) {
  const baseWidth = 335
  const baseHeight = 515
  const bgOffsetY = 148
  const bgOffsetX = 20

  // 백분율 변환 헬퍼 함수
  const pxToPercent = (canvasPx: number, canvasOffset: number, base: number) =>
    `${((canvasPx - canvasOffset) / base) * 100}%`

  // ✨ "auto" 또는 픽셀 값을 처리하는 헬퍼 함수
  const toStyleValue = (value: number | "auto", offset: number, base: number): string | number =>
    value === "auto" ? "auto" : pxToPercent(value, offset, base)

  return (
    <div>
      {/* Figma에서 "groom auto"로 표시된 경우 */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(82, bgOffsetX, baseWidth),
        top: pxToPercent(555, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth), // ✨ "auto" 사용
        fontFamily: "'NanumMyeongjo', serif",
        fontWeight: 700,
        fontSize: '20px',
        textAlign: 'right'
      }}>
        {data.groom}
      </p>

      {/* Figma에서 "date auto"로 표시된 경우 */}
      <p style={{
        position: 'absolute',
        left: pxToPercent(32, bgOffsetX, baseWidth),
        top: pxToPercent(592, bgOffsetY, baseHeight),
        width: toStyleValue("auto", 0, baseWidth), // ✨ "auto" 사용
        fontFamily: "'NanumMyeongjo', serif",
        fontSize: '12px',
        textAlign: 'center'
      }}>
        {data.date}
      </p>

      {/* 고정 너비가 필요한 경우 */}
      <p style={{
        width: pxToPercent(311, 0, baseWidth) // 일반 백분율 사용
      }}>
        고정 너비 텍스트
      </p>
    </div>
  )
}
```

**장점:**
- 텍스트 길이에 따라 자동으로 너비 조정
- 반응형 레이아웃에 유용
- Figma 디자인 의도를 그대로 반영

**사용 시점:**
- 이름, 날짜 등 길이가 가변적인 텍스트
- 중앙 정렬이 필요 없는 텍스트 (left/right align)
- "그리고" 같은 짧은 단어

**⚠️ 권장 규칙: 텍스트는 기본적으로 auto width 사용**

Figma에서 `auto` 태그가 없더라도, **모든 텍스트 요소는 기본적으로 `width: auto`를 사용하는 것을 권장**합니다:

```typescript
// ✅ 권장: 텍스트는 기본 auto
<p style={{
  width: toStyleValue("auto", 0, baseWidth),  // 항상 auto 사용
  textAlign: 'center'
}}>
  {data.groom}
</p>

// ❌ 비권장: 고정 너비는 특별한 경우만
<p style={{
  width: pxToPercent(311, 0, baseWidth),  // 레이아웃 제약이 있을 때만
}}>
  {data.groom}
</p>
```

**이유:**
- 텍스트 길이는 가변적 (이름, 날짜, 장소 등)
- 반응형 레이아웃에 유리
- 다국어 지원 시 자동 대응
- 고정 너비로 인한 텍스트 잘림 방지

**주의사항:**
- `textAlign: 'center'`와 함께 사용 시 `left: '50%', transform: 'translateX(-50%)'` 필요
- 이미지나 컨테이너는 고정 너비 사용 (레이아웃 유지)

---

## 어떤 방법을 선택할까?

### 방법 1 (wedding-card-001) 선택 시점:
- ✅ 템플릿이 복잡할 때 (10개 이상의 요소)
- ✅ 여러 변형이 필요할 때 (레이아웃 재사용)
- ✅ 타입 안정성이 중요할 때
- ✅ 장기적으로 유지보수할 템플릿

### 방법 2 (wedding-card-002) 선택 시점:
- ✅ 템플릿이 간단할 때 (5~10개 요소)
- ✅ 빠른 프로토타입이 필요할 때
- ✅ 일회성 템플릿
- ✅ Figma 좌표를 그대로 사용하고 싶을 때

---

## 단계별 템플릿 개발 프로세스

### 1️⃣ Figma 디자인 준비
```
1. Figma에서 template Frame 생성 (335×515px)
2. ⚠️ 중요: 모든 요소를 template 바로 아래에 직접 배치
   - 중간 그룹/프레임 사용 금지!
   - DESIGN_GUIDE.md의 "프레임 구조 제약사항" 참고
3. 레이어 네이밍 규칙 적용 (소문자, 언더스코어)
4. [locked] / [editable] 태그 추가
5. Dev Mode에서 Node ID 확인
```

### 2️⃣ Figma MCP로 디자인 추출
```typescript
// 코드 생성
mcp__figma-dev-mode-mcp-server__get_code({
  nodeId: "YOUR_NODE_ID",
  clientLanguages: "typescript",
  clientFrameworks: "react"
})

// 메타데이터 확인 (좌표 검증용)
mcp__figma-dev-mode-mcp-server__get_metadata({
  nodeId: "YOUR_NODE_ID"
})

// 스크린샷 확인
mcp__figma-dev-mode-mcp-server__get_screenshot({
  nodeId: "YOUR_NODE_ID"
})
```

### 3️⃣ 좌표 계산 및 검증
```typescript
// 메타데이터에서 BG 좌표 확인
<rounded-rectangle id="2:2" name="BG" x="20" y="148" />
// → bgOffsetX = 20, bgOffsetY = 148

// 각 요소의 상대 좌표 계산
<text id="2:4" name="groom" x="20" y="530" />
// → BG 기준: (20-20, 530-148) = (0, 382)

// 백분율 변환
// x: 0 / 335 * 100 = 0%
// y: 382 / 515 * 100 = 74.17%
```

### 4️⃣ 컴포넌트 개발
```
방법 1 선택:
- types/card-layout.ts에 레이아웃 타입 추가
- components/cards/WeddingCardXXX.tsx 생성
- layout-utils.ts의 헬퍼 함수 사용

방법 2 선택:
- components/cards/WeddingCardXXX.tsx 생성
- pxToPercent 함수 직접 구현
- Figma 좌표 수동 변환
```

### 5️⃣ JSON 스키마 생성

**⚠️ 중요: Layout 요소 Type 시스템**

모든 layout 객체의 요소는 반드시 `type` 필드를 포함해야 합니다:

```typescript
type LayoutElementType =
  | "text"       // 텍스트 요소 (이름, 날짜, 장소 등)
  | "image"      // 이미지 요소 (사진, 배경, 장식 이미지 등)
  | "vector"     // SVG 벡터 요소 (아이콘, 구분선 등)
  | "container"  // 컨테이너 요소 (여러 요소를 감싸는 그룹)
  | "background" // 배경 요소 (전체 배경)
```

**Type별 사용 예시:**

```json
// ✅ 올바른 예시
"photo": {
  "type": "image",      // 이미지 타입
  "x": 96,
  "y": 78,
  "width": 144,
  "height": 144,
  "zIndex": 1,
  "editable": true      // 사용자 편집 가능
},
"groom": {
  "type": "text",       // 텍스트 타입
  "x": 24,
  "y": 395,
  "width": 111,
  "fontSize": 20,
  "fontFamily": "'NanumMyeongjo', serif",
  "color": "#333333",
  "zIndex": 2,
  "editable": true
},
"decoration": {
  "type": "vector",     // SVG 벡터 타입
  "x": 135.22,
  "y": 384,
  "width": 41.675,
  "height": 39.546,
  "zIndex": 2,
  "editable": false     // 편집 불가
}

// ❌ 잘못된 예시 (type 누락)
"photo": {
  "x": 96,
  "y": 78,
  "width": 144,
  "height": 144
}
```

**전체 JSON 스키마 예시:**

```json
{
  "id": "wedding-card-003",
  "version": "1.0.0",
  "name": "웨딩 청첩장 템플릿 003",
  "category": "wedding",
  "thumbnail": "/assets/wedding-card-003/card-bg.png",
  "figmaNodeId": "YOUR_NODE_ID",
  "common": {
    "envelope": {
      "pattern": "/assets/wedding-card-003/pattern.png",
      "seal": "/assets/wedding-card-003/seal.png"
    },
    "background": "/assets/wedding-card-003/bg.png"
  },
  "layout": {
    "baseSize": {
      "width": 335,
      "height": 515
    },
    "photo": {
      "type": "image",
      "x": 96,
      "y": 78,
      "width": 144,
      "height": 144,
      "zIndex": 1,
      "editable": true
    }
    // ... 나머지 레이아웃
  },
  "data": {
    "wedding": {
      "groom": "이 준 서",
      "bride": "김 은 재",
      "date": "2038년 10월 12일 토요일 오후 2시",
      "venue": "메종 드 프리미어 그랜드홀",
      "photo": "/assets/wedding-card-003/photo.png",
      "cardBackground": "/assets/wedding-card-003/card-bg.png"
    }
  },
  "components": [
    {
      "id": "wedding-card-main",
      "type": "wedding-card-template-003",
      "data": {
        "groom": "$.data.wedding.groom",
        "bride": "$.data.wedding.bride",
        "date": "$.data.wedding.date",
        "venue": "$.data.wedding.venue",
        "photo": "$.data.wedding.photo",
        "cardBackground": "$.data.wedding.cardBackground"
      }
    }
  ]
}
```

### 6️⃣ 렌더러 등록
```typescript
// lib/server-driven-ui/renderer.tsx에 추가

import { WeddingCard003 } from '@/components/cards/WeddingCard003'

// ComponentType 타입에 추가
export type ComponentType =
  | 'wedding-card-template-001'
  | 'wedding-card-template-002'
  | 'wedding-card-template-003'  // ← 추가

// renderComponent 함수에 case 추가
case 'wedding-card-template-003':
  return renderWeddingCardTemplate003(component, data, style, className, key)

// 렌더링 함수 구현
function renderWeddingCardTemplate003(
  component: WeddingCardTemplate003Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    // ⚠️ 중요: photo 기본값은 반드시 /assets/common/photo.png 사용
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-003/card-bg.png'
  }

  return <WeddingCard003 key={key} data={weddingData} style={style} className={className} />
}
```

**⚠️ 중요: Photo 기본값 규칙**

템플릿에서 `photo` 필드가 비어있거나 데이터가 없을 경우, **반드시 `/assets/common/photo.png`를 기본값으로 사용**해야 합니다.

```typescript
// ✅ 올바른 방법
photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',

// ❌ 잘못된 방법
photo: resolveJSONPath(data, component.data.photo) || '/placeholder.jpg',
photo: resolveJSONPath(data, component.data.photo) || '',
```

**이유:**
- `/assets/common/photo.png`는 모든 템플릿에서 공통으로 사용하는 기본 샘플 이미지
- 템플릿 개발/미리보기 시 이미지 깨짐 방지
- 일관된 사용자 경험 제공

### 7️⃣ 타입 정의 추가
```typescript
// types/server-driven-ui/schema.ts에 추가

export interface WeddingCardTemplate003Component extends BaseComponent {
  type: 'wedding-card-template-003'
  data: {
    groom: JSONPathExpression
    bride: JSONPathExpression
    date: JSONPathExpression
    venue: JSONPathExpression
    photo: JSONPathExpression
    cardBackground?: JSONPathExpression
    // ... 템플릿 고유 필드
  }
}

// Component 타입 union에 추가
export type Component =
  | WeddingCardTemplate001Component
  | WeddingCardTemplate002Component
  | WeddingCardTemplate003Component  // ← 추가
```

### 8️⃣ 라우트 등록
```typescript
// app/templates/[id]/page.tsx의 generateStaticParams에 추가

export function generateStaticParams() {
  return [
    { id: 'wedding-card-001' },
    { id: 'wedding-card-002' },
    { id: 'wedding-card-003' }  // ← 추가
  ]
}
```

### 9️⃣ 에셋 준비
```
public/assets/wedding-card-003/
├── bg.png              # 페이지 배경
├── card-bg.png         # 카드 배경
├── pattern.png         # 봉투 패턴
├── seal.png            # 봉투 씰
├── photo.png           # 샘플 사진
├── decoration.svg      # 장식 요소
└── date-divider.svg    # 날짜 구분선 (필요시)
```

### 🔟 테스트 및 검증

#### 개별 템플릿 검증 (개발 중)
```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3000/templates/wedding-card-003

# 체크사항:
# ✅ 모든 요소가 Figma 시안과 동일한 위치에 있는가?
# ✅ 반응형으로 정상 작동하는가?
# ✅ 텍스트가 올바르게 표시되는가?
# ✅ 이미지가 정상적으로 로드되는가?
# ✅ 애니메이션이 부드럽게 작동하는가?
```

#### ⭐ 전체 템플릿 통합 검증 (권장)
```bash
# HTTP 서버 시작
python3 -m http.server 8080

# Template Validator 페이지 열기
open http://localhost:8080/template-validator.html
```

**Template Validator 페이지 기능:**
- ✅ **모든 템플릿 자동 로드**: wedding-card-001 ~ 004 자동 로딩
- ✅ **Side-by-Side 비교**: Hardcoded vs SDUI 렌더링 동시 표시
- ✅ **실제 Assets 렌더링**: /assets/ 경로의 실제 이미지 사용
- ✅ **통계 대시보드**: 통과/실패 템플릿 개수 집계
- ✅ **JSON 스키마 뷰어**: 각 템플릿의 JSON 구조 확인
- ✅ **체크리스트**: JSON 유효성, Assets 로딩, 레이아웃 렌더링 상태

**검증 체크리스트:**
1. **Layout 일치**: Hardcoded와 SDUI 렌더링이 픽셀 단위로 동일한가?
2. **Assets 로딩**: 모든 이미지가 깨지지 않고 표시되는가?
3. **Typography**: 폰트, 크기, 색상, Letter Spacing이 정확한가?
4. **z-index**: 요소들의 레이어 순서가 올바른가?
5. **JSON Schema**: `type`, `editable` 필드가 모든 layout 요소에 있는가?

**⚠️ SDUI 검증 필수사항:**
- 템플릿 개발 완료 후 반드시 Template Validator로 검증
- Hardcoded와 SDUI 렌더링이 100% 일치해야 배포 가능
- JSON layout의 type 필드 누락 시 SDUI 렌더링 실패
- 실제 assets 경로 확인 필수 (404 에러 없어야 함)

---

## 체크리스트

### 📐 Figma 디자인
- [ ] 템플릿 크기: 335px × 515px
- [ ] ⚠️ 중요: 평평한 레이어 구조 (중첩 그룹 없음)
- [ ] 모든 레이어가 template 바로 아래에 배치됨
- [ ] 레이어 이름: 소문자 + 언더스코어
- [ ] JSON 키값과 레이어 이름 일치 (groom, bride, date, venue, photo)
- [ ] [locked] / [editable] 태그 적용
- [ ] Node ID 확인 및 기록

### 🔧 개발
- [ ] 방법 선택 (wedding-card-001 vs wedding-card-002)
- [ ] Figma MCP로 메타데이터 확인
- [ ] BG 오프셋 계산 (bgOffsetX, bgOffsetY)
- [ ] 컴포넌트 생성 (WeddingCardXXX.tsx)
- [ ] 타입 정의 추가 (방법 1 선택 시)
- [ ] JSON 스키마 생성
- [ ] ⚠️ 중요: Layout의 모든 요소에 `type` 필드 추가
  - [ ] text 타입: groom, bride, date, venue 등
  - [ ] image 타입: photo, decoration, background 등
  - [ ] vector 타입: SVG 아이콘, 구분선 등
- [ ] ⚠️ 중요: Layout의 모든 요소에 `editable` 필드 추가 (true/false)
- [ ] 렌더러 등록 (renderer.tsx)
- [ ] 타입 정의 추가 (schema.ts)
- [ ] 라우트 등록 (generateStaticParams)

### 🎨 에셋
- [ ] 모든 이미지 준비 (bg.png, card-bg.png, etc.)
- [ ] ⚠️ 중요: 기본 photo 이미지는 `/assets/common/photo.png` 사용
- [ ] 공통 에셋은 `/assets/common/`에 배치 (bg.png, pattern.png, seal.png, photo.png)
- [ ] 템플릿 고유 에셋만 `/assets/wedding-card-XXX/`에 배치
- [ ] 파일명 규칙 준수
- [ ] 이미지 최적화 (WebP, 압축)
- [ ] SVG 메타데이터 제거

### ✅ 테스트
- [ ] 로컬 개발 서버에서 확인
- [ ] Figma 시안과 비교 검증
- [ ] 반응형 테스트 (모바일, 태블릿, 데스크톱)
- [ ] 애니메이션 동작 확인
- [ ] 빌드 성공 확인 (`npm run build`)

---

## 🔍 트러블슈팅

### 문제: 요소가 엉뚱한 위치에 표시됨

**원인:** BG 오프셋 계산 오류

**해결:**
```typescript
// 1. Figma 메타데이터로 BG 좌표 재확인
mcp__figma-dev-mode-mcp-server__get_metadata({ nodeId: "YOUR_ID" })

// 2. BG의 x, y 좌표 확인
<rounded-rectangle id="2:2" name="BG" x="20" y="148" />
//                                         ^^^  ^^^

// 3. bgOffset 변수 수정
const bgOffsetX = 20
const bgOffsetY = 148
```

### 문제: Figma에 중간 그룹이 있는 경우

**해결:**
1. Figma에서 중간 그룹 선택 (예: `input` Frame)
2. 우클릭 → "Frame을 제거" 또는 "그룹 해제"
3. 모든 요소가 template 바로 아래로 이동됨
4. 메타데이터 다시 확인

### 문제: 백분율 계산이 복잡함

**해결:** 방법 1 사용 (layout-utils.ts)
```typescript
// 수동 계산 대신 유틸리티 함수 사용
import { elementLayoutToStyle } from '@/lib/layout-utils'

// Before
<div style={{
  position: 'absolute',
  left: `${(96 / 335) * 100}%`,
  top: `${(78 / 515) * 100}%`,
  width: `${(144 / 335) * 100}%`,
  height: `${(144 / 515) * 100}%`
}}>

// After
<div style={elementLayoutToStyle(layout.photo, baseSize)}>
```

---

## 📚 참고 자료

- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - Figma 디자인 가이드
- [API_SPEC.md](./API_SPEC.md) - API 명세서
- [types/card-layout.ts](./types/card-layout.ts) - 레이아웃 타입 정의
- [lib/layout-utils.ts](./lib/layout-utils.ts) - 유틸리티 함수

---

**💡 팁:** 처음 템플릿을 만들 때는 wedding-card-001을 복사해서 시작하는 것을 권장합니다. 타입 시스템과 유틸리티 함수가 이미 구현되어 있어 개발 속도가 빠릅니다.
