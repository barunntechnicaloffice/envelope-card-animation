# 📝 Font System Guide

프로젝트에서 사용하는 폰트 시스템 가이드입니다.

---

## 🎨 사용 가능한 폰트 (5종)

### 1. **Pretendard (프리텐다드)**
- **웨이트**: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **용도**: 본문, UI 텍스트, 현대적인 디자인
- **특징**: 가독성이 좋은 산세리프 폰트
- **우선순위**: Regular(400), Medium(500), SemiBold(600), Bold(700)

**CSS 사용법:**
```css
font-family: 'Pretendard', sans-serif;
font-weight: 400; /* 또는 500, 600, 700 */
```

---

### 2. **Nanum Myeongjo (나눔명조)**
- **웨이트**: 400, 700, 800
- **용도**: 전통적인 청첩장, 격식 있는 문서
- **특징**: 세리프 폰트, 우아하고 고급스러운 느낌

**CSS 사용법:**
```css
font-family: 'Nanum Myeongjo', serif;
font-weight: 400; /* 또는 700 */
```

**템플릿 사용 예시:**
- wedding-card-001 ~ 011: 신랑/신부 이름, 날짜, 장소

---

### 3. **NanumSquareNeo (나눔스퀘어네오)**
- **웨이트**: 300, 400, 700, 800, 900
- **용도**: 모던한 디자인, UI 요소, 헤더
- **특징**: 각진 산세리프 폰트, 깔끔하고 모던한 느낌

**CSS 사용법:**
```css
font-family: 'NanumSquareNeo', sans-serif;
font-weight: 400; /* 또는 700 */
```

---

### 4. **Gowun Batang (고운바탕)**
- **웨이트**: 400, 700
- **용도**: 전통적인 문서, 서예 느낌의 디자인
- **특징**: 명조 계열 폰트, 손글씨 느낌

**CSS 사용법:**
```css
font-family: 'Gowun Batang', serif;
font-weight: 400; /* 또는 700 */
```

---

### 5. **Nanum Slow (나눔손글씨 느릿느릿체)** ⭐
- **웨이트**: 400
- **용도**: 손글씨 느낌이 필요한 디자인, 캐주얼한 청첩장
- **특징**: 손글씨 스타일, 부드럽고 따뜻한 느낌
- **⚠️ 중요**: Figma에서 **"Nanum_NeuRisNeuRisCe:Regular"** 또는 **"Nanum NeuRis NeuRisCe"**로 표시됨

**CSS 사용법:**
```css
font-family: 'Nanum Slow', cursive;
font-weight: 400;
```

**템플릿 사용 예시:**
- wedding-card-012 (노란 봄 스케치): 신랑/신부 이름, 구분자

---

## 🌐 CDN 주소

모든 폰트는 CDN을 통해 제공됩니다:

```
https://bdc-backoffice-frontend.barunsoncard.com/_static/bdc/server/fonts/
```

**예시:**
```css
url('https://bdc-backoffice-frontend.barunsoncard.com/_static/bdc/server/fonts/Pretendard-Regular.woff2')
url('https://bdc-backoffice-frontend.barunsoncard.com/_static/bdc/server/fonts/NanumSlow.woff2')
```

---

## 🔍 Figma 폰트 매핑

| Figma 폰트명 | CSS font-family | 파일명 |
|---|---|---|
| Pretendard | 'Pretendard', sans-serif | Pretendard-*.woff2 |
| Nanum Myeongjo | 'Nanum Myeongjo', serif | NanumMyeongjo-*.woff2 |
| NanumSquareNeo | 'NanumSquareNeo', sans-serif | NanumSquareNeo-*.woff2 |
| Gowun Batang | 'Gowun Batang', serif | GowunBatang-*.woff2 |
| **Nanum_NeuRisNeuRisCe** ⭐ | **'Nanum Slow', cursive** | **NanumSlow.woff2** |
| **Nanum NeuRis NeuRisCe** | **'Nanum Slow', cursive** | **NanumSlow.woff2** |

---

## 📋 CDN 파일 목록

### Pretendard (9 weights)
```
Pretendard-Thin.woff2 (100)
Pretendard-ExtraLight.woff2 (200)
Pretendard-Light.woff2 (300)
Pretendard-Regular.woff2 (400) ⭐
Pretendard-Medium.woff2 (500) ⭐
Pretendard-SemiBold.woff2 (600) ⭐
Pretendard-Bold.woff2 (700) ⭐
Pretendard-ExtraBold.woff2 (800)
Pretendard-Black.woff2 (900)
```

### Nanum Myeongjo (3 weights)
```
NanumMyeongjo-Regular.woff2 (400)
NanumMyeongjo-Bold.woff2 (700)
NanumMyeongjo-ExtraBold.woff2 (800)
```

