# 🎴 Wedding Card Template Development Guide

**버전:** 3.0.0 (SDUI Architecture)
**최종 업데이트:** 2025-01-27

이 문서는 다른 개발자가 업데이트한 최신 아키텍처를 기반으로 작성되었습니다.

---

## 📋 목차

- [아키텍처 개요](#아키텍처-개요)
- [SDUI 패턴이란](#sdui-패턴이란)
- [템플릿 구현 방법](#템플릿-구현-방법)
- [좌표 시스템](#좌표-시스템)
- [단계별 개발 프로세스](#단계별-개발-프로세스)
- [체크리스트](#체크리스트)

---

## 아키텍처 개요

### 🎯 핵심 원칙

**SDUI (Server-Driven UI)** 패턴을 사용합니다.

```
JSON Schema (layout + data)
         ↓
  Renderer (renderer.tsx)
         ↓
  Component (WeddingCardXXX.tsx)
         ↓
  renderLayoutElement (layout-utils.ts)
         ↓
  React CSSProperties
```

**특징:**
- ✅ 모든 레이아웃이 JSON에서 관리됨
- ✅ 컴포넌트는 순수 렌더링 로직만 담당
- ✅ 코드 수정 없이 JSON만 변경해서 디자인 수정 가능
- ✅ 타입 안정성 유지

---

## SDUI 패턴이란

### 기존 방식 (❌ Deprecated)

```typescript
// 하드코딩된 좌표와 스타일
export function WeddingCard002({ data }) {
  return (
    <p style={{
      position: 'absolute',
      left: '28.66%',
      top: '74.17%',
      fontSize: '18px',
      fontFamily: "'NanumMyeongjo', serif",
      color: '#333333'
    }}>
      {data.groom}
    </p>
  )
}
```

### SDUI 방식 (✅ Current)

```typescript
// JSON 기반 동적 렌더링
export function WeddingCard002({ data, layout }) {
  if (!layout) {
    return <div>Layout이 필요합니다</div>
  }

  const { baseSize } = layout

  return (
    <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
      {data.groom}
    </p>
  )
}
```

**JSON Schema:**
```json
{
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "groom": {
      "type": "text",
      "x": 96,
      "y": 382,
      "width": 116,
      "fontSize": 18,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "align": "right",
      "zIndex": 2,
      "editable": true
    }
  }
}
```

---

## 템플릿 구현 방법

### 📁 필수 파일 구조

```
1. public/templates/wedding-card-XXX.json     # JSON 스키마
2. components/cards/WeddingCardXXX.tsx        # 컴포넌트
3. lib/server-driven-ui/renderer.tsx          # 렌더러 등록
4. types/server-driven-ui/schema.ts           # 타입 정의
5. app/templates/[id]/page.tsx                # 라우트 등록
```

### 📝 JSON 스키마 구조

**전체 구조:**
```json
{
  "id": "wedding-card-XXX",
  "version": "3.0.0",
  "name": "웨딩 청첩장 템플릿 XXX",
  "category": "wedding",
  "thumbnail": "/assets/wedding-card-XXX/card-bg.png",
  "figmaNodeId": "YOUR_NODE_ID",
  "common": {
    "envelope": {
      "pattern": "/assets/common/pattern.png",
      "seal": "/assets/common/seal.png"
    },
    "background": "/assets/common/bg.png"
  },
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "background": {
      "type": "background",
      "zIndex": 0,
      "editable": false
    },
    "photo": {
      "type": "image",
      "x": 96,
      "y": 78,
      "width": 144,
      "height": 144,
      "zIndex": 1,
      "editable": true,
      "objectFit": "cover"
    },
    "groom": {
      "type": "text",
      "x": 167.5,
      "y": 188,
      "centerAlign": true,
      "fontSize": 18,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "zIndex": 2,
      "editable": true
    }
  },
  "data": {
    "wedding": {
      "groom": "이 준 서",
      "bride": "김 은 재",
      "date": "2038년 10월 12일",
      "venue": "메종 드 프리미어",
      "photo": "/assets/common/photo.png"
    }
  },
  "components": [
    {
      "id": "wedding-card-main",
      "type": "wedding-card-template-XXX",
      "data": {
        "groom": "$.data.wedding.groom",
        "bride": "$.data.wedding.bride",
        "date": "$.data.wedding.date",
        "venue": "$.data.wedding.venue",
        "photo": "$.data.wedding.photo"
      }
    }
  ]
}
```

### 📌 Layout 요소 필수 필드

**모든 layout 요소는 다음 필드를 반드시 포함:**

```json
{
  "type": "text" | "image" | "vector" | "container" | "background",
  "x": number,
  "y": number,
  "zIndex": number,
  "editable": boolean
}
```

### 🎨 Type별 추가 필드

#### **type: "text"**
```json
{
  "type": "text",
  "x": 167.5,
  "y": 188,
  "width": 116,              // 선택적, "auto" 가능
  "fontSize": 18,
  "fontFamily": "'NanumMyeongjo', serif",
  "fontWeight": 700,
  "fontStyle": "normal",
  "color": "#333333",
  "letterSpacing": -0.2844,
  "lineHeight": 1.67,        // 선택적
  "align": "center",         // "left" | "center" | "right"
  "textTransform": "uppercase", // 선택적
  "centerAlign": true,       // ⭐ 좌우 중앙 정렬
  "zIndex": 2,
  "editable": true
}
```

#### **type: "image"**
```json
{
  "type": "image",
  "x": 96,
  "y": 78,
  "width": 144,
  "height": 144,
  "objectFit": "cover",      // "cover" | "contain"
  "zIndex": 1,
  "editable": true
}
```

### 🔧 컴포넌트 구현 패턴

**표준 템플릿:**

```typescript
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCardXXXProps {
  data: WeddingData
  layout?: any  // JSON layout 객체
  className?: string
  style?: React.CSSProperties
}

export function WeddingCardXXX({
  data,
  layout,
  className,
  style
}: WeddingCardXXXProps) {
  // ⭐ 1. Layout 필수 체크
  if (!layout) {
    return <div style={{...style, padding: '20px', backgroundColor: '#fff'}}>
      Layout이 필요합니다
    </div>
  }

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
      {/* ⭐ 2. 배경 이미지 (특별 처리) */}
      {data.backgroundImage && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: layout.background.zIndex || 0
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

      {/* ⭐ 3. 이미지 요소 */}
      {layout.photo && (
        <div style={{
          ...renderLayoutElement('photo', layout.photo, baseSize, data),
          overflow: 'hidden'
        }}>
          <img
            src={data.photo}
            alt="Wedding Photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: layout.photo.objectFit || 'cover'
            }}
          />
        </div>
      )}

      {/* ⭐ 4. 텍스트 요소 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
```

---

## 좌표 시스템

### ⚠️ 중요: BG 기준 상대 좌표 사용

**Figma에서 추출한 절대 좌표를 BG 기준 상대 좌표로 변환해야 합니다!**

#### 1. Figma 메타데이터 확인

```typescript
// Figma MCP로 메타데이터 추출
mcp__figma-local__get_metadata({ nodeId: "70:1582" })

// 결과 예시:
<frame id="70:1582" name="template" x="21" y="148.5">
  <rounded-rectangle id="70:1583" name="BG" x="21" y="148.5" />
  <text id="70:1585" name="groom" x="188.5" y="336.9375" />
</frame>
```

#### 2. BG 오프셋 계산

```
BG 좌표: x=21, y=148.5
→ bgOffsetX = 21
→ bgOffsetY = 148.5
```

#### 3. 상대 좌표 변환

```javascript
// Figma 절대 좌표
const groomAbsolute = { x: 188.5, y: 336.9375 }

// BG 기준 상대 좌표 (JSON에 저장할 값)
const groomRelative = {
  x: 188.5 - 21 = 167.5,
  y: 336.9375 - 148.5 = 188.4375
}
```

#### 4. JSON에 저장

```json
{
  "groom": {
    "type": "text",
    "x": 167.5,        // 상대 좌표!
    "y": 188.4375,     // 상대 좌표!
    "centerAlign": true,
    ...
  }
}
```

### 🎯 centerAlign 사용

**중앙 정렬 텍스트는 `centerAlign: true` 사용:**

```json
{
  "groom": {
    "type": "text",
    "x": 167.5,           // baseSize.width / 2 = 335 / 2 = 167.5
    "y": 188.4375,
    "centerAlign": true,  // ⭐ translateX(-50%) 자동 적용
    "align": "center"
  }
}
```

**renderLayoutElement가 자동으로 처리:**
```typescript
if (element.centerAlign) {
  style.transform = 'translateX(-50%)'
}
```

---

## 단계별 개발 프로세스

### Step 1: Figma 디자인 준비

1. Figma에서 template Frame 생성 (335×515px)
2. 모든 요소를 template 바로 아래에 배치 (중첩 그룹 금지!)
3. 레이어 이름: 소문자 + 언더스코어
4. Dev Mode에서 Node ID 확인

### Step 2: Figma MCP로 디자인 추출

```typescript
// 메타데이터 확인 (좌표 추출)
mcp__figma-local__get_metadata({ nodeId: "YOUR_NODE_ID" })

// 스크린샷 확인
mcp__figma-local__get_screenshot({ nodeId: "YOUR_NODE_ID" })

// 디자인 컨텍스트 확인
mcp__figma-local__get_design_context({ nodeId: "YOUR_NODE_ID" })
```

### Step 3: 좌표 계산

```typescript
// 1. BG 오프셋 확인
const bgOffsetX = 21
const bgOffsetY = 148.5

// 2. 각 요소의 상대 좌표 계산
const elements = {
  groom: {
    absolute: { x: 188.5, y: 336.9375 },
    relative: { x: 167.5, y: 188.4375 }  // absolute - bgOffset
  }
}
```

### Step 4: JSON 스키마 작성

`public/templates/wedding-card-XXX.json` 생성

```json
{
  "id": "wedding-card-XXX",
  "version": "3.0.0",
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "groom": {
      "type": "text",
      "x": 167.5,
      "y": 188.4375,
      "centerAlign": true,
      "fontSize": 18,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "zIndex": 2,
      "editable": true
    }
  }
}
```

### Step 5: 컴포넌트 작성

`components/cards/WeddingCardXXX.tsx` 생성

```typescript
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

export function WeddingCardXXX({ data, layout, className, style }) {
  if (!layout) {
    return <div>Layout이 필요합니다</div>
  }

  const { baseSize } = layout

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}
    </div>
  )
}
```

### Step 6: Renderer 등록

`lib/server-driven-ui/renderer.tsx`에 추가:

```typescript
// 1. Import
import type { WeddingCardTemplateXXXComponent } from '@/types/server-driven-ui/schema'

// 2. ComponentType에 추가
export type ComponentType =
  | 'wedding-card-template-XXX'

// 3. renderComponent에 case 추가
case 'wedding-card-template-XXX':
  return renderWeddingCardTemplateXXX(component as WeddingCardTemplateXXXComponent, data, style, className, key)

// 4. 렌더링 함수 구현
function renderWeddingCardTemplateXXX(component, data, style, className, key) {
  const { WeddingCardXXX } = require('@/components/cards/WeddingCardXXX')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : undefined
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return <WeddingCardXXX key={key} data={weddingData} layout={layout} style={style} className={className} />
}
```

### Step 7: 타입 정의

`types/server-driven-ui/schema.ts`에 추가:

```typescript
export interface WeddingCardTemplateXXXComponent extends BaseComponent {
  type: 'wedding-card-template-XXX'
  data: {
    groom: JSONPathExpression
    bride: JSONPathExpression
    date: JSONPathExpression
    venue: JSONPathExpression
    photo: JSONPathExpression
    backgroundImage?: JSONPathExpression
  }
}

// Component union에 추가
export type Component =
  | WeddingCardTemplateXXXComponent
```

### Step 8: 라우트 등록

`app/templates/[id]/page.tsx`의 `generateStaticParams`에 추가:

```typescript
export function generateStaticParams() {
  return [
    { id: 'wedding-card-XXX' }
  ]
}
```

### Step 9: 에셋 준비

```
public/assets/wedding-card-XXX/
├── card-bg.png         # 카드 배경
├── decoration.svg      # 장식 요소
└── ...
```

### Step 10: 테스트

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
http://localhost:3000/templates/wedding-card-XXX

# 빌드 테스트
npm run build
```

---

## 체크리스트

### ✅ JSON 스키마
- [ ] `version: "3.0.0"` 명시
- [ ] 모든 layout 요소에 `type` 필드
- [ ] 모든 layout 요소에 `editable` 필드
- [ ] BG 기준 상대 좌표 사용
- [ ] `baseSize: { width: 335, height: 515 }` 정의
- [ ] 중앙 정렬 텍스트에 `centerAlign: true`

### ✅ 컴포넌트
- [ ] `layout` prop 필수 체크
- [ ] `renderLayoutElement` 함수 사용 (하드코딩 금지)
- [ ] 조건부 렌더링 (`layout.xxx &&`)
- [ ] 이미지는 컨테이너 + img 구조

### ✅ Renderer
- [ ] `renderWeddingCardTemplateXXX` 함수 추가
- [ ] JSONPath 데이터 추출
- [ ] photo 기본값: `/assets/common/photo.png`
- [ ] layout 추출: `$.layout`

### ✅ 타입 정의
- [ ] `WeddingCardTemplateXXXComponent` 인터페이스
- [ ] `Component` union에 추가
- [ ] 필요한 경우 `WeddingData`에 필드 추가

### ✅ 에셋
- [ ] 공통 에셋: `/assets/common/`
- [ ] 템플릿 고유 에셋: `/assets/wedding-card-XXX/`
- [ ] 이미지 최적화 (WebP, 압축)

### ✅ 테스트
- [ ] 로컬 개발 서버 확인
- [ ] Figma 시안과 비교 검증
- [ ] 빌드 성공 (`npm run build`)

---

## 🔍 트러블슈팅

### 문제: 요소가 엉뚱한 위치에 표시됨

**원인:** BG 오프셋 계산 오류

**해결:**
```typescript
// Figma 메타데이터로 BG 좌표 재확인
mcp__figma-local__get_metadata({ nodeId: "YOUR_ID" })

// BG의 x, y 좌표 확인
<rounded-rectangle id="..." name="BG" x="21" y="148.5" />

// 상대 좌표 계산
const relative = {
  x: absoluteX - 21,
  y: absoluteY - 148.5
}
```

### 문제: centerAlign이 작동하지 않음

**원인:** x 좌표가 중앙이 아님

**해결:**
```json
{
  "groom": {
    "x": 167.5,           // baseSize.width / 2 = 335 / 2
    "centerAlign": true,  // 필수!
    "align": "center"
  }
}
```

### 문제: 빌드 에러 (타입 에러)

**원인:** 타입 정의 누락

**해결:**
1. `types/wedding.ts`에 필드 추가
2. `types/server-driven-ui/schema.ts`에 Component 타입 추가

---

## 📚 참고 자료

- [SDUI_ARCHITECTURE.md](./SDUI_ARCHITECTURE.md) - SDUI 아키텍처 상세 가이드
- [lib/layout-utils.ts](../lib/layout-utils.ts) - renderLayoutElement 함수
- [lib/server-driven-ui/renderer.tsx](../lib/server-driven-ui/renderer.tsx) - 렌더러 구현

---

**버전 히스토리:**
- v3.0.0 (2025-01-27) - SDUI 아키텍처 기반 최신 가이드
- v2.0.0 (2025-01-24) - wedding-card-005 추가
- v1.0.0 (2025-01-20) - 최초 작성
