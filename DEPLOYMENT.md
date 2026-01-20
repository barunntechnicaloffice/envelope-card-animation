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
AWS_CLOUDFRONT_DOMAIN=xxx
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

## 참고

- 인증 로직: bdc-web-server-backoffice 프로젝트 참고
- 환경변수 예시: `.env.example` 파일 참고
