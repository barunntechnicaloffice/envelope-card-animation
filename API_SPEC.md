# 📋 Envelope Card Animation - Backend API Specification

## 개요

이 문서는 **템플릿 개발 도구**에서 생성한 템플릿을 백엔드에 저장하고, **하객뷰 프로젝트**에서 이를 불러와 렌더링하기 위한 백엔드 API 요구사항을 정의합니다.

## 🎯 프로젝트 플로우

```
1. [템플릿 개발 도구 - 이 프로젝트]
   ↓ Figma MCP로 디자인 가져오기
   ↓ 실시간 미리보기하면서 템플릿 개발
   ↓ JSON 스키마로 변환 (Server-Driven UI 형태)
   ↓ 어드민에서 "저장" 버튼 클릭

2. [백엔드 API]
   ↓ POST /api/templates (템플릿 JSON + 이미지 저장)
   ↓ GET /api/templates/{id} (저장된 템플릿 제공)

3. [하객뷰 프로젝트 - 실제 서비스]
   ↓ GET /api/templates/{id} 호출
   ↓ Server-Driven UI 렌더러가 JSON 파싱
   ↓ 사용자에게 청첩장 렌더링
```

## 🎯 핵심 개념

### Server-Driven UI
- 템플릿 개발 도구에서 생성한 **JSON 스키마**를 백엔드에 저장
- 하객뷰 프로젝트가 백엔드에서 JSON을 불러와 렌더링
- 디자인 변경 시 **앱 배포 없이** 백엔드에서 JSON만 수정

### JSONPath 데이터 바인딩
```json
{
  "data": {
    "wedding": {
      "groom": "이준서",
      "bride": "김은재"
    }
  },
  "components": [{
    "type": "text",
    "content": "$.data.wedding.groom"  // JSONPath로 데이터 참조
  }]
}
```

---

## 📡 API Endpoints

> **중요**: 이 API는 템플릿 개발 도구와 하객뷰 프로젝트 간 템플릿 데이터를 주고받기 위한 API입니다.
> 사용자별 카드 생성 API(`POST /api/cards`)는 하객뷰 프로젝트의 책임입니다.

### 1. 템플릿 생성/저장 (어드민 전용)

```
POST /api/templates
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json
```

**Request:**
```json
{
  "id": "wedding-card-001",
  "version": "2.0.0",
  "name": "웨딩 청첩장 템플릿 001 (절대 픽셀 레이아웃)",
  "description": "Figma 2072:68405 기반, 절대 픽셀 레이아웃 시스템",
  "metadata": {
    "title": "결혼식 초대장",
    "description": "이준서 ❤️ 김은재의 결혼식에 초대합니다",
    "category": "wedding",
    "figmaNodeId": "2072:68405"
  },
  "layout": {
    "baseSize": {
      "width": 335,
      "height": 515
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
    }
    // ... 나머지 레이아웃 정의
  },
  "data": {
    "wedding": {
      "groom": "이 준 서",
      "bride": "김 은 재",
      "date": "2038년 10월 12일 토요일 오후 2시",
      "venue": "메종 드 프리미어 그랜드홀",
      "photo": "https://cdn.example.com/photos/sample.jpg",
      "backgroundImage": "https://cdn.example.com/backgrounds/wedding-bg.png",
      "decorationImage": "https://cdn.example.com/decorations/flower.png"
    }
  },
  "components": [
    {
      "id": "wedding-card-main",
      "type": "wedding-card-template-001",
      "data": {
        "groom": "$.data.wedding.groom",
        "bride": "$.data.wedding.bride",
        "date": "$.data.wedding.date",
        "venue": "$.data.wedding.venue",
        "photo": "$.data.wedding.photo",
        "backgroundImage": "$.data.wedding.backgroundImage",
        "decorationImage": "$.data.wedding.decorationImage"
      },
      "layout": "$.layout",
      "style": {
        "width": "335px",
        "height": "515px"
      }
    }
  ]
}
```

