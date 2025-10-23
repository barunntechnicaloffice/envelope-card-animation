# 📮 Envelope Card Animation - Template Development Tool

Figma 디자인을 Server-Driven UI JSON 템플릿으로 변환하는 **템플릿 개발 도구**

## 🎯 프로젝트 목적

이 프로젝트는 **템플릿을 개발하고 생성**하는 도구입니다.

```
1. [이 프로젝트 - 템플릿 개발 도구]
   ↓ Figma MCP로 디자인 가져오기
   ↓ React 컴포넌트로 템플릿 개발
   ↓ 실시간 미리보기 & 수정
   ↓ Server-Driven UI JSON 스키마 추출
   ↓ 어드민에서 백엔드 API로 저장

2. [백엔드 API]
   ↓ 템플릿 데이터 저장 및 관리

3. [하객뷰 프로젝트]
   ↓ 저장된 템플릿을 불러와 렌더링
   ↓ 사용자에게 청첩장 표시
```

**이 프로젝트는 사용자 카드 생성 기능을 포함하지 않습니다.** 사용자별 카드 생성은 하객뷰 프로젝트의 책임입니다.

## ✨ Features

- **Figma MCP Integration**: Figma 디자인을 자동으로 가져와 React 컴포넌트로 변환
- **실시간 미리보기**: 템플릿을 로컬에서 즉시 확인하며 개발
- **봉투 열림 애니메이션**: 봉투를 클릭하면 뚜껑이 열리고 카드가 슬라이드되어 나옵니다
- **반응형 디자인**: 모바일부터 데스크톱까지 모든 화면 크기 지원
- **Swiper 카드 스택**: 여러 카드를 스와이프하여 넘길 수 있습니다
- **절대 픽셀 레이아웃**: Figma 기반 정확한 디자인 구현
- **Server-Driven UI**: JSONPath 기반 데이터 바인딩 시스템

## 🎨 Design Specifications

### Envelope (봉투)
- **최소 크기**: 290px × 195.803px
- **비율**: 0.675 (가로 회전 90도)
- **반응형**: `min(85vw, 1000px)` - 화면에 맞게 확대
- **패턴**: Figma pattern.png 텍스처 적용
- **Seal 장식**: 56.727px × 52.494px (aspect ratio 1.08)

### Card (카드)
- **크기**: 335px × 515px
- **비율**: 1.537 (세로형)
- **반응형**: 최소 335px, 최대 600px

## 🚀 Getting Started

### ⚡ Quick Start (Validator)

**가장 빠르게 프로젝트를 이해하는 방법:**

```bash
# 1. 프로젝트 디렉토리로 이동
cd envelope-card-animation

# 2. HTTP 서버 시작
python3 -m http.server 8080

# 3. 브라우저에서 Validator 열기
open http://localhost:8080/public/validator/index.html
```

**Validator에서 확인할 수 있는 것:**
- ✅ 모든 템플릿 리스트 (wedding-card-001 ~ 004)
- ✅ Hardcoded vs SDUI 비교
- ✅ JSON 스키마가 디자인을 완벽하게 재현하는지 검증

**➡️ 다음 단계: [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) 읽기**

---

### Prerequisites

- Node.js 18+
- npm or yarn
- Python 3 (Validator용)

### Installation

```bash
# Clone the repository
git clone https://github.com/barunntechnicaloffice/envelope-card-animation.git

# Navigate to project directory
cd envelope-card-animation

# Install dependencies
npm install
```

### Development

```bash
# Start development server (Next.js)
npm run dev

# Open http://localhost:3000
```

### Validator

```bash
# Start HTTP server for Validator
python3 -m http.server 8080

# Open http://localhost:8080/public/validator/index.html
```

### Build

```bash
# Build for production
npm run build

# The output will be in the /out directory
```

## 📁 Project Structure

