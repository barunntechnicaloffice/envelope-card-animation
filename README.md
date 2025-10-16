# 📮 Envelope Card Animation

봉투에서 카드가 나오는 인터랙티브 애니메이션 프로젝트

## ✨ Features

- **봉투 열림 애니메이션**: 봉투를 클릭하면 뚜껑이 열리고 카드가 슬라이드되어 나옵니다
- **Figma 디자인 시스템**: Figma MCP를 활용한 정확한 디자인 구현
- **반응형 디자인**: 모바일부터 데스크톱까지 모든 화면 크기 지원
- **Swiper 카드 스택**: 여러 카드를 스와이프하여 넘길 수 있습니다
- **웨딩 카드 템플릿**: 절대 픽셀 레이아웃 기반 청첩장 디자인

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
│   ├── page.tsx                  # Main page with envelope animation
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── EnvelopeCard.tsx          # Main envelope component
│   ├── EnvelopeCard.module.css   # Envelope styles
│   └── cards/
│       └── WeddingCard.tsx       # Wedding card template
├── public/
│   └── assets/
│       └── figma/                # Figma design assets
│           ├── bg.png            # Background pattern
│           ├── pattern.png       # Envelope texture
│           ├── seal.png          # Seal decoration
│           ├── card-bg.png       # Card background
│           └── decoration.png    # Card decoration
├── types/
│   ├── wedding.ts                # Wedding data types
│   └── card-layout.ts            # Card layout types
└── lib/
    └── server-driven-ui/         # Server-driven UI system
        └── renderer.tsx          # Dynamic component renderer
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

## 📝 Server-Driven UI

동적 템플릿 시스템 (현재 개발 환경에서만 사용 가능):

- **JSONPath 기반 데이터 바인딩**
- **컴포넌트 기반 렌더링**
- **템플릿 레지스트리**

## 🌐 Deployment

GitHub Pages에 정적 사이트로 배포됨:

```bash
# Build and deploy
npm run build
npx gh-pages -d out
```

**배포 설정:**
- `output: 'export'` - 정적 HTML export
- `basePath: '/envelope-card-animation'` - GitHub repo 경로

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

## 🙏 Acknowledgments

- Figma for design specifications
- Next.js team for the amazing framework
- Swiper.js for smooth card animations