**Response:**
```json
{
  "id": "wedding-card-001",
  "version": "2.0.0",
  "message": "Template created successfully",
  "createdAt": "2025-10-17T08:00:00Z"
}
```

---

### 2. 템플릿 목록 조회

```
GET /api/templates
```

**Response:**
```json
{
  "total": 1,
  "templates": [
    {
      "id": "wedding-card-001",
      "name": "웨딩 청첩장 템플릿 001",
      "version": "2.0.0",
      "description": "Figma 2072:68405 기반, 절대 픽셀 레이아웃 시스템",
      "category": "wedding",
      "thumbnail": "https://cdn.example.com/thumbnails/wedding-001.png",
      "createdAt": "2025-10-17T08:00:00Z",
      "updatedAt": "2025-10-17T08:00:00Z"
    }
  ]
}
```

---

### 3. 템플릿 상세 조회

```
GET /api/templates/{templateId}
```

**Response:**
```json
{
  "id": "wedding-card-001",
  "version": "2.0.0",
  "name": "웨딩 청첩장 템플릿 001 (절대 픽셀 레이아웃)",
  "description": "Figma 2072:68405 기반, 절대 픽셀 레이아웃 시스템",
  "metadata": {
    "title": "결혼식 초대장",
    "description": "이준서 ❤️ 김은재의 결혼식에 초대합니다",
    "category": "wedding",
    "thumbnail": "https://cdn.example.com/thumbnails/wedding-001.png",
    "figmaNodeId": "2072:68405"
  },
  "layout": {
    "baseSize": {
      "width": 335,
      "height": 515
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
    }
    // ... 나머지 레이아웃 정의
  },
  "data": {
    "wedding": {
      "groom": "이 준 서",
      "bride": "김 은 재",
      "date": "2038년 10월 12일 토요일 오후 2시",
      "venue": "메종 드 프리미어 그랜드홀",
      "photo": "https://cdn.example.com/photos/sample.jpg",
      "backgroundImage": "https://cdn.example.com/backgrounds/wedding-bg.png",
      "decorationImage": "https://cdn.example.com/decorations/flower.png"
    }
  },
  "components": [
    {
      "id": "wedding-card-main",
      "type": "wedding-card-template-001",
      "data": {
        "groom": "$.data.wedding.groom",
        "bride": "$.data.wedding.bride",
        "date": "$.data.wedding.date",
        "venue": "$.data.wedding.venue",
        "photo": "$.data.wedding.photo",
        "backgroundImage": "$.data.wedding.backgroundImage",
        "decorationImage": "$.data.wedding.decorationImage"
      },
      "layout": "$.layout",
      "style": {
        "width": "335px",
        "height": "515px"
      }
    }
  ]
}
```

---

### 4. 템플릿 수정 (어드민 전용)

```
PATCH /api/templates/{templateId}
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "웨딩 청첩장 템플릿 001 (업데이트)",
  "version": "2.1.0",
  "description": "업데이트된 템플릿",
  "layout": {
    // 수정된 레이아웃
  }
}
```

**Response:**
```json
{
  "id": "wedding-card-001",
  "version": "2.1.0",
  "message": "Template updated successfully",
  "updatedAt": "2025-10-17T08:00:00Z"
}
```

---

### 5. 템플릿 삭제 (어드민 전용)

```
DELETE /api/templates/{templateId}
Authorization: Bearer {ADMIN_TOKEN}
```

**Response:**
```json
{
  "id": "wedding-card-001",
  "message": "Template deleted successfully",
  "deletedAt": "2025-10-17T08:00:00Z"
}
```

---

### 6. 이미지 업로드 (어드민 전용)

```
POST /api/templates/upload
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: multipart/form-data
```

**Request:**
```
file: [binary image data]
type: "photo" | "background" | "decoration" | "thumbnail"
templateId: "wedding-card-001" (optional)
```

