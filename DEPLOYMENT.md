# 배포 정보

## 서버 정보

| 항목 | 값 |
|------|-----|
| 도메인 | `card-template-admin.barunsoncard.com` |
| 프로젝트 | https://github.com/barunntechnicaloffice/envelope-card-animation |
| 프레임워크 | Next.js 15 (서버 모드) |

---

## 환경변수

### Google OAuth
```bash
GOOGLE_CLIENT_ID=xxx                      # bdc-web 백오피스와 동일
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxx          # 위와 동일한 값
JWT_SECRET=xxx                            # 최소 32자 이상
ALLOWED_EMAIL_DOMAIN=barun.com            # 로그인 허용 도메인
```

### S3 이미지 업로드
```bash
USE_S3=true
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=xxx
AWS_S3_PREFIX=card-templates              # S3 내 폴더 prefix
AWS_CLOUDFRONT_DOMAIN=xxx                 # CloudFront CDN 도메인 (선택)
```

### bdc-web 백오피스 API 연동
```bash
BDC_WEB_API_URL=https://api.barunsoncard.com  # bdc-web-server-backoffice API URL
BDC_WEB_API_KEY=xxx                            # API 키 (X-API-KEY 헤더에 사용)
```

### Figma API (선택)
```bash
FIGMA_ACCESS_TOKEN=xxx
```

---

## 인증 시스템

### 구조
- Google OAuth 로그인 (bdc-web 백오피스와 동일한 방식)
- JWT 토큰 기반 인증
- 쿠키에 토큰 저장 (`authToken`)

### 보호된 경로
- `/admin/*` - 로그인 필요
- `/` - `/admin`으로 리다이렉트

### 공개 경로
- `/login` - 로그인 페이지
- `/api/auth/*` - 인증 API
- `/templates/*` - 템플릿 미리보기

---

## API 엔드포인트

### 인증
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/verify-google` | Google 로그인 |
| GET | `/api/auth/verify` | 토큰 검증 |
| POST | `/api/auth/logout` | 로그아웃 |

### 템플릿
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/templates` | 템플릿 목록 |
| POST | `/api/templates` | 템플릿 생성 |
| DELETE | `/api/templates/delete` | 템플릿 삭제 |
| POST | `/api/templates/duplicate` | 템플릿 복제 |

### 에셋
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/assets` | 에셋 목록 |
| POST | `/api/assets/upload` | 이미지 업로드 |

---

## Google Cloud Console 설정

배포 후 Google Cloud Console에서 다음 URL 등록 필요:

### 승인된 자바스크립트 원본
```
https://card-template-admin.barunsoncard.com
```

### 승인된 리디렉션 URI
```
https://card-template-admin.barunsoncard.com
```

---

## 로컬 개발

```bash
# 환경변수 설정
cp .env.example .env.local
# .env.local 파일 수정

# 개발 서버 실행
npm run dev
```

로컬에서 Google 로그인 테스트하려면 Google Cloud Console에 `http://localhost:3000` 또는 `http://localhost:3001` 등록 필요

---

## bdc-web 백오피스 API 연동

### 개요
어드민에서 생성한 템플릿 JSON을 bdc-web 백오피스에 API로 등록합니다.
기존에는 JSON을 수동으로 복사해서 붙여넣기 했으나, API 연동으로 자동화합니다.

### API 엔드포인트 (bdc-web-server-backoffice)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/admin/resources/templates` | 템플릿 생성 |
| PUT | `/admin/resources/templates/:id` | 템플릿 수정 |
| DELETE | `/admin/resources/templates/:id` | 템플릿 삭제 |
| GET | `/api/resources/templates` | 템플릿 목록 조회 |
| GET | `/api/resources/templates/:id` | 단일 템플릿 조회 |

### 인증
- `X-API-KEY` 헤더에 API 키 전달
- API 키는 bdc-web-server-backoffice에서 발급

### 템플릿 JSON 스키마

```typescript
interface TemplateEntity {
  id: string           // 템플릿 ID (예: "wedding-card-001")
  version: string      // 버전 (예: "1.0.0")
  name: string         // 이름 (예: "웨딩 청첩장 템플릿 001")
  category: string     // 카테고리 (예: "웨딩")
  thumbnail?: string   // 썸네일 URL
  figmaNodeId?: string // Figma 노드 ID
  layout: {
    baseSize: { width: number, height: number }
    [elementName: string]: LayoutElement
  }
  data: {
    wedding: {
      groom: string
      bride: string
      date: string
      venue: string
      photo: string
      cardBackground?: string
    }
  }
  components: [{
    id: string
    type: "template"   // 항상 "template"
    data: Record<string, string>  // JSONPath 표현식
  }]
  common?: {
    envelope?: {
      pattern?: string
      seal?: string
    }
    background?: string
  }
}
```

### 연동 흐름

1. 어드민에서 템플릿 생성/수정
2. "bdc-web에 등록" 버튼 클릭
3. `POST /admin/resources/templates` API 호출
4. 성공 시 템플릿이 bdc-web 백오피스 DB에 저장됨
5. bdc-web 클라이언트에서 템플릿 사용 가능

### 이미지 URL 처리

- S3 업로드 시: CloudFront CDN URL 사용 (예: `https://cdn.barunsoncard.com/card-templates/...`)
- 로컬 업로드 시: 상대 경로 (예: `/assets/wedding-card-001/...`)
- bdc-web에 등록 시 절대 URL로 변환 필요

---

## 참고

- 인증 로직: bdc-web-server-backoffice 프로젝트 참고
- 환경변수 예시: `.env.example` 파일 참고
- 템플릿 API: `/Users/parkhojoon/Desktop/barun/bdc-web-server-backoffice/backend/src/routes/publicApi/resources.routes.ts`
