# Figma MCP 반응형 변환 가이드

## 🎯 목적
Figma MCP에서 추출한 디자인을 **반응형**으로 정확하게 변환하기 위한 가이드

---

## 📐 기준 프레임
- **청첩장 카드**: `320px × 580px` (width × height)
- **기준 비율**: 1 : 1.8125

---

## 🔄 변환 규칙

### 1. **위치(Position) → 백분율 변환**

⚠️ **중요**: Figma MCP는 **절대 위치**를 반환합니다. 컨테이너 기준 **상대 위치**로 변환해야 합니다!

#### Figma Metadata 분석
```xml
<frame id="2072:67067" name="Group 10432" x="28" y="120" width="320" height="580">
  <text id="2072:67069" name="이 준 서" x="72.45" y="573.83" />
</frame>
```
- **컨테이너 시작점**: `y="120"`
- **요소 절대 위치**: `y="573.83"`
- **상대 위치**: `573.83 - 120 = 453.83px` ✅

#### Before (MCP 원본 - 절대 픽셀)
```tsx
left: '71.91px',   // 절대 위치
top: '282.06px'    // 절대 위치
```

#### After (반응형 - 상대 백분율)
```tsx
left: '22.47%',    // 71.91 / 320 = 0.2247
top: '27.94%',     // (282.06 - 120) / 580 = 162.06 / 580 = 0.2794 ✅
```

**계산 공식:**
```
⚠️ 컨테이너 기준점 확인 필요!

left% = (left_px / container_width) * 100
right% = (right_px / container_width) * 100
top% = ((top_px - container_y) / container_height) * 100  // 상대 위치!
bottom% = ((bottom_px - container_y) / container_height) * 100
```

**실제 예시:**
```
컨테이너: y="120", height="580"
신랑 이름: y="573.83"

❌ 잘못된 계산: 573.83 / 580 = 98.94% (카드 밖으로!)
✅ 올바른 계산: (573.83 - 120) / 580 = 78.25%
```

---

### 2. **크기(Size) → 백분율 변환**

#### Before (MCP 원본)
```tsx
width: '233.076px',
height: '257.502px'
```

#### After (반응형)
```tsx
width: '72.84%',  // 233.076 / 320 = 0.7284
height: '44.4%',  // 257.502 / 580 = 0.444
```

**계산 공식:**
```
width% = (width_px / 320) * 100
height% = (height_px / 580) * 100
```

---

### 3. **Font Size → clamp() 사용**

반응형 폰트는 `clamp(최소, 가변, 최대)` 사용:

```tsx
// 20px 기준
fontSize: 'clamp(16px, 6.25vw, 20px)'
// 최소 16px, 기본 6.25vw(320px 기준 20px), 최대 20px

// 12px 기준
fontSize: 'clamp(10px, 3.75vw, 12px)'
```

**계산 공식:**
```
기본vw = (원본px / 320) * 100
예: 20px → (20 / 320) * 100 = 6.25vw
예: 12px → (12 / 320) * 100 = 3.75vw
```

---

## 🛠️ MCP 코드 변환 체크리스트

### ✅ 변환 전 확인사항
- [ ] Figma 프레임 크기 확인 (320x580 기준)
- [ ] Auto Layout 설정 여부 확인
- [ ] Constraints 설정 확인

### ✅ 변환 작업
1. [ ] **절대 픽셀(px) → 백분율(%) 변환**
   - `left`, `right`, `top`, `bottom`
   - `width`, `height`

2. [ ] **Font Size → clamp() 변환**
   - 고정 크기 → `clamp(최소, 가변vw, 최대)`

3. [ ] **이미지 처리**
   - `objectFit: 'cover'` (사진)
   - `objectFit: 'contain'` (아이콘/장식)

4. [ ] **중앙 정렬 요소**
   - `left: '50%'` + `transform: 'translateX(-50%)'`

---

## 📊 변환 예시

### 사진 컨테이너
```tsx
// ❌ Before (고정)
<div style={{
  left: '71.91px',
  top: '282.06px',
  width: '233.076px',
  height: '257.502px'
}}>

// ✅ After (반응형)
<div style={{
  left: '22.47%',   // 71.91 / 320
  top: '48.63%',    // 282.06 / 580
  width: '72.84%',  // 233.076 / 320
  height: '44.4%'   // 257.502 / 580
}}>
```

### 텍스트 요소
```tsx
// ❌ Before (고정)
<p style={{
  left: '72.45px',
  top: '573.83px',
  fontSize: '20px'
}}>

// ✅ After (반응형)
<p style={{
  left: '22.64%',  // 72.45 / 320
  top: '98.94%',   // 573.83 / 580
  fontSize: 'clamp(16px, 6.25vw, 20px)'
}}>
```

---

## 🎨 Figma 설정 권장사항

### 1. **Auto Layout 사용**
- Stack 방향: Vertical/Horizontal
- Padding: Fixed/Auto
- Item spacing: Fixed

### 2. **Constraints 설정**
- 좌우: `Left & Right` (양쪽 고정)
- 상하: `Top & Bottom` (양쪽 고정)
- Center 요소: `Center`

### 3. **Responsive Resize**
- 프레임: `Hug contents` 또는 `Fill container`
- 텍스트: `Auto width` 또는 `Fixed`

---

## 🚀 자동화 스크립트 (향후 개선)

```javascript
// Figma 픽셀 → 백분율 변환 헬퍼
function convertToResponsive(px, base) {
  return `${((px / base) * 100).toFixed(2)}%`
}

// 사용 예시
const left = convertToResponsive(71.91, 320)  // '22.47%'
const top = convertToResponsive(282.06, 580)  // '48.63%'
```

---

## 📝 체크리스트 템플릿

프로젝트에 새 Figma 디자인 적용 시:

```markdown
- [ ] Figma 프레임 크기: ___px × ___px
- [ ] 기준 비율 계산: width / height = ___
- [ ] 위치 값 변환 (px → %)
- [ ] 크기 값 변환 (px → %)
- [ ] Font Size clamp 적용
- [ ] 반응형 테스트 (320px ~ 1920px)
- [ ] 모바일 Safari 테스트
- [ ] 데스크톱 Chrome 테스트
```

---

## 🔗 참고 자료

- [CSS clamp() - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Figma Auto Layout](https://help.figma.com/hc/en-us/articles/360040451373)
- [Responsive Design Best Practices](https://web.dev/responsive-web-design-basics/)