```
envelope-card-animation/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 템플릿 미리보기 페이지
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── EnvelopeCard.tsx          # 봉투 애니메이션 컴포넌트
│   ├── EnvelopeCard.module.css   # 봉투 스타일
│   └── cards/
│       └── WeddingCard.tsx       # 웨딩 카드 템플릿 (Figma 2072:68405)
├── public/
│   ├── assets/
│   │   └── figma/                # Figma 디자인 에셋
│   │       ├── bg.png            # 배경 패턴
│   │       ├── pattern.png       # 봉투 텍스처
│   │       ├── seal.png          # 봉투 씰 장식
│   │       ├── card-bg.png       # 카드 배경
│   │       └── decoration.png    # 카드 장식
│   └── templates/
│       └── wedding-card-001.json # Server-Driven UI JSON 스키마
├── types/
│   ├── wedding.ts                # 웨딩 데이터 타입
│   └── card-layout.ts            # 카드 레이아웃 타입
├── lib/
│   └── server-driven-ui/         # Server-Driven UI 시스템
│       └── renderer.tsx          # 동적 컴포넌트 렌더러
├── API_SPEC.md                   # 백엔드 API 명세
└── README.md                     # 프로젝트 문서
```

## 🎯 Animation Flow

1. **Initial State**: 봉투가 축소된 상태로 화면 상단에 표시
2. **Click**: 사용자가 봉투를 클릭
3. **Flap Open**: 봉투 뚜껑이 180도 회전하며 열림 (0.75s)
4. **Card Slide**: 카드가 위로 슬라이드 (0.5s)
5. **Card Rotate**: 카드가 90도 회전하며 정면을 향함 (0.8s)
6. **Swiper Active**: Swiper가 활성화되어 카드 스택을 넘길 수 있음

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **React**: React 19
- **Styling**: Tailwind CSS + CSS Modules
- **Animation**: CSS Transforms + Transitions
- **Swiper**: Swiper.js (EffectCreative)
- **TypeScript**: Full type safety
- **Design**: Figma MCP Integration

## 📱 Responsive Breakpoints

- **Mobile**: < 375px (minimum)
- **Tablet**: 375px - 768px
- **Desktop**: > 768px (max 1000px envelope)

## 🎨 Figma Integration

이 프로젝트는 Figma MCP (Model Context Protocol)를 활용하여 디자인 시스템을 구현했습니다:

- **Node ID**: 1786:35465 (봉투 디자인)
- **Node ID**: 2072:68405 (웨딩 카드)
- **정확한 픽셀 레이아웃**: Figma에서 추출한 절대 좌표 사용
- **디자인 토큰**: 컬러, 사이즈, 그림자 등 Figma 스펙 그대로 적용

## 📝 Server-Driven UI Template System

이 프로젝트의 핵심 기능:

### Template Development Workflow

1. **Figma MCP로 디자인 스펙 추출**
   - Figma Node ID (예: 2072:68405)에서 정확한 픽셀 레이아웃 가져오기
   - 컬러, 폰트, 간격 등 디자인 토큰 추출

2. **React 컴포넌트로 템플릿 구현**
   - `components/cards/WeddingCard.tsx` 같은 템플릿 컴포넌트 개발
   - 절대 픽셀 레이아웃 시스템 적용

3. **Server-Driven UI JSON 스키마 생성**
   - `public/templates/wedding-card-001.json`
   - JSONPath 기반 데이터 바인딩 (`$.data.wedding.groom`)
   - 컴포넌트 타입 및 레이아웃 정의

4. **백엔드 API로 저장** (구현 예정)
   - 어드민 UI에서 "저장" 버튼 클릭
   - `POST /api/templates`로 JSON + 이미지 전송

### JSONPath Data Binding Example

```json
{
  "data": {
    "wedding": {
      "groom": "이준서",
      "bride": "김은재"
    }
  },
  "components": [{
    "type": "wedding-card-template-001",
    "data": {
      "groom": "$.data.wedding.groom",
      "bride": "$.data.wedding.bride"
    }
  }]
}
```

자세한 내용은 [API_SPEC.md](./API_SPEC.md) 참조

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- **Barunn Technical Office** - Initial work

## 📚 Documentation

### 🎯 시작하기 (필독!)

