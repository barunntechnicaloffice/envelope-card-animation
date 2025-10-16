# Figma 디자인 가이드 (디자이너용)

## 🎯 목적
개발자가 Figma 디자인을 반응형 웹으로 정확하게 구현할 수 있도록 디자인 시 고려사항을 안내합니다.

---

## 📐 기본 원칙

### 1. 프레임 크기는 고정값 사용
- **권장**: 명확한 기준 크기 설정 (예: 335px × 515px)
- **이유**: 개발자가 비율 계산의 기준점으로 사용

### 2. 컨테이너 기준점 명확히
- **Auto Layout** 사용 시 컨테이너의 시작점(x, y)을 명확히 표시
- 개발자는 이 기준점을 기준으로 모든 요소의 상대 위치를 계산합니다

---

## 🔍 반응형 대응 - 텍스트 영역

### ❌ 피해야 할 디자인
```
고정 폭(Fixed Width) 텍스트 컨테이너
├─ width: 177px (고정)
└─ 텍스트가 길어지면 잘림 또는 줄바꿈 실패
```

**문제점**:
- 긴 텍스트 입력 시 레이아웃 깨짐
- 다국어 지원 어려움
- 유지보수 비용 증가

### ✅ 권장하는 디자인

#### 방법 1: Auto Layout + Hug Contents
```
Auto Layout (Horizontal/Vertical)
├─ Width: Hug contents
├─ Padding: 좌우 여백 설정 (예: 10%)
└─ Alignment: Center
```

#### 방법 2: 전체 폭 + 여백
```
텍스트 컨테이너
├─ Width: Fill container (100%)
├─ Padding: 좌우 33px (또는 비율로 10%)
├─ Text Align: Center
└─ Text: Auto width
```

**장점**:
- 텍스트 길이에 관계없이 중앙 정렬 유지
- 자동 줄바꿈 지원
- 반응형 구현 용이

---

## 📋 실제 사례

### 사례: 청첩장 날짜/장소 영역

#### ❌ Before (문제가 있는 디자인)
```
Figma 설정:
- Frame: 335px × 515px
- Text Container: width 177px (52.84%)
- Position: x=87.81 (중앙), y=585.49

문제:
"2038년 10월 12일 토요일 오후 2시" ← 길면 잘림
"메종 드 프리미어 그랜드홀" ← 길면 다음 줄로 안 넘어감
```

#### ✅ After (권장 디자인)
```
Figma 설정:
- Frame: 335px × 515px
- Text Container: width = Fill container
- Padding: 좌 33.5px, 우 33.5px (10%)
- Text Align: Center
- Text: Auto width

결과:
"2038년 10월 12일 토요일 오후 2시"
"메종 드 프리미어 그랜드홀 5층 루비홀 ABC룸"
↑ 긴 텍스트도 자동으로 중앙 정렬 + 줄바꿈
```

---

## 🛠️ Figma 설정 방법

### Step 1: Auto Layout 설정
1. 텍스트 영역 선택
2. `Shift + A` → Auto Layout 활성화
3. Direction: Vertical (위아래 텍스트인 경우)
4. Alignment: Center (horizontal)
5. Padding: 좌우 동일하게 (예: 33px)

### Step 2: Responsive Resize 설정
1. 프레임 선택
2. Constraints 패널에서:
   - **Horizontal**: Left & Right (양쪽 고정)
   - **Vertical**: Top (상단 고정)
3. Resizing:
   - **Width**: Fill container
   - **Height**: Hug contents (내용물에 맞춤)

### Step 3: 텍스트 설정
1. 텍스트 레이어 선택
2. Text 패널에서:
   - **Width**: Auto
   - **Alignment**: Center
   - **Wrap**: Auto (자동 줄바꿈)

---

## 📏 여백 계산 가이드

### 비율 기반 여백 (권장)
```
카드 폭: 335px
좌우 여백 10%씩: 33.5px × 2 = 67px
콘텐츠 영역: 335 - 67 = 268px (80%)
```

### 고정값 여백 (간단한 경우)
```
카드 폭: 335px
좌우 여백: 각 20px
콘텐츠 영역: 295px
```

---

## 🎨 레이아웃 패턴별 가이드

