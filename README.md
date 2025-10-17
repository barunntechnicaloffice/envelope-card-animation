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

### Prerequisites

- Node.js 18+
- npm or yarn

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
# Start development server
npm run dev

# Open http://localhost:3000
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

- **[API_SPEC.md](./API_SPEC.md)**: 백엔드 API 명세서
- **[public/templates/](./public/templates/)**: Server-Driven UI JSON 템플릿 예시

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
