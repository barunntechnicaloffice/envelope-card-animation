# 🎴 템플릿 추가 가이드

새로운 웨딩 카드 템플릿을 추가하는 방법을 단계별로 설명합니다.

## 📋 목차
- [시작하기 전에](#시작하기-전에)
- [템플릿 추가 절차](#템플릿-추가-절차)
- [템플릿 구조](#템플릿-구조)
- [자주 묻는 질문](#자주-묻는-질문)

---

## 시작하기 전에

### 필요한 것
- Figma 디자인 파일
- Figma Dev Mode 접근 권한
- Node.js 및 npm 설치

### 템플릿 네이밍 규칙
- 템플릿 ID: `wedding-card-XXX` (예: `wedding-card-003`)
- 컴포넌트 파일: `WeddingCardXXX.tsx` (예: `WeddingCard003.tsx`)
- JSON 스키마: `wedding-card-XXX.json`

---

## 템플릿 추가 절차

### 1️⃣ Figma 디자인 준비

#### 1-1. Figma에서 템플릿 프레임 생성
```
템플릿 크기: 335px × 515px (고정)
프레임 이름: template
```

#### 1-2. 레이어 구조 규칙
⚠️ **중요: 평평한 레이어 구조 필수!**
```
template (335×515)
├── BG (background)
├── photo
├── groom
├── bride
├── date
├── venue
└── decoration
```

**❌ 잘못된 구조 (중첩 그룹 사용)**
```
template
└── input (Frame)
    ├── groom
    └── bride
```

**✅ 올바른 구조 (모든 요소가 template 바로 아래)**
```
template
├── groom
└── bride
```

#### 1-3. 레이어 네이밍 규칙
- 소문자 + 언더스코어 사용: `photo`, `groom_name`, `date_text`
- JSON 키값과 일치시키기: `groom`, `bride`, `date`, `venue`
- 편집 가능 여부 태그: `[editable]` 또는 `[locked]`

#### 1-4. Figma에서 Node ID 확인
1. Figma에서 템플릿 프레임 선택
2. Dev Mode로 전환 (Shift + D)
3. URL에서 Node ID 복사: `node-id=123-456`

---

### 2️⃣ 에셋 준비

#### 2-1. 에셋 폴더 생성
```bash
mkdir -p public/assets/wedding-card-003
```

#### 2-2. 필요한 에셋 파일
```
public/assets/wedding-card-003/
├── card-bg.png          # 카드 배경 이미지
├── decoration.png       # 장식 이미지 (선택)
└── [기타 템플릿 고유 에셋]
```

⚠️ **공통 에셋은 `/assets/common/` 사용**
```
public/assets/common/
├── bg.png              # 페이지 배경
├── pattern.png         # 봉투 패턴
├── seal.png            # 봉투 씰
└── photo.png           # 기본 샘플 사진
```

#### 2-3. 에셋 최적화
```bash
# 이미지 최적화 (선택 사항)
npm run optimize-images  # 만약 스크립트가 있다면
```

---

### 3️⃣ 컴포넌트 생성

#### 3-1. 새 컴포넌트 파일 생성
```bash
touch components/cards/WeddingCard003.tsx
```

#### 3-2. 컴포넌트 코드 작성

**방법 1: 타입 시스템 기반 (권장)**

`components/cards/WeddingCard003.tsx`:
```typescript
import type { WeddingData } from '@/types/wedding'
import type { WeddingCardLayout } from '@/types/card-layout'
import { DEFAULT_WEDDING_CARD_LAYOUT } from '@/types/card-layout'
import {
  elementLayoutToStyle,
  textLayoutToStyle,
  textBlockLayoutToStyle
} from '@/lib/layout-utils'

interface WeddingCard003Props {
  data: WeddingData
  layout?: WeddingCardLayout
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard003({
  data,
  layout = DEFAULT_WEDDING_CARD_LAYOUT,
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
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* 배경 이미지 */}
      {data.backgroundImage && (
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
      )}

      {/* 사진 */}
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

      {/* 장식 이미지 */}
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
    </div>
  )
}
```

**방법 2: 수동 계산 기반 (간단한 템플릿용)**

참고: `CLAUDE.md`의 "방법 2: wedding-card-002 기반" 섹션 참조

---

### 4️⃣ JSON 스키마 생성

#### 4-1. JSON 파일 생성
```bash
touch public/templates/wedding-card-003.json
```

#### 4-2. JSON 스키마 작성

`public/templates/wedding-card-003.json`:
```json
{
  "id": "wedding-card-003",
  "version": "1.0.0",
  "name": "웨딩 청첩장 템플릿 003",
  "category": "wedding",
  "thumbnail": "/assets/wedding-card-003/card-bg.png",
  "figmaNodeId": "YOUR_FIGMA_NODE_ID",
  "common": {
    "envelope": {
      "pattern": "/assets/common/pattern.png",
      "seal": "/assets/common/seal.png"
    },
    "background": "/assets/common/bg.png"
  },
  "layout": {
    "photo": {
      "x": 52,
      "y": 106,
      "width": 233.076,
      "height": 257.502,
      "zIndex": 1
    },
    "groom": {
      "x": 24,
      "y": 395,
      "width": 111,
      "fontSize": 20,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "letterSpacing": -0.316,
      "align": "center",
      "zIndex": 2
    },
    "bride": {
      "x": 193,
      "y": 395,
      "width": 117,
      "fontSize": 20,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "letterSpacing": -0.316,
      "align": "center",
      "zIndex": 2
    },
    "dateVenue": {
      "x": 0,
      "y": 437.49,
      "width": 335,
      "fontSize": 12,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "lineHeight": 1.67,
      "align": "center",
      "paddingX": 33.5,
      "zIndex": 2
    },
    "decoration": {
      "x": 135.22,
      "y": 384,
      "width": 41.675,
      "height": 39.546,
      "zIndex": 2
    }
  },
  "data": {
    "wedding": {
      "groom": "이 준 서",
      "bride": "김 은 재",
      "date": "2038년 10월 12일 토요일 오후 2시",
      "venue": "메종 드 프리미어 그랜드홀",
      "photo": "/assets/common/photo.png",
      "backgroundImage": "/assets/wedding-card-003/card-bg.png",
      "decorationImage": "/assets/wedding-card-003/decoration.png"
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
        "backgroundImage": "$.data.wedding.backgroundImage",
        "decorationImage": "$.data.wedding.decorationImage"
      }
    }
  ]
}
```

⚠️ **중요: Figma 좌표를 JSON에 그대로 입력**
- JSON의 `layout` 섹션에는 **Figma의 절대 좌표(픽셀)** 그대로 입력
- 렌더링 시 `layout-utils.ts`가 **자동으로 백분율 변환**
- 디자이너가 Figma 좌표를 바로 사용할 수 있어 편리함

---

### 5️⃣ 타입 정의 추가

#### 5-1. WeddingData 타입 확장 (필요시)

`types/wedding.ts`:
```typescript
export interface WeddingData {
  groom: string
  bride: string
  date: string
  venue: string
  photo: string
  backgroundImage?: string     // wedding-card-001용
  decorationImage?: string     // wedding-card-001용
  cardBackground?: string      // wedding-card-002용
  decoration?: string          // wedding-card-002용
  dateDivider?: string         // wedding-card-002용
  // 새로운 필드 추가 (필요시)
  customField?: string         // wedding-card-003용
}
```

#### 5-2. Component 타입 추가

`types/server-driven-ui/schema.ts`:
```typescript
// 1. ComponentType에 추가
export type ComponentType =
  | 'wedding-card-template-001'
  | 'wedding-card-template-002'
  | 'wedding-card-template-003';  // ← 추가

// 2. 새 인터페이스 정의
export interface WeddingCardTemplate003Component extends BaseComponent {
  type: 'wedding-card-template-003';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    photo: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
    decorationImage?: JSONPathExpression;
    // 템플릿 고유 필드 추가
  };
}

// 3. Component union에 추가
export type Component =
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | ContainerComponent
  | CardComponent
  | WeddingCardTemplate001Component
  | WeddingCardTemplate002Component
  | WeddingCardTemplate003Component;  // ← 추가
```

---

### 6️⃣ 렌더러 등록

#### 6-1. 렌더러에 import 추가

`lib/server-driven-ui/renderer.tsx`:
```typescript
// 상단에 import 추가
import type {
  WeddingCardTemplate001Component,
  WeddingCardTemplate002Component,
  WeddingCardTemplate003Component,  // ← 추가
} from '@/types/server-driven-ui/schema'
```

#### 6-2. renderComponent에 case 추가

```typescript
export function renderComponent(
  component: Component,
  data: Record<string, any>,
  key?: string | number
): React.ReactNode {
  // ... 기존 코드 ...

  switch (component.type) {
    case 'wedding-card-template-001':
      return renderWeddingCardTemplate001(component as WeddingCardTemplate001Component, data, style, className, key)

    case 'wedding-card-template-002':
      return renderWeddingCardTemplate002(component as WeddingCardTemplate002Component, data, style, className, key)

    case 'wedding-card-template-003':  // ← 추가
      return renderWeddingCardTemplate003(component as WeddingCardTemplate003Component, data, style, className, key)

    default:
      console.warn(`Unknown component type: ${(component as any).type}`)
      return null
  }
}
```

#### 6-3. 렌더링 함수 구현

```typescript
function renderWeddingCardTemplate003(
  component: WeddingCardTemplate003Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard003 컴포넌트 import
  const { WeddingCard003 } = require('@/components/cards/WeddingCard003')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    // ⚠️ 중요: photo 기본값은 반드시 /assets/common/photo.png
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',

    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : undefined,
    decorationImage: component.data.decorationImage
      ? resolveJSONPath(data, component.data.decorationImage)
      : undefined
  }

  // Layout 정보
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard003
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}
```

---

### 7️⃣ EnvelopeCard 업데이트

`components/EnvelopeCard.tsx`:
```typescript
import { WeddingCard003 } from './cards/WeddingCard003'  // import 추가

// 템플릿 ID에 따라 컴포넌트 선택
const CardComponent =
  templateId === 'wedding-card-003' ? WeddingCard003 :
  templateId === 'wedding-card-002' ? WeddingCard002 :
  WeddingCard
```

---

### 8️⃣ 라우트 등록

`app/templates/[id]/page.tsx`:
```typescript
export function generateStaticParams() {
  return [
    { id: 'wedding-card-001' },
    { id: 'wedding-card-002' },
    { id: 'wedding-card-003' }  // ← 추가
  ]
}
```

---

### 9️⃣ 개발 서버 실행 및 테스트

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
open http://localhost:3000/templates/wedding-card-003
```

#### 테스트 체크리스트
- [ ] 모든 텍스트가 Figma 시안과 동일한 위치에 표시되는가?
- [ ] 이미지가 정상적으로 로드되는가?
- [ ] 반응형으로 정상 작동하는가?
- [ ] 봉투 애니메이션이 부드럽게 작동하는가?
- [ ] Swiper로 카드 넘기기가 정상 작동하는가?

---

### 🔟 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 확인
npm run start

# 정적 export (필요시)
npm run export
```

---

## 템플릿 구조

### 프로젝트 파일 구조
```
envelope-card-animation/
├── components/cards/
│   ├── WeddingCard.tsx          # 템플릿 001
│   ├── WeddingCard002.tsx       # 템플릿 002
│   └── WeddingCard003.tsx       # 템플릿 003 ← 새로 추가
├── types/
│   ├── card-layout.ts           # 레이아웃 타입 정의
│   ├── wedding.ts               # 데이터 타입 정의
│   └── server-driven-ui/
│       └── schema.ts            # 스키마 타입 정의
├── lib/
│   ├── layout-utils.ts          # 백분율 변환 유틸리티
│   └── server-driven-ui/
│       └── renderer.tsx         # 렌더러
├── public/
│   ├── assets/
│   │   ├── common/              # 공통 에셋
│   │   ├── wedding-card-001/
│   │   ├── wedding-card-002/
│   │   └── wedding-card-003/    # 새 템플릿 에셋 ← 새로 추가
│   └── templates/
│       ├── wedding-card-001.json
│       ├── wedding-card-002.json
│       └── wedding-card-003.json ← 새로 추가
└── app/templates/[id]/
    ├── page.tsx                 # 템플릿 라우트
    └── TemplatePageClient.tsx
```

---

## 자주 묻는 질문

### Q1. Figma 좌표를 어떻게 가져오나요?
**A:** Figma MCP 사용 (Claude Code에서 지원)
```typescript
mcp__figma-dev-mode-mcp-server__get_metadata({
  nodeId: "YOUR_NODE_ID"
})
```

### Q2. 이미지 기본값은 어떻게 설정하나요?
**A:** `photo`의 기본값은 **반드시** `/assets/common/photo.png` 사용
```typescript
photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',
```

### Q3. 공통 에셋과 템플릿 고유 에셋은 어떻게 구분하나요?
**A:**
- **공통 에셋** (`/assets/common/`): 모든 템플릿에서 사용
  - `bg.png` (페이지 배경)
  - `pattern.png` (봉투 패턴)
  - `seal.png` (봉투 씰)
  - `photo.png` (기본 샘플 사진)

- **템플릿 고유 에셋** (`/assets/wedding-card-XXX/`): 해당 템플릿에만 사용
  - `card-bg.png` (카드 배경)
  - `decoration.png` (장식 이미지)

### Q4. 타입 시스템 기반 vs 수동 계산 기반, 어떤 걸 선택하나요?
**A:**
- **타입 시스템 기반 (방법 1)**: 복잡한 템플릿, 재사용 가능한 레이아웃
- **수동 계산 기반 (방법 2)**: 간단한 템플릿, 빠른 프로토타입

자세한 내용은 `CLAUDE.md` 참조

### Q5. 템플릿 ID는 어떻게 정하나요?
**A:** `wedding-card-XXX` 형식 사용 (3자리 숫자)
- ✅ `wedding-card-003`
- ❌ `wedding-card-3`
- ❌ `wedding-003`

### Q6. 레이아웃 좌표 계산이 복잡한데 자동화할 수 없나요?
**A:** JSON에는 Figma 좌표 그대로 입력하면 됩니다. `layout-utils.ts`가 자동으로 백분율 변환합니다.

### Q7. 봉투 애니메이션은 자동으로 적용되나요?
**A:** 네, `EnvelopeCard` 컴포넌트가 모든 템플릿에 봉투 애니메이션을 자동 적용합니다.

---

## 추가 리소스

- [CLAUDE.md](./CLAUDE.md) - 코드 스타일 가이드 및 개발 원칙
- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - Figma 디자인 가이드
- [API_SPEC.md](./API_SPEC.md) - API 명세서
- [types/card-layout.ts](./types/card-layout.ts) - 레이아웃 타입 정의
- [lib/layout-utils.ts](./lib/layout-utils.ts) - 유틸리티 함수

---

## 문제 해결

### 이미지가 표시되지 않는 경우
1. 파일 경로 확인: `/assets/wedding-card-XXX/card-bg.png`
2. JSON에 이미지 경로 추가 확인
3. EnvelopeCard에 `templateData` 전달 확인

### 레이아웃이 Figma와 다른 경우
1. Figma 메타데이터로 좌표 재확인
2. JSON `layout` 섹션 좌표 확인
3. `layout-utils.ts`의 변환 로직 확인

### 타입 에러가 발생하는 경우
1. `types/wedding.ts`에 필드 추가
2. `types/server-driven-ui/schema.ts`에 타입 정의
3. TypeScript 컴파일 재실행

---

**💡 팁:**   
 User: TEMPLATE_GUIDE.md 보고 wedding-card-003 템플릿 만들어줘. Figma mcp는 ~~~~