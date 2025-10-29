# 🎴 Wedding Card Template Development Guide

이 프로젝트의 새로운 템플릿 개발을 위한 완벽 가이드입니다.

## 📋 목차
- [⚠️ 필수 주의사항](#️-필수-주의사항)
  - [좌표 시스템 변환 필수 (bgOffset)](#-좌표-시스템-변환-필수-bgoffset)
  - [SDUI 아키텍처 필수 사용](#️-sdui-아키텍처-필수-사용)
- [템플릿 구조 개요](#템플릿-구조-개요)
- [SDUI 템플릿 개발 방법](#sdui-템플릿-개발-방법)
- [단계별 템플릿 개발 프로세스](#단계별-템플릿-개발-프로세스)
- [체크리스트](#체크리스트)

---

## ⚠️ 필수 주의사항

### 🚨 좌표 시스템 변환 필수 (bgOffset)

**모든 Figma 좌표는 반드시 BG(배경) 기준 상대 좌표로 변환해야 합니다!**

#### 잘못된 예시: wedding-card-005 초기 버전
팀원이 작성한 wedding-card-005의 JSON은 Figma 캔버스 절대 좌표를 그대로 사용하여 모든 요소가 잘못된 위치에 렌더링되었습니다.

```json
// ❌ 잘못된 예시 - Figma 캔버스 절대 좌표
{
  "background": { "x": 21, "y": 148.5 },
  "groom": { "x": 188.5, "y": 336.9375 },
  "bride": { "x": 188.5, "y": 431.0625 }
}
```

#### 올바른 예시: BG 오프셋 빼기
```json
// ✅ 올바른 예시 - BG 기준 상대 좌표 (bgOffsetX=21, bgOffsetY=148.5를 뺀 값)
{
  "background": { "x": 0, "y": 0 },
  "groom": { "x": 167.5, "y": 188.4375 },     // 188.5-21, 336.9375-148.5
  "bride": { "x": 167.5, "y": 282.5625 }      // 188.5-21, 431.0625-148.5
}
```

#### 변환 공식
```typescript
// 1. Figma 메타데이터에서 BG 좌표 확인
<rounded-rectangle id="2:2" name="BG" x="21" y="148.5" />

// 2. bgOffset 값 설정
const bgOffsetX = 21
const bgOffsetY = 148.5

// 3. 모든 요소의 좌표에서 bgOffset 빼기
JSON에서 모든 x 좌표 → x - bgOffsetX
JSON에서 모든 y 좌표 → y - bgOffsetY
```

**⚠️ 이 단계를 빠뜨리면 모든 요소가 엉뚱한 위치에 표시됩니다!**

---

### 🏗️ SDUI 아키텍처 필수 사용

**2025년 10월 27일부터 모든 새 템플릿은 SDUI 패턴을 사용해야 합니다.**

#### ❌ 더 이상 사용 금지: Hardcoded 방식
```typescript
// ❌ Deprecated - 하드코딩된 pxToPercent 방식
const pxToPercent = (canvasPx: number, canvasOffset: number, base: number) =>
  `${((canvasPx - canvasOffset) / base) * 100}%`

<p style={{
  left: pxToPercent(188.5, bgOffsetX, baseWidth),
  top: pxToPercent(336.9375, bgOffsetY, baseHeight)
}}>
  {data.groom}
</p>
```

#### ✅ 필수 사용: SDUI 방식
```typescript
// ✅ Required - renderLayoutElement 사용
import { renderLayoutElement } from '@/lib/layout-utils'

export function WeddingCardXXX({ data, layout, className, style }) {
  if (!layout) {
    return <div>Layout이 필요합니다</div>
  }

  const { baseSize } = layout

  return (
    <div>
      {/* JSON layout으로 동적 렌더링 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}
    </div>
  )
}
```

#### SDUI 패턴 필수 요소
1. **`layout` prop 받기**: 컴포넌트는 반드시 `layout` prop을 받아야 함
2. **`renderLayoutElement` 사용**: 모든 요소는 이 함수로 스타일 생성
3. **JSON 기반 렌더링**: 하드코딩된 좌표/스타일 사용 금지
4. **동적 요소 렌더링**: `layout.elementName &&` 조건부 렌더링

#### 왜 SDUI를 사용해야 하는가?
- ✅ **유지보수성**: JSON만 수정하면 레이아웃 변경 가능
- ✅ **일관성**: 모든 템플릿이 동일한 렌더링 로직 사용
- ✅ **확장성**: 새로운 템플릿 추가 시 빠른 개발
- ✅ **타입 안정성**: TypeScript로 완벽한 타입 체크
- ✅ **Server-Driven**: 서버에서 JSON만 내려주면 클라이언트가 자동 렌더링

**⚠️ Hardcoded 방식으로 PR을 제출하면 승인되지 않습니다!**

---

## 템플릿 구조 개요

### 프로젝트 파일 구조
```
envelope-card-animation/
├── components/cards/
│   ├── WeddingCard.tsx        # 템플릿 001 (SDUI)
│   ├── WeddingCard002.tsx     # 템플릿 002 (SDUI)
│   ├── WeddingCard003.tsx     # 템플릿 003 (SDUI)
│   ├── WeddingCard004.tsx     # 템플릿 004 (SDUI)
│   └── WeddingCard005.tsx     # 템플릿 005 (SDUI) ← 최신 예시
├── types/
│   ├── server-driven-ui/
│   │   └── schema.ts          # SDUI 타입 정의
│   └── wedding.ts             # 데이터 타입 정의
├── lib/
│   ├── layout-utils.ts        # renderLayoutElement 유틸리티
│   └── server-driven-ui/
│       └── renderer.tsx       # SDUI 렌더러
├── public/templates/
│   ├── wedding-card-001.json  # 템플릿 001 JSON 스키마
│   ├── wedding-card-002.json  # 템플릿 002 JSON 스키마
│   ├── wedding-card-003.json  # 템플릿 003 JSON 스키마
│   ├── wedding-card-004.json  # 템플릿 004 JSON 스키마
│   └── wedding-card-005.json  # 템플릿 005 JSON 스키마
└── app/templates/[id]/
    └── page.tsx               # 템플릿 라우트
```

---

## SDUI 템플릿 개발 방법

### 필요한 파일
1. `components/cards/WeddingCardXXX.tsx` - SDUI 컴포넌트
2. `public/templates/wedding-card-xxx.json` - JSON 레이아웃 스키마
3. `types/server-driven-ui/schema.ts` - TypeScript 타입 정의
4. `lib/server-driven-ui/renderer.tsx` - 렌더러 함수 등록

### 컴포넌트 구현 예시

```typescript
// components/cards/WeddingCard005.tsx
import type { WeddingData } from '@/types/wedding'
import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCard005Props {
  data: WeddingData
  layout?: any  // JSON layout 객체
  className?: string
  style?: React.CSSProperties
}

export function WeddingCard005({
  data,
  layout,
  className,
  style
}: WeddingCard005Props) {
  // Layout이 없으면 에러 메시지 표시
  if (!layout) {
    return (
      <div style={{...style, padding: '20px', backgroundColor: '#fff'}}>
        Layout이 필요합니다
      </div>
    )
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
      {/* 배경 이미지 - 조건부 렌더링 */}
      {data.backgroundImage && layout.background && (
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: layout.background.zIndex || 0
        }}>
          <img
            src={data.backgroundImage}
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* 신랑 이름 - renderLayoutElement 사용 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, data)}>
          {data.groom}
        </p>
      )}

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, data)}>
          {data.bride}
        </p>
      )}

      {/* 날짜 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, data)}>
          {data.date}
        </p>
      )}

      {/* 장소 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, data)}>
          {data.venue}
        </p>
      )}
    </div>
  )
}
```

### renderLayoutElement 함수 참고

```typescript
// lib/layout-utils.ts에 구현되어 있음

export function renderLayoutElement(
  key: string,
  element: any,
  baseSize: BaseSize,
  data: Record<string, any>
): React.CSSProperties {
  const pxToPercent = (px: number, base: number) => `${(px / base) * 100}%`

  const style: React.CSSProperties = {
    position: 'absolute',
    left: pxToPercent(element.x, baseSize.width),
    top: pxToPercent(element.y, baseSize.height),
    zIndex: element.zIndex || 0,
    margin: 0
  }

  // width 처리 (auto 지원)
  if (element.width !== undefined) {
    style.width = element.width === 'auto'
      ? 'auto'
      : pxToPercent(element.width, baseSize.width)
  }

  // 텍스트 요소 스타일링
  if (element.type === 'text') {
    style.fontFamily = element.fontFamily || "'NanumMyeongjo', serif"
    style.fontSize = `${element.fontSize || 16}px`
    style.fontWeight = element.fontWeight || 400
    style.color = element.color || '#333333'
    style.textAlign = element.align || 'center'

    if (element.centerAlign) {
      style.transform = 'translateX(-50%)'
    }
  }

  return style
}
```

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

**⚠️ 필수: SDUI 패턴 사용**

```typescript
// ✅ WeddingCard005.tsx를 참고하세요 (SDUI 패턴)
import { renderLayoutElement } from '@/lib/layout-utils'

export function WeddingCardXXX({ data, layout, className, style }) {
  if (!layout) {
    return <div style={{...style, padding: '20px'}}>Layout이 필요합니다</div>
  }

  const { baseSize } = layout

  return (
    <div className={className} style={{...style, position: 'relative', width: '100%', height: '100%'}}>
      {/* 배경 이미지 */}
      {data.backgroundImage && layout.background && (
        <div style={{position: 'absolute', inset: 0, zIndex: layout.background.zIndex || 0}}>
          <img src={data.backgroundImage} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
      )}

      {/* 모든 요소는 renderLayoutElement 사용 */}
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

      {/* ... 나머지 요소들도 동일한 패턴 */}
    </div>
  )
}
```

**참고 파일:**
- ✅ `/components/cards/WeddingCard005.tsx` - 완벽한 SDUI 패턴 예시
- ✅ `/lib/layout-utils.ts` - renderLayoutElement 함수
- ✅ `/public/templates/wedding-card-005.json` - JSON 레이아웃 스키마

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
    },
    "groom": {
      "type": "text",
      "x": 24,
      "y": 395,
      "width": "auto",
      "fontSize": 20,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333",
      "zIndex": 2,
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

  // ⚠️ 중요: layout prop 전달 필수
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
- ✅ **모든 템플릿 자동 로드**: wedding-card-001 ~ 005 자동 로딩
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
- [ ] ⚠️ **필수**: SDUI 패턴 사용 (Hardcoded 방식 금지)
- [ ] ⚠️ **필수**: Figma MCP로 메타데이터 확인
- [ ] ⚠️ **필수**: BG 오프셋 계산 및 JSON 좌표 변환
  - [ ] Figma 메타데이터에서 BG의 x, y 좌표 확인
  - [ ] bgOffsetX, bgOffsetY 값 기록
  - [ ] JSON의 **모든 x 좌표에서 bgOffsetX 빼기**
  - [ ] JSON의 **모든 y 좌표에서 bgOffsetY 빼기**
  - [ ] 변환 후 좌표가 BG 기준 상대 좌표인지 검증
- [ ] 컴포넌트 생성 (WeddingCardXXX.tsx)
  - [ ] `layout` prop 받기 (필수)
  - [ ] `renderLayoutElement` import 및 사용
  - [ ] 모든 요소 동적 렌더링 (`layout.elementName &&` 패턴)
  - [ ] WeddingCard005.tsx 참고
- [ ] JSON 스키마 생성
- [ ] ⚠️ 중요: Layout의 모든 요소에 `type` 필드 추가
  - [ ] text 타입: groom, bride, date, venue 등
  - [ ] image 타입: photo, decoration, background 등
  - [ ] vector 타입: SVG 아이콘, 구분선 등
- [ ] ⚠️ 중요: Layout의 모든 요소에 `editable` 필드 추가 (true/false)
- [ ] 렌더러 등록 (renderer.tsx)
  - [ ] `layout` prop 전달 확인
  - [ ] resolveJSONPath로 layout 가져오기
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

### 문제: Layout prop이 컴포넌트에 전달되지 않음

**해결:**
```typescript
// renderer.tsx에서 layout prop 전달 확인
function renderWeddingCardTemplate003(...) {
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard003
      data={weddingData}
      layout={layout}  // ← 필수!
      style={style}
      className={className}
    />
  )
}
```

---

## 📚 참고 자료

- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - Figma 디자인 가이드
- [API_SPEC.md](./API_SPEC.md) - API 명세서
- [lib/layout-utils.ts](./lib/layout-utils.ts) - renderLayoutElement 함수
- [components/cards/WeddingCard005.tsx](./components/cards/WeddingCard005.tsx) - 최신 SDUI 예시
- [public/templates/wedding-card-005.json](./public/templates/wedding-card-005.json) - JSON 스키마 예시

---

**💡 팁:** 처음 템플릿을 만들 때는 wedding-card-005를 복사해서 시작하는 것을 권장합니다. 최신 SDUI 패턴과 renderLayoutElement 사용법이 모두 구현되어 있어 개발 속도가 빠릅니다.