### Pattern 1: 중앙 정렬 텍스트 블록
```
✅ 권장:
- Container: Full width (left=0, right=0)
- Padding: 좌우 동일 (10~15%)
- Text Align: Center

❌ 비권장:
- Container: 고정 폭 (예: 177px)
- Position: left=50%, transform으로 중앙 정렬
```

### Pattern 2: 고정 위치 + 정렬 텍스트 (신랑/신부 이름) ⭐ 중요

이 방법이 **가장 정확하고 유연한** 텍스트 배치 방식입니다!

```
✅ 최적의 방법:
1. 텍스트 컨테이너에 **최대 width 지정**
2. 컨테이너 **위치(x, y) 고정**
3. 텍스트 **align만 변경** (left/center/right)

Figma 설정 예시:
┌─────────────────────────────────┐
│ 카드 (335px)                     │
│                                  │
│  [신랑: 111px]    [신부: 117px] │
│  x=44            x=213          │
│  text-align:     text-align:    │
│  center          center         │
└─────────────────────────────────┘

장점:
✅ 텍스트 길이 변화에 유연 대응
✅ 다국어 지원 (한글, 영어, 한자 등)
✅ 좌/중/우 정렬 자유롭게 선택 가능
✅ 이름이 길어져도 레이아웃 안 깨짐
```

#### 실제 구현 예시

**Figma 설정**:
```
신랑 이름:
- Frame width: 111px (최대 폭)
- Position: x=44, y=543
- Text Align: Center
- Text: "이 준 서"

신부 이름:
- Frame width: 117px (최대 폭)
- Position: x=213, y=543
- Text Align: Center
- Text: "김 은 재"
```

**변환 결과 (CSS)**:
```css
.groom-name {
  position: absolute;
  left: 7.16%;      /* 44 / 335 * 100 */
  top: 76.70%;      /* 395 / 515 * 100 */
  width: 33.13%;    /* 111 / 335 * 100 */
  text-align: center;
}

.bride-name {
  position: absolute;
  left: 57.61%;     /* 213 / 335 * 100 */
  top: 76.70%;      /* 395 / 515 * 100 */
  width: 34.93%;    /* 117 / 335 * 100 */
  text-align: center;
}
```

#### 다양한 케이스 대응

```
케이스 1: 짧은 이름
"홍 길 동" → 111px 컨테이너에서 중앙 정렬 ✅

케이스 2: 긴 이름
"알렉산더 김" → 111px 안에 수용, 중앙 정렬 ✅

케이스 3: 정렬 변경
- text-align: left → 왼쪽 정렬
- text-align: center → 중앙 정렬
- text-align: right → 오른쪽 정렬

케이스 4: 다국어
- 한글: "이 준 서"
- 영어: "Junsu Lee"
- 한자: "李 俊 瑞"
→ 모두 같은 레이아웃으로 대응 가능 ✅
```

#### ❌ 피해야 할 방식

```
❌ 방식 1: 고정 폭 없이 텍스트만
- 문제: 이름 길이에 따라 위치 틀어짐
- "홍 길 동" vs "알렉산더 김" → 다른 위치

❌ 방식 2: right 속성으로 배치
- 문제: 텍스트 길이 변화 시 위치 계산 복잡
- 신부 이름 길어지면 왼쪽으로 밀림

✅ 올바른 방식: width + left + text-align
- 컨테이너 위치 고정
- 텍스트만 내부에서 정렬
- 길이 변화에도 안정적
```

#### 디자이너가 해야 할 것

1. **텍스트 프레임 생성**
   - 예상되는 최대 텍스트 길이 고려
   - 여유 있게 width 설정 (110~120px 권장)

2. **Auto Layout 설정**
   - Direction: Horizontal
   - Padding: 0 (또는 최소)
   - Alignment: Center/Left/Right

3. **테스트**
   - 짧은 이름: "홍 길 동"
   - 긴 이름: "알렉산더 김"
   - 긴 성: "선우 황보 이준서"
   - 모든 케이스에서 정렬 확인

4. **개발자에게 전달**
   - Frame width 값 명시
   - Text alignment 명시
   - 예상 최대 글자 수 공유