**1. [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)** ⭐ **가장 먼저 읽어야 할 문서**
   - 프로젝트 소개 및 핵심 개념 (SDUI, Validator, 좌표 시스템)
   - 빠른 시작 (5분 안에 Validator 실행)
   - Figma → JSON → SDUI 검증 전체 워크플로우
   - Step-by-step 템플릿 개발 가이드
   - 트러블슈팅 및 체크리스트

**2. [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** 🎨 **Figma 디자인 가이드** (디자이너용)
   - ⚠️ 중요: 프레임 구조 제약사항 (중첩 그룹 금지!)
   - 레이어 네이밍 규칙 (JSON 키값과 일치)
   - [locked] / [editable] 태그 시스템
   - 필수 레이어 이름 (groom, bride, date, venue, photo)

**3. [CLAUDE.md](./CLAUDE.md)** 📖 **상세 개발 가이드** (개발자용)
   - wedding-card-001 vs wedding-card-002 방법 비교
   - React 컴포넌트 개발 방법 (타입 시스템 vs 수동 계산)
   - 좌표 계산 및 레이아웃 유틸리티
   - Renderer 등록 방법

**4. [API_SPEC.md](./API_SPEC.md)** 🔌 **API 명세서**
   - 백엔드 API 구조
   - Server-Driven UI JSON 스키마
   - JSONPath 데이터 바인딩

**5. [public/templates/](./public/templates/)** 📂 **템플릿 예시**
   - wedding-card-001.json ~ wedding-card-004.json
   - JSON 스키마 v3.0.0 예시

### 🤖 For Claude AI / Next Development Session

**새로운 개발자나 Claude AI가 이 프로젝트를 이어서 작업할 때:**

**Step 1: Validator 실행해보기 (5분)**
```bash
python3 -m http.server 8080
open http://localhost:8080/public/validator/index.html
```
- 템플릿 리스트 확인
- Hardcoded vs SDUI 비교 이해
- 프로젝트 목적 파악

**Step 2: 문서 읽기 (15분)**
1. **[TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)** - 전체 워크플로우 이해
2. **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** - Figma 디자인 규칙
3. **[CLAUDE.md](./CLAUDE.md)** - 상세 개발 가이드

**Step 3: 새 템플릿 개발**
```bash
# 1. Figma 디자인 준비 (335×515px, 평평한 구조)
# 2. Figma MCP로 메타데이터 추출
# 3. JSON 스키마 작성 (public/templates/wedding-card-XXX.json)
# 4. Validator로 검증 (detail.html)
# 5. 통과하면 완료!
```

**Key Files to Reference:**
- `public/validator/detail.html` - SDUI 검증 시스템
- `public/templates/*.json` - JSON 스키마 v3.0.0 예시
- `types/card-layout.ts` - Layout type definitions
- `lib/layout-utils.ts` - 좌표 변환 유틸리티
- `components/cards/WeddingCard.tsx` - Template 001 (참고용)

**Common Pitfalls to Avoid:**
- ❌ DON'T use nested groups in Figma (좌표 계산 문제)
- ❌ DON'T forget bgOffset (BG 좌표 확인 필수)
- ❌ DON'T skip Validator (검증 필수!)
- ✅ DO flatten all layers directly under template Frame
- ✅ DO use Figma absolute coordinates in JSON
- ✅ DO test in Validator before deploying

## 🔮 Roadmap

- [ ] 어드민 UI 구현 (템플릿 저장 버튼)
- [ ] 백엔드 API 연동 (`POST /api/templates`)
- [ ] 이미지 업로드 기능
- [ ] 템플릿 버전 관리 UI
- [ ] 템플릿 미리보기 썸네일 자동 생성
- [ ] 추가 템플릿 개발 (wedding-card-002, birthday-card-001 등)

## 🙏 Acknowledgments

- **Figma MCP**: 디자인 스펙 자동 추출
- **Next.js**: 강력한 React 프레임워크
- **Swiper.js**: 부드러운 카드 애니메이션
- **Barunn Technical Office**: 프로젝트 개발 및 유지보수
