# Type Definition Fixes - 2025-01-27

## 문제 상황

다른 개발자가 SDUI 패턴으로 프로젝트를 업데이트했지만, TypeScript 타입 정의가 실제 구현과 일치하지 않아 빌드 에러가 발생했습니다.

### 에러 내용

```
Property 'cardBackground' does not exist on type 'WeddingData'
Property 'dday' does not exist on type 'WeddingCardTemplate002Component.data'
Property 'title' does not exist on type 'WeddingCardTemplate003Component.data'
Property 'separator' does not exist on type 'WeddingCardTemplate004Component.data'
```

## 수정 내용

### 1. `types/wedding.ts` 업데이트

컴포넌트에서 실제로 사용 중인 필드들을 `WeddingData` 인터페이스에 추가했습니다.

**추가된 필드:**

#### wedding-card-002 전용
- `cardBackground?: string` - 카드 배경 이미지
- `dday?: string` - D-day 표시 (예: "D-100")
- `dateMonth?: string` - 월 (예: "10")
- `dateDay?: string` - 일 (예: "12")
- `dateEnglish?: string` - 영문 날짜 (예: "OCTOBER 12, 2038")
- `dateKorean?: string` - 한글 날짜 (예: "2038년 10월 12일 토요일 오후 2시")
- `groomLabel?: string` - 신랑 라벨 (예: "GROOM")
- `brideLabel?: string` - 신부 라벨 (예: "BRIDE")

#### wedding-card-003 전용
- `title?: string` - 타이틀 (예: "WEDDING INVITATION")

#### wedding-card-004 전용
- `separator?: string` - 구분자 (예: "&")

### 2. `types/server-driven-ui/schema.ts` 업데이트

각 템플릿 컴포넌트 인터페이스에 누락된 필드들을 추가했습니다.

#### WeddingCardTemplate002Component
```typescript
data: {
  // ... 기존 필드
  dday?: JSONPathExpression;
  dateMonth?: JSONPathExpression;
  dateDay?: JSONPathExpression;
  dateEnglish?: JSONPathExpression;
  dateKorean?: JSONPathExpression;
  groomLabel?: JSONPathExpression;
  brideLabel?: JSONPathExpression;
}
```

#### WeddingCardTemplate003Component
```typescript
data: {
  // ... 기존 필드
  title?: JSONPathExpression;
}
```

#### WeddingCardTemplate004Component
```typescript
data: {
  // ... 기존 필드
  separator?: JSONPathExpression;
}
```

## 검증 결과

### 빌드 성공 ✅

```bash
npm run build

✓ Compiled successfully
✓ Generating static pages (11/11)
```

### 생성된 페이지

- `/` - 홈 페이지
- `/templates` - 템플릿 목록
- `/templates/wedding-card-001`
- `/templates/wedding-card-002`
- `/templates/wedding-card-003`
- `/templates/wedding-card-004`
- `/templates/wedding-card-005`
- `/sdui-test` - SDUI 테스트 페이지

## 참고 파일

- `lib/server-driven-ui/renderer.tsx` - 각 템플릿의 렌더링 함수에서 해당 필드들을 사용
- `components/cards/WeddingCard002.tsx` - cardBackground, dday 등 사용
- `components/cards/WeddingCard003.tsx` - title 사용
- `components/cards/WeddingCard004.tsx` - separator 사용
- `public/templates/*.json` - 각 템플릿의 JSON 스키마

## 향후 템플릿 추가 시 주의사항

새로운 템플릿을 추가할 때는 다음 단계를 반드시 따르세요:

1. **컴포넌트 개발** (`components/cards/WeddingCardXXX.tsx`)
2. **JSON 스키마 생성** (`public/templates/wedding-card-xxx.json`)
3. **렌더러 등록** (`lib/server-driven-ui/renderer.tsx`)
4. **타입 정의 추가** (이 부분을 빠뜨리면 빌드 에러!)
   - `types/wedding.ts` - 새로운 데이터 필드 추가
   - `types/server-driven-ui/schema.ts` - 컴포넌트 인터페이스 추가
5. **라우트 등록** (`app/templates/[id]/page.tsx`)

## 관련 문서

- [TEMPLATE_DEVELOPMENT_GUIDE.md](./TEMPLATE_DEVELOPMENT_GUIDE.md) - 전체 개발 가이드
- [SDUI_ARCHITECTURE.md](./SDUI_ARCHITECTURE.md) - SDUI 아키텍처 상세 설명