**Response:**
```json
{
  "url": "https://cdn.example.com/templates/wedding-card-001/photo_xyz789.jpg",
  "filename": "photo_xyz789.jpg",
  "size": 1048576,
  "mimeType": "image/jpeg",
  "uploadedAt": "2025-10-17T08:00:00Z"
}
```

**사용 예시:**
템플릿 개발 도구에서 이미지를 업로드한 후, 반환된 URL을 템플릿 JSON의 `data.wedding.photo` 등에 사용합니다.

---

## 🔑 데이터 구조 설명

### Template Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | 템플릿 고유 ID |
| version | string | ✅ | 템플릿 버전 (Semantic Versioning) |
| name | string | ✅ | 템플릿 이름 |
| description | string | ❌ | 템플릿 설명 |
| metadata | object | ❌ | 메타데이터 (category, thumbnail 등) |
| layout | object | ✅ | Figma 기반 절대 픽셀 레이아웃 |
| data | object | ✅ | 기본 데이터 (샘플) |
| components | array | ✅ | 렌더링할 컴포넌트 정의 |

### Component Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | 컴포넌트 ID |
| type | string | ✅ | 컴포넌트 타입 (wedding-card-template-001 등) |
| data | object | ✅ | **JSONPath 표현식**으로 데이터 바인딩 |
| layout | string | ❌ | JSONPath로 레이아웃 참조 ($.layout) |
| style | object | ❌ | 인라인 스타일 |

### JSONPath 바인딩 예시

**중요:** `components[].data` 필드는 **JSONPath 표현식**을 사용합니다!

```json
{
  "data": {
    "wedding": {
      "groom": "홍길동"
    }
  },
  "components": [{
    "type": "text",
    "data": {
      "groom": "$.data.wedding.groom"  // ← JSONPath! 실제 값 아님
    }
  }]
}
```

프론트엔드는 이를 다음과 같이 해석합니다:
1. `"$.data.wedding.groom"` → JSONPath 표현식 인식
2. `data.wedding.groom` 에서 실제 값 추출
3. 렌더링: `"홍길동"`

---

## 🎨 이미지 처리

### CDN URL 구조
```
https://cdn.example.com/
  └── templates/                    # 템플릿 전용 이미지
      └── {templateId}/             # 템플릿별 디렉토리
          ├── backgrounds/
          ├── decorations/
          ├── photos/
          └── thumbnails/
```

> **참고**: 사용자가 업로드하는 이미지는 하객뷰 프로젝트에서 처리하며, 여기서는 템플릿 개발용 이미지만 관리합니다.

### 이미지 최적화
- **사진**: 최대 1200px, JPEG 80% 품질
- **배경**: 최대 2000px, PNG/WebP
- **장식**: 투명 PNG, 최대 500px

---

## 🔒 인증 & 권한

### 인증 방식
```
Authorization: Bearer {JWT_TOKEN}
```

### 권한 체크
- **템플릿 생성/수정/삭제**: 어드민 권한 필수 (Bearer Token)
- **템플릿 조회**: 인증 불필요 (하객뷰 프로젝트에서 자유롭게 조회)
- **이미지 업로드**: 어드민 권한 필수

---

## 📊 응답 코드

| Code | Description |
|------|-------------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 (JSON 스키마 오류 등) |
| 401 | 인증 필요 |
| 403 | 권한 없음 |
| 404 | 리소스 없음 |
| 413 | 파일 크기 초과 |
| 500 | 서버 오류 |

---

## 🚀 템플릿 개발 플로우

### 1. 템플릿 개발 도구에서 (이 프로젝트)

1. **Figma 디자인 가져오기**: Figma MCP를 통해 디자인 스펙 추출
2. **템플릿 구현**: React 컴포넌트로 템플릿 개발
3. **실시간 미리보기**: 로컬에서 애니메이션 및 레이아웃 확인
4. **JSON 스키마 추출**: 템플릿을 Server-Driven UI JSON으로 변환
5. **어드민에서 저장**: `POST /api/templates`로 백엔드에 저장

### 2. 하객뷰 프로젝트에서