### NanumSquareNeo (5 weights)
```
NanumSquareNeo-light.woff2 (300)
NanumSquareNeo-regular.woff2 (400)
NanumSquareNeo-bold.woff2 (700)
NanumSquareNeo-extraBold.woff2 (800)
NanumSquareNeo-heavy.woff2 (900)
```

### Gowun Batang (2 weights)
```
GowunBatang-Regular.woff2 (400)
GowunBatang-Bold.woff2 (700)
```

### Nanum Slow (1 weight)
```
NanumSlow.woff2 (400)
```

---

## 💡 사용 예시

### React/TypeScript 컴포넌트

```typescript
// wedding-card-012 (노란 봄 스케치)
<p style={{
  fontFamily: "'Nanum Slow', cursive",
  fontSize: '35px',
  fontWeight: 400,
  color: '#333333',
  letterSpacing: '-0.553px'
}}>
  이 준 서
</p>
```

### JSON Schema

```json
{
  "groom": {
    "type": "text",
    "fontSize": 35,
    "fontFamily": "'Nanum Slow', cursive",
    "fontWeight": 400,
    "color": "#333333",
    "letterSpacing": -0.553
  }
}
```

---

## 🎯 템플릿별 폰트 가이드

### Wedding Card 001~011
- **Primary**: `'Nanum Myeongjo', serif`
- **용도**: 신랑/신부 이름, 날짜, 장소
- **이유**: 전통적이고 격식 있는 청첩장 느낌

### Wedding Card 012 (노란 봄 스케치) ⭐
- **Primary**: `'Nanum Slow', cursive`
- **용도**: 신랑/신부 이름, 구분자
- **이유**: 따뜻하고 부드러운 봄날의 손글씨 느낌
- **Figma**: "Nanum_NeuRisNeuRisCe:Regular"

---

## ⚠️ 주요 주의사항

### 1. Figma 폰트 이름 변환 ⭐

**Figma에서 다음과 같이 표시되는 폰트:**
- `"Nanum_NeuRisNeuRisCe:Regular"`
- `"Nanum NeuRis NeuRisCe"`
- `"font-family: 'Nanum_NeuRisNeuRisCe'"`

**실제로는 "나눔손글씨 느릿느릿체"이며, CSS에서는 다음과 같이 사용:**
```css
font-family: 'Nanum Slow', cursive;
```

### 2. 폰트 로딩 최적화
- woff2 형식 우선 사용 (더 작은 파일 크기)
- woff는 폴백용으로 제공
- `font-display: swap` 적용 (FOUT 방지)

### 3. 폰트 웨이트 통일
프로젝트 전체에서 일관된 폰트 웨이트 사용:
- Thin: 100
- ExtraLight: 200
- Light: 300
- **Regular: 400** (기본)
- **Medium: 500** (우선순위)
- **SemiBold: 600** (우선순위)
- **Bold: 700** (우선순위)
- ExtraBold: 800
- Black/Heavy: 900

### 4. 폰트 파일명 규칙
- CDN의 나눔 느릿느릿체: `NanumSlow.ttf` → `NanumSlow.woff2`로 변환됨
- 한글 파일명 사용 불가로 인한 변경

---

## 🔧 globals.css 적용

모든 폰트는 [app/globals.css](app/globals.css)에 `@font-face`로 등록되어 있습니다.

```css
/* Nanum Slow (나눔손글씨 느릿느릿체) */
@font-face {
  font-family: 'Nanum Slow';
  font-weight: 400;
  font-display: swap;
  src: url('https://bdc-backoffice-frontend.barunsoncard.com/_static/bdc/server/fonts/NanumSlow.woff2') format('woff2'),
       url('https://bdc-backoffice-frontend.barunsoncard.com/_static/bdc/server/fonts/NanumSlow.woff') format('woff');
}
```

---

## 📚 참고 문서

- [CLAUDE.md](./CLAUDE.md) - 템플릿 개발 가이드
- [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) - 템플릿 워크플로우
- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - Figma 디자인 규칙
- [app/globals.css](./app/globals.css) - 폰트 등록 파일

---

## 📞 문의 및 변경 사항

- **폰트 추가 요청**: Slack #템플릿-개발 채널
- **CDN 업데이트**: @Felix Cho
- **디자인 확인**: @hyunyu jeong, @Hyunjin Lee
- **개발 문의**: @Yujin Kim

---

**마지막 업데이트**: 2025-11-24
**작성자**: Claude AI
**CDN 관리**: Felix Cho
**디자인 가이드**: hyunyu jeong, Hyunjin Lee
