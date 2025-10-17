# 📐 Figma 디자인 가이드

템플릿 개발을 위한 Figma 디자인 작성 가이드입니다.

## 📋 목차
- [기본 원칙](#기본-원칙)
- [레이어 네이밍 규칙](#레이어-네이밍-규칙)
- [편집 가능 여부 설정](#편집-가능-여부-설정)
- [템플릿 구조](#템플릿-구조)
- [에셋 준비](#에셋-준비)

---

## 🎯 기본 원칙

### 1. 절대 픽셀 레이아웃
- **기준 크기**: 335px × 515px (카드 기본 사이즈)
- 모든 요소는 절대 픽셀 좌표로 배치
- Figma의 X, Y 좌표가 그대로 코드로 변환됨

### 2. 레이어 구조
```
template (Frame)
├── BG (Background)
├── photo (Frame) ← 사용자 편집 가능
├── groom (Text)
├── bride (Text)
├── date (Text)
├── venue (Text)
└── decoration (Image)
```

---

## 🏷️ 레이어 네이밍 규칙

### ⚠️ 중요: JSON 키값과 동일하게 작성
**Figma 레이어 이름 = JSON 키값**으로 사용됩니다. MCP가 자동으로 변환하므로 정확히 일치해야 합니다.

### 필수 레이어 이름 (Wedding Template)

| 항목 | Figma 레이어명 | JSON 키 | 설명 |
|------|---------------|---------|------|
| 신랑 이름 | `groom` | `groom` | 신랑 이름 텍스트 |
| 신부 이름 | `bride` | `bride` | 신부 이름 텍스트 |
| 날짜 | `date` | `date` | 결혼식 날짜 |
| 장소 | `venue` | `venue` | 결혼식 장소 |
| 사진 | `photo` | `photo` | 커플 사진 영역 |
| 배경 | `background` | `background` | 카드 배경 |
| 장식 | `decoration` | `decoration` | 장식 요소 |

### 기본 네이밍 규칙
```
✅ 올바른 예 (JSON 키값과 동일):
- groom          ← JSON: "groom"
- bride          ← JSON: "bride"
- date           ← JSON: "date"
- venue          ← JSON: "venue"
- photo          ← JSON: "photo"
- decoration     ← JSON: "decoration"

❌ 잘못된 예 (JSON과 불일치):
- groom_name     ← JSON: "groom"과 불일치
- GroomName      ← 카멜케이스 사용 불가
- groom-name     ← 하이픈 사용 불가
- 신랑이름        ← 한글 사용 불가
```

### 추가 레이어 네이밍
템플릿 특화 요소는 다음 규칙 적용:
- **소문자만 사용**
- **단어 구분은 언더스코어(_)**
- **영문만 사용** (한글 X)

```
예시:
- dday           ← D-day 카운터
- date_month     ← 날짜 (월)
- date_day       ← 날짜 (일)
- date_divider   ← 날짜 구분선
- groom_label    ← "GROOM" 라벨
- bride_label    ← "BRIDE" 라벨
```

### 편집 제한 네이밍
레이어 이름에 특수 태그를 붙여 편집 가능 여부를 자동 설정:

| 네이밍 패턴 | editable 값 | 설명 |
|------------|-------------|------|
| `레이어명 [locked]` | `false` | 편집 불가 (고정) |
| `레이어명 [editable]` | `true` | 편집 가능 (명시적) |
| `레이어명` (태그 없음) | `true` | 편집 가능 (기본값) |

### 예시

#### 1. 사진 영역 (편집 가능)
```
Figma 레이어명: photo [editable]
→ JSON 결과:
{
  "photo": {
    "x": 95.5,
    "y": 226,
    "width": 144,
    "height": 144,
    "editable": true  ← 자동 추가
  }
}
```

#### 2. 배경 이미지 (편집 불가)
```
Figma 레이어명: background [locked]
→ JSON 결과:
{
  "background": {
    "x": 0,
    "y": 0,
    "width": 335,
    "height": 515,
    "editable": false  ← 자동 추가
  }
}
```

#### 3. 장식 요소 (기본값 - 편집 가능)
```
Figma 레이어명: decoration
→ JSON 결과:
{
  "decoration": {
    "x": 139.6845,
    "y": 389.9,
    "width": 55.631,
    "height": 14.1,
    "editable": true  ← 기본값
  }
}
```

---

## 🔒 편집 가능 여부 설정

### 언제 [locked]를 사용하나요?

**사용자가 변경하면 안 되는 요소에 적용:**

✅ **[locked] 권장 사항:**
- 템플릿 고유 디자인 요소
- 브랜드 로고
- 고정된 배경 이미지
- 템플릿 구조를 유지해야 하는 프레임

❌ **[locked] 비권장:**
- 사용자가 입력해야 하는 텍스트 (이름, 날짜 등)
- 사용자가 교체할 수 있는 사진
- 선택 가능한 색상 영역

### 실제 사용 예시

#### Wedding Card Template
```
✅ 편집 가능 (editable: true):
- photo              ← 사용자 사진 업로드
- groom_name         ← 신랑 이름
- bride_name         ← 신부 이름
- wedding_date       ← 결혼식 날짜
- venue_info         ← 장소 정보

🔒 편집 불가 (editable: false):
- background [locked]     ← 템플릿 배경
- template_logo [locked]  ← 템플릿 브랜드
- frame_border [locked]   ← 테두리 디자인
```

---

## 📐 템플릿 구조

### 1. 기본 사이즈
```
카드 크기: 335px × 515px
비율: 1:1.537 (세로형)
```

### 2. 레이어 순서 (Z-Index)
```
10: 최상위 (버튼, 인터랙션 요소)
5:  중간 (텍스트, 장식)
2:  하위 (사진, 이미지)
1:  기본 (콘텐츠)
0:  배경
```

### 3. 필수 레이어

**모든 웨딩 템플릿에 포함되어야 할 레이어:**
- `photo` - 사진 영역
- `groom` or `groom_name` - 신랑 이름
- `bride` or `bride_name` - 신부 이름
- `date` or `wedding_date` - 결혼식 날짜
- `venue` or `venue_info` - 장소 정보

---

## 🎨 에셋 준비

### 1. 이미지 포맷
- **배경**: PNG (투명 가능) 또는 JPG
- **아이콘/장식**: SVG (권장) 또는 PNG
- **사진**: JPG (사용자 업로드용)

### 2. 파일명 규칙
```
템플릿ID별로 폴더 구분:
/assets/wedding-card-001/
  ├── bg.png           ← 배경
  ├── card-bg.png      ← 카드 배경
  ├── pattern.png      ← 패턴
  ├── seal.png         ← 씰/스탬프
  ├── decoration.svg   ← 장식 요소
  └── photo.png        ← 샘플 사진
```

### 3. 이미지 최적화
- **배경**: 최대 2000px, WebP 또는 PNG
- **아이콘**: SVG 권장 (벡터)
- **사진**: 최대 1200px, JPEG 80% 품질

---

## ✅ 체크리스트

템플릿 디자인 완료 전 확인사항:

### Figma 디자인
- [ ] 카드 크기가 335px × 515px인가?
- [ ] 모든 레이어 이름이 소문자 + 언더스코어인가?
- [ ] 편집 불가 요소에 `[locked]` 태그를 붙였는가?
- [ ] 편집 가능 요소에 `[editable]` 태그를 붙였는가? (선택사항)
- [ ] 필수 레이어(photo, groom, bride, date, venue)가 있는가?
- [ ] Z-index 순서가 올바른가?

### 에셋
- [ ] 모든 이미지가 준비되었는가?
- [ ] 파일명이 규칙에 맞는가?
- [ ] 이미지가 최적화되었는가?
- [ ] SVG는 불필요한 메타데이터가 제거되었는가?

### Node ID
- [ ] Figma Node ID를 확인했는가? (Dev Mode에서 확인)
- [ ] Node ID를 템플릿 JSON에 기록했는가?

---

## 🚀 템플릿 개발 프로세스

### 1. Figma 디자인 작성
```
1. 새 Frame 생성 (335×515px)
2. 레이어 구조 설계
3. 네이밍 규칙 적용
4. [locked] / [editable] 태그 추가
5. Dev Mode에서 Node ID 확인
```

### 2. MCP로 디자인 추출
```typescript
// Figma MCP 사용
mcp__figma-dev-mode-mcp-server__get_code({
  nodeId: "13-263",
  clientLanguages: "typescript",
  clientFrameworks: "react"
})
```

### 3. 컴포넌트 개발
```
1. React 컴포넌트 생성 (WeddingCard003.tsx)
2. 절대 픽셀 레이아웃 적용
3. editable 속성에 따라 UI 처리
```

### 4. JSON 스키마 생성
```json
{
  "id": "wedding-card-003",
  "layout": {
    "photo": {
      "x": 95.5,
      "y": 226,
      "editable": true  // [editable] 태그 → true
    },
    "background": {
      "x": 0,
      "y": 0,
      "editable": false  // [locked] 태그 → false
    }
  }
}
```

---

## 📝 예시: Wedding Card 002

### Figma 레이어 구조
```
template_GROUP [Frame 13:263]
├── template [Frame]
    ├── BG [Rectangle]
    ├── input [Frame]
    │   ├── date [Text]
    │   ├── location [Text]
    │   ├── groom [Frame]
    │   │   ├── groom_name [Text]
    │   │   └── groom [Text "GROOM"]
    │   ├── bride [Frame]
    │   │   ├── bride_name [Text]
    │   │   └── bride [Text "BRIDE"]
    │   └── Design_date_1 [Text]
    ├── obj [Frame - 장식]
    └── photo [Frame] ← editable: true
```

### 적용 예시
```
만약 photo를 편집 불가로 만들고 싶다면:
Figma 레이어명: "photo [locked]"

→ 자동 생성된 JSON:
{
  "photo": {
    "x": 95.5,
    "y": 226,
    "width": 144,
    "height": 144,
    "editable": false  ← 자동으로 false 설정
  }
}
```

---

## 🔗 관련 문서

- [API 명세서](./API_SPEC.md)
- [README](./README.md)
- [Figma MCP 가이드](https://www.figma.com/developers/mcp)

---

## 💡 팁

### 디자인 효율성
1. **컴포넌트 재사용**: Figma 컴포넌트를 활용하여 일관성 유지
2. **Auto Layout 사용**: 반응형 대응을 위한 Auto Layout 설정
3. **네이밍 템플릿**: 팀 내 네이밍 규칙 문서 공유

### 협업 가이드
1. **[locked] 규칙 공유**: 팀원들에게 네이밍 규칙 교육
2. **템플릿 검토**: 개발 전 디자인 리뷰 프로세스 수립
3. **버전 관리**: Figma 버전 히스토리 활용

---

**문의사항은 Barunn Technical Office로 연락 주세요.**