1. **템플릿 조회**: `GET /api/templates/{templateId}`
2. **JSONPath 파싱**: `components[].data`의 JSONPath 표현식 추출
3. **데이터 바인딩**: 사용자 데이터를 JSONPath로 매핑
4. **컴포넌트 렌더링**: Server-Driven UI 렌더러가 React 컴포넌트로 변환
5. **레이아웃 적용**: Figma 절대 픽셀 좌표로 배치

---

## 💡 백엔드 구현 체크리스트

### 필수 기능
- [ ] 템플릿 CRUD API (POST, GET, PATCH, DELETE)
- [ ] 이미지 업로드 & CDN 연동
- [ ] JSONPath 표현식 검증
- [ ] 템플릿 버전 관리 (Semantic Versioning)
- [ ] 어드민 인증 시스템 (Bearer Token)

### 선택 기능
- [ ] 템플릿 미리보기 이미지 자동 생성
- [ ] 템플릿 복제 기능
- [ ] 템플릿 버전 히스토리 관리
- [ ] 템플릿 검증 (JSON 스키마 유효성)

---

## 📝 예제 시나리오

### 시나리오 1: 템플릿 개발자가 새 템플릿 만들기

```mermaid
sequenceDiagram
    Developer->>Template Tool: Figma MCP로 디자인 가져오기
    Template Tool->>Template Tool: React 컴포넌트 개발
    Developer->>Template Tool: 로컬에서 미리보기 확인
    Developer->>Template Tool: "저장" 버튼 클릭
    Template Tool->>Backend: POST /api/templates (JSON + 이미지)
    Backend-->>Template Tool: 템플릿 저장 완료
    Template Tool->>Developer: 저장 성공 알림
```

### 시나리오 2: 하객뷰 프로젝트에서 템플릿 렌더링

```mermaid
sequenceDiagram
    User->>Guest View: 청첩장 링크 접속
    Guest View->>Backend: GET /api/templates/wedding-card-001
    Backend-->>Guest View: 템플릿 JSON 응답
    Guest View->>Guest View: JSONPath로 데이터 바인딩
    Guest View->>Guest View: Server-Driven UI 렌더링
    Guest View->>User: 카드 애니메이션 표시
```

---

## 🔧 프론트엔드 개발 환경 설정 (템플릿 개발 도구)

### 로컬 개발
```bash
# 템플릿 개발 도구 실행
npm run dev  # http://localhost:3000

# 어드민 기능 개발 시 환경 변수 설정
```

### 환경 변수
```env
# 백엔드 API 엔드포인트
NEXT_PUBLIC_API_BASE_URL=https://api.example.com

# CDN URL (템플릿 이미지)
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.example.com

# 어드민 토큰 (개발 환경)
NEXT_PUBLIC_ADMIN_TOKEN=your_admin_token_here
```

### 어드민 기능 구현 예정
- 템플릿 JSON 추출 버튼
- 백엔드 API로 저장 기능
- 이미지 업로드 기능
- 템플릿 버전 관리 UI

---

## 📚 참고 자료

- [JSONPath Syntax](https://goessner.net/articles/JsonPath/)
- [Server-Driven UI Pattern](https://www.judo.app/blog/server-driven-ui/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

## 📞 문의

템플릿 개발 도구 또는 백엔드 API 구현 관련 문의사항은 Barunn Technical Office에 연락 주세요.

---

## ✅ 요약

이 프로젝트는 **템플릿 개발 도구**이며, 다음과 같은 역할을 합니다:

1. **Figma 디자인을 Server-Driven UI JSON으로 변환**
2. **템플릿을 백엔드 API에 저장** (POST /api/templates)
3. **하객뷰 프로젝트는 저장된 템플릿을 불러와 렌더링** (GET /api/templates/{id})

**이 프로젝트는 사용자 카드 생성 기능을 포함하지 않습니다.** 사용자별 카드 생성은 하객뷰 프로젝트의 책임입니다.