```

### Pattern 3: 이미지 영역
```
✅ 권장:
- 사진: objectFit: cover (비율 유지, 꽉 채움)
- 아이콘/장식: objectFit: contain (비율 유지, 여백 허용)
- Position: 백분율 사용
- Size: 백분율 사용
```

---

## 📊 체크리스트

디자인 전달 전 확인사항:

### 필수 확인
- [ ] 프레임 크기 명시 (예: 335px × 515px)
- [ ] Auto Layout 적용 여부 명시
- [ ] 컨테이너 기준점(x, y) 명확히
- [ ] 긴 텍스트 입력 시 레이아웃 테스트

### 텍스트 영역
- [ ] Width: Fill container 또는 Hug contents
- [ ] 좌우 Padding 설정 (고정값 또는 비율)
- [ ] Text Align: Center/Left/Right 명시
- [ ] Text Wrapping: Auto 설정

### 이미지 영역
- [ ] 이미지 비율 유지 방식 명시
- [ ] Position: 백분율로 표시
- [ ] Size: 백분율로 표시

### Constraints
- [ ] 반응형 동작 방식 설정
- [ ] Left & Right / Top & Bottom 등

---

## 💡 개발 인수인계 시 전달사항

### 1. Dev Mode 활성화
- Figma에서 `Dev Mode` 활성화
- 개발자에게 접근 권한 부여

### 2. 명명 규칙
```
✅ 좋은 예:
- "wedding-card-container" (명확한 용도)
- "groom-name" / "bride-name" (역할 표시)
- "date-venue-text" (내용 명시)

❌ 나쁜 예:
- "Group 10432" (자동 생성 이름)
- "Rectangle 45" (의미 없는 이름)
- "Text 1" / "Text 2" (구분 불가)
```

### 3. 에셋 Export
- 이미지는 2x, 3x 해상도 제공
- SVG 가능한 아이콘은 SVG로 제공
- 파일명: kebab-case 사용 (예: `card-bg.png`)

### 4. 컬러/폰트 스타일
- Color Styles 등록
- Text Styles 등록
- 개발자가 변수로 참조 가능하도록

---

## 🚫 흔한 실수

### 1. 고정 폭 텍스트 컨테이너
```
❌ width: 177px (고정)
✅ width: Fill container + padding 10%
```

### 2. Absolute Position으로만 배치
```
❌ x=87.81, y=585.49 (절댓값만)
✅ Auto Layout + Constraints 병행
```

### 3. 픽셀 단위로만 간격 지정
```
❌ gap: 8px (화면 크기 무관)
✅ gap: 2% (비율) 또는 Auto Layout spacing
```

### 4. 테스트 없이 전달
```
❌ 기본 텍스트만 입력한 상태로 전달
✅ 최대 길이 텍스트 입력 후 레이아웃 확인
   예: "2038년 10월 12일 토요일 오후 2시 30분"
```

---

## 📚 참고 자료

- [Figma Auto Layout Guide](https://help.figma.com/hc/en-us/articles/360040451373)
- [Responsive Design in Figma](https://help.figma.com/hc/en-us/articles/360056440594)
- [Constraints and Resizing](https://help.figma.com/hc/en-us/articles/360039957734)

---

## 🤝 개발자와 협업 시

### 질문해야 할 것들
1. "이 텍스트는 최대 몇 글자까지 들어갈 수 있나요?"
2. "다국어 지원이 필요한가요?"
3. "모바일과 데스크톱에서 동일한 레이아웃인가요?"
4. "이미지는 사용자가 업로드하나요? (비율이 다를 수 있음)"

### 전달해야 할 것들
1. "이 영역은 텍스트 길이에 따라 늘어나야 합니다"
2. "이 요소는 항상 중앙 정렬 유지해야 합니다"
3. "이 이미지는 비율을 유지하며 크롭되어야 합니다"
4. "좌우 여백은 10% 비율로 유지해야 합니다"

---

## ✨ 요약

1. **텍스트 영역**: 고정 폭 ❌ → Full width + Padding ✅
2. **Auto Layout**: 적극 활용 (Hug/Fill container)
3. **Constraints**: 반응형 동작 명시
4. **긴 텍스트**: 항상 테스트
5. **명명 규칙**: 의미 있는 레이어명 사용
6. **개발자와 소통**: 엣지 케이스 공유

**핵심 원칙**: "디자인이 다양한 콘텐츠 길이에 유연하게 대응할 수 있어야 한다"
