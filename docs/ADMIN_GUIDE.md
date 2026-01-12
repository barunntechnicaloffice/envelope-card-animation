# Template Admin System Guide

웨딩 카드 템플릿 관리를 위한 어드민 시스템 가이드입니다.

## 목차
- [개요](#개요)
- [시스템 목적](#시스템-목적)
- [페이지 구조](#페이지-구조)
- [새 템플릿 생성 워크플로우](#새-템플릿-생성-워크플로우)
- [API 및 데이터 흐름](#api-및-데이터-흐름)
- [bdc-web 연동](#bdc-web-연동)

---

## 개요

Template Admin은 Figma 디자인에서 JSON 스키마를 자동 생성하여 bdc-web에 등록할 수 있는 웨딩 카드 템플릿 관리 시스템입니다.

**접속 URL:** `http://localhost:3000/admin`

**기술 스택:**
- Next.js 15 + React 19
- Tailwind CSS
- Monaco Editor (JSON 편집기)

---

## 시스템 목적

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Figma      │ ──► │   Admin      │ ──► │   JSON       │ ──► │   bdc-web    │
│   디자인     │     │   시스템     │     │   스키마     │     │   등록       │
│   (Node ID)  │     │              │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
        │                    │                    │
        │                    │                    │
        ▼                    ▼                    ▼
   - Node ID 복사      - 메타데이터 파싱    - wedding-card-XXX.json
   - 템플릿 이름       - 좌표 자동 변환      - layout 정보
   - 템플릿 ID         - JSON 자동 생성      - data 정보
```

**핵심 기능:**
1. **Figma Node ID** 입력
2. **템플릿 이름** 입력 (예: "따뜻한 시선")
3. **템플릿 ID** 입력 (예: "wedding-card-034")
4. **Figma 메타데이터**로 JSON 스키마 자동 생성
5. 생성된 JSON을 **bdc-web에 등록**하여 사용

---

## 페이지 구조

### 1. 대시보드 (`/admin`)
**파일:** `app/admin/page.tsx`

- 전체 템플릿 통계 (총 수, 게시됨, 임시저장)
- 빠른 작업 버튼 (새 템플릿, Figma 가져오기, 목록, 에셋)
- 최근 업데이트된 템플릿 목록
- 개발 가이드 요약

### 2. 템플릿 관리 (`/admin/templates`)
**파일:** `app/admin/templates/page.tsx`

- 전체 템플릿 목록 (그리드 뷰)
- 필터링 (전체/게시됨/임시저장)
- 검색 기능
- 썸네일 미리보기
- SDUI 지원 여부 뱃지

### 3. 새 템플릿 생성 (`/admin/templates/new`)
**파일:** `app/admin/templates/new/page.tsx`

4단계 마법사 형식:
1. **기본 정보** - 템플릿 ID, 이름, 카테고리, Figma Node ID
2. **Figma 메타데이터** - XML 형식의 메타데이터 입력
3. **좌표 확인** - BG 오프셋 자동 감지 및 좌표 변환 확인
4. **JSON 생성** - Monaco Editor로 결과 확인/수정/다운로드

### 4. 템플릿 수정 (`/admin/templates/[id]`)
**파일:** `app/admin/templates/[id]/TemplateEditClient.tsx`

- Monaco Editor로 JSON 직접 편집
- 실시간 JSON 유효성 검사
- 미리보기 (iframe)
- 템플릿 정보 요약

### 5. 에셋 관리 (`/admin/assets`)
**파일:** `app/admin/assets/page.tsx`

- 폴더별 에셋 탐색
- 이미지 미리보기
- 경로 복사 기능

### 6. 설정 (`/admin/settings`)
**파일:** `app/admin/settings/page.tsx`

- Figma API Key 설정
- 템플릿 기본 크기 설정 (335×515px)
- 자동 백업 설정

---

## 새 템플릿 생성 워크플로우

### Step 1: 기본 정보 입력

```
┌─────────────────────────────────────────┐
│  템플릿 ID: wedding-card-051            │
│  템플릿 이름: 따뜻한 시선                │
│  카테고리: 웨딩 (한글 필수!)             │
│  Figma Node ID: 46-1150                 │
└─────────────────────────────────────────┘
```

**주의사항:**
- 카테고리는 반드시 **한글**로 입력 (웨딩, 생일파티, 신년카드)
- 템플릿 ID 형식: `wedding-card-XXX`

### Step 2: Figma 메타데이터 입력

Figma MCP 또는 Dev Mode에서 메타데이터 추출:

```xml
<frame id="46-1150" name="template">
  <rounded-rectangle id="2:2" name="BG" x="21" y="148.5" width="335" height="515" />
  <text id="2:4" name="groom" x="188.5" y="336.9" font-size="20" fill="#333333">신랑</text>
  <text id="2:5" name="bride" x="188.5" y="431.0" font-size="20" fill="#333333">신부</text>
  ...
</frame>
```

**Figma MCP 명령어:**
```javascript
mcp__figma-dev-mode-mcp-server__get_metadata({ nodeId: "46-1150" })
```

### Step 3: 좌표 변환 확인

시스템이 자동으로 BG 요소를 찾아 오프셋을 계산합니다:

```
BG 오프셋: X=21, Y=148.5
Base Size: 335×515px

원본 좌표 → 변환 좌표
(188.5, 336.9) → (167.5, 188.4)
(188.5, 431.0) → (167.5, 282.5)
```

### Step 4: JSON 생성 완료

자동 생성된 JSON 스키마:

```json
{
  "id": "wedding-card-051",
  "version": "1.0.0",
  "name": "따뜻한 시선",
  "category": "웨딩",
  "thumbnail": "/assets/wedding-card-051/card-bg.png",
  "figmaNodeId": "46-1150",
  "set": {
    "envelope": {
      "pattern": "/assets/common/pattern.png",
      "seal": "/assets/common/seal.png"
    },
    "page": {
      "background": "/assets/common/bg.png"
    },
    "cards": {
      "background": "/assets/wedding-card-051/card-bg.png"
    }
  },
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "background": {
      "type": "background",
      "x": 0,
      "y": 0,
      "width": 335,
      "height": 515,
      "zIndex": 0,
      "editable": false
    },
    "groom": {
      "type": "text",
      "x": 167.5,
      "y": 188.4,
      "width": "auto",
      "zIndex": 1,
      "editable": true,
      "fontSize": 20,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333"
    },
    "bride": {
      "type": "text",
      "x": 167.5,
      "y": 282.5,
      "width": "auto",
      "zIndex": 2,
      "editable": true,
      "fontSize": 20,
      "fontFamily": "'NanumMyeongjo', serif",
      "color": "#333333"
    }
  },
  "data": {
    "wedding": {
      "groom": "신랑 이름",
      "bride": "신부 이름",
      "date": "2025년 1월 1일 토요일 오후 2시",
      "venue": "예식장 이름",
      "photo": "/assets/common/photo.png",
      "cardBackground": "/assets/wedding-card-051/card-bg.png"
    }
  },
  "components": [{
    "id": "wedding-card-main",
    "type": "template",
    "data": {
      "groom": "$.data.wedding.groom",
      "bride": "$.data.wedding.bride",
      "date": "$.data.wedding.date",
      "venue": "$.data.wedding.venue",
      "photo": "$.data.wedding.photo",
      "backgroundImage": "$.data.wedding.cardBackground"
    }
  }]
}
```

---

## API 및 데이터 흐름

### 템플릿 로드
```javascript
// 템플릿 JSON 로드
fetch('/templates/wedding-card-XXX.json')
```

### JSON 스키마 구조

```typescript
interface TemplateSchema {
  id: string                    // wedding-card-XXX
  version: string               // 1.0.0
  name: string                  // 템플릿 표시 이름
  category: string              // 웨딩 (한글 필수)
  thumbnail?: string            // 썸네일 이미지 경로
  figmaNodeId?: string          // Figma 노드 ID

  set: {
    envelope: { pattern, seal }
    page: { background }
    cards: { background }
  }

  layout: {
    baseSize: { width, height }
    [elementName]: {
      type: 'text' | 'image' | 'vector' | 'container' | 'background'
      x: number
      y: number
      width: number | 'auto'
      height?: number | 'auto'
      zIndex: number
      editable: boolean
      // 텍스트 전용
      fontSize?: number
      fontFamily?: string
      fontWeight?: number
      color?: string
      align?: string
      letterSpacing?: number
      centerAlign?: boolean
    }
  }

  data: {
    wedding: {
      groom, bride, date, venue, photo, cardBackground, separator?
    }
  }

  components: [{
    id: string
    type: 'template'           // 항상 'template'으로 고정
    data: {
      [key]: JSONPathExpression  // $.data.wedding.xxx
    }
  }]
}
```

---

## bdc-web 연동

### 1. JSON 파일 저장
생성된 JSON을 `public/templates/` 폴더에 저장:
```
public/templates/wedding-card-051.json
```

### 2. 에셋 준비
템플릿에 필요한 이미지를 에셋 폴더에 저장:
```
public/assets/wedding-card-051/
├── card-bg.png        # 카드 배경
├── photo.png          # 샘플 사진 (또는 /assets/common/photo.png 사용)
└── decoration.svg     # 장식 요소 (있는 경우)
```

### 3. bdc-web 등록
bdc-web 시스템에서 해당 템플릿 JSON을 API로 등록하여 사용합니다.

**components[].type 주의사항:**
- bdc-web 호환성을 위해 `type`은 항상 `"template"`으로 고정
- 템플릿 구분은 최상위 `id` 값으로 수행

---

## 파일 구조

```
app/admin/
├── layout.tsx                    # 어드민 레이아웃 (사이드바, 헤더)
├── page.tsx                      # 대시보드
├── templates/
│   ├── page.tsx                  # 템플릿 목록
│   ├── new/
│   │   └── page.tsx              # 새 템플릿 생성 마법사
│   └── [id]/
│       ├── page.tsx              # 템플릿 상세 페이지
│       └── TemplateEditClient.tsx # 클라이언트 컴포넌트 (에디터)
├── assets/
│   └── page.tsx                  # 에셋 관리
└── settings/
    └── page.tsx                  # 설정
```

---

## 주요 기능 요약

| 기능 | 설명 |
|------|------|
| Figma 메타데이터 파싱 | XML 형식의 Figma 메타데이터 자동 파싱 |
| BG 오프셋 자동 계산 | BG 요소 기준 상대 좌표 자동 변환 |
| JSON 스키마 자동 생성 | 템플릿 JSON 자동 생성 |
| Monaco Editor | JSON 실시간 편집 및 검증 |
| 미리보기 | iframe으로 템플릿 실시간 미리보기 |
| 다운로드/복사 | JSON 파일 다운로드 또는 클립보드 복사 |

---

## 향후 개선 사항

- [ ] Figma API 직접 연동 (Node ID만으로 자동 메타데이터 추출)
- [ ] 서버 사이드 JSON 저장 API
- [ ] 템플릿 버전 관리
- [ ] 에셋 업로드 기능
- [ ] bdc-web API 직접 등록 연동

---

## 관련 문서

- [CLAUDE.md](../CLAUDE.md) - 템플릿 개발 가이드
- [DESIGN_GUIDE.md](../DESIGN_GUIDE.md) - Figma 디자인 가이드
- [API_SPEC.md](../API_SPEC.md) - API 명세서
