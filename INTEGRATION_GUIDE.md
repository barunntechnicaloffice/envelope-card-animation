# 🎴 Wedding Card Templates - Integration Guide

다른 프로젝트에서 Wedding Card Templates를 사용하기 위한 완벽 가이드입니다.

## 📋 목차
- [필요한 파일들](#필요한-파일들)
- [렌더링 유틸리티](#렌더링-유틸리티)
- [구현 방법](#구현-방법)
- [API 응답 형식](#api-응답-형식)
- [예제 코드](#예제-코드)

---

## 필요한 파일들

### 1️⃣ JSON 템플릿 스키마 (4개)

다음 파일들을 복사하세요:
```
public/templates/
├── wedding-card-001.json
├── wedding-card-002.json
├── wedding-card-003.json
└── wedding-card-004.json
```

**각 JSON 파일 구조:**
```json
{
  "id": "wedding-card-001",
  "version": "3.0.0",
  "name": "웨딩 청첩장 템플릿 001",
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "photo": { "type": "image", "x": 52, "y": 106, ... },
    "groom": { "type": "text", "x": 24, "y": 395, ... },
    ...
  },
  "data": {
    "wedding": { ... }
  },
  "components": [ ... ]
}
```

### 2️⃣ Assets 파일들

다음 디렉토리를 전체 복사하세요:
```
public/assets/
├── common/              # 공통 에셋 (모든 템플릿 공유)
│   ├── bg.png          # 페이지 배경
│   ├── pattern.png     # 봉투 패턴
│   ├── seal.png        # 봉투 씰
│   └── photo.png       # 기본 샘플 사진
├── wedding-card-001/   # 템플릿 001 전용
├── wedding-card-002/   # 템플릿 002 전용
├── wedding-card-003/   # 템플릿 003 전용
└── wedding-card-004/   # 템플릿 004 전용
```

### 3️⃣ 렌더링 유틸리티 (필수!)

`lib/layout-utils.ts`에서 다음 함수를 복사하세요:

```typescript
// lib/layout-utils.ts

interface BaseSize {
  width: number
  height: number
}

/**
 * 픽셀을 백분율로 변환
 */
function pxToPercent(px: number, base: number): string {
  return `${(px / base) * 100}%`
}

/**
 * ⭐ 핵심 함수: Layout 요소를 React CSSProperties로 변환
 *
 * @param key - 요소 이름 (디버깅용)
 * @param element - JSON layout 객체의 요소
 * @param baseSize - 기준 크기 (335x515)
 * @param data - 템플릿 데이터 (현재는 미사용, 향후 확장용)
 * @returns React.CSSProperties 객체
 */
export function renderLayoutElement(
  key: string,
  element: any,
  baseSize: BaseSize,
  data: Record<string, any>
): React.CSSProperties {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: pxToPercent(element.x, baseSize.width),
    top: pxToPercent(element.y, baseSize.height),
    zIndex: element.zIndex || 0,
    margin: 0
  }

  // width 처리 (auto 지원)
  if (element.width !== undefined) {
    style.width = element.width === 'auto'
      ? 'auto'
      : pxToPercent(element.width, baseSize.width)
  }

  // height 처리
  if (element.height !== undefined) {
    style.height = pxToPercent(element.height, baseSize.height)
  }

  // 텍스트 스타일
  if (element.type === 'text') {
    style.fontFamily = element.fontFamily || "'NanumMyeongjo', serif"
    style.fontSize = `${element.fontSize || 16}px`
    style.fontWeight = element.fontWeight || 400
    style.color = element.color || '#333333'
    style.textAlign = element.align || 'center'
    style.lineHeight = element.lineHeight || 'normal'

    if (element.letterSpacing !== undefined) {
      style.letterSpacing = `${element.letterSpacing}px`
    }

    if (element.textTransform) {
      style.textTransform = element.textTransform as any
    }

    // centerAlign 처리 (좌우 중앙 정렬)
    if (element.centerAlign) {
      style.transform = 'translateX(-50%)'
    }
  }

  // 이미지 스타일
  if (element.type === 'image') {
    style.overflow = 'hidden'
  }

  return style
}
```

---

## 구현 방법

### Step 1: Mock API 설정

**API 엔드포인트:**
```
GET /api/templates/{templateId}
```

**응답 예시:**
```json
{
  "id": "wedding-card-001",
  "version": "3.0.0",
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "photo": { ... },
    "groom": { ... },
    ...
  },
  "data": {
    "wedding": {
      "groom": "이 준 서",
      "bride": "김 은 재",
      "photo": "/assets/common/photo.png",
      ...
    }
  }
}
```

### Step 2: 렌더링 컴포넌트 생성

```typescript
// components/WeddingCard.tsx

import { renderLayoutElement } from '@/lib/layout-utils'

interface WeddingCardProps {
  templateData: any  // API 응답 JSON
}

export function WeddingCard({ templateData }: WeddingCardProps) {
  const { layout, data } = templateData
  const { baseSize } = layout
  const weddingData = data.wedding

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '335 / 515',  // ⭐ 비율 유지 필수!
        backgroundColor: '#EFEEEB'
      }}
    >
      {/* 배경 이미지 */}
      {weddingData.backgroundImage && layout.background && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${weddingData.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: layout.background.zIndex || 0
          }}
        />
      )}

      {/* 사진 */}
      {layout.photo && (
        <div style={{
          ...renderLayoutElement('photo', layout.photo, baseSize, weddingData),
          overflow: 'hidden'
        }}>
          <img
            src={weddingData.photo}
            alt="Wedding Photo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}

      {/* 장식 이미지 */}
      {weddingData.decorationImage && layout.decoration && (
        <div style={{
          ...renderLayoutElement('decoration', layout.decoration, baseSize, weddingData),
          overflow: 'hidden'
        }}>
          <img
            src={weddingData.decorationImage}
            alt="Decoration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}

      {/* 신랑 이름 */}
      {layout.groom && (
        <p style={renderLayoutElement('groom', layout.groom, baseSize, weddingData)}>
          {weddingData.groom}
        </p>
      )}

      {/* 신부 이름 */}
      {layout.bride && (
        <p style={renderLayoutElement('bride', layout.bride, baseSize, weddingData)}>
          {weddingData.bride}
        </p>
      )}

      {/* 날짜 */}
      {layout.date && (
        <p style={renderLayoutElement('date', layout.date, baseSize, weddingData)}>
          {weddingData.date}
        </p>
      )}

      {/* 장소 */}
      {layout.venue && (
        <p style={renderLayoutElement('venue', layout.venue, baseSize, weddingData)}>
          {weddingData.venue}
        </p>
      )}
    </div>
  )
}
```

### Step 3: 사용 예제

```typescript
// pages/wedding-card.tsx

import { useState, useEffect } from 'react'
import { WeddingCard } from '@/components/WeddingCard'

export default function WeddingCardPage() {
  const [templateData, setTemplateData] = useState(null)

  useEffect(() => {
    // Mock API 호출
    fetch('/api/templates/wedding-card-001')
      .then(res => res.json())
      .then(data => setTemplateData(data))
  }, [])

  if (!templateData) return <div>Loading...</div>

  return (
    <div style={{
      maxWidth: '672px',  // 335px * 2 (여유)
      margin: '0 auto',
      padding: '20px'
    }}>
      <WeddingCard templateData={templateData} />
    </div>
  )
}
```

---

## API 응답 형식

### 📌 필수 필드

**모든 템플릿 공통:**
```json
{
  "layout": {
    "baseSize": { "width": 335, "height": 515 },
    "photo": { "type": "image", "x": number, "y": number, ... },
    "groom": { "type": "text", "x": number, "y": number, ... },
    "bride": { "type": "text", "x": number, "y": number, ... },
    "date": { "type": "text", ... },
    "venue": { "type": "text", ... }
  },
  "data": {
    "wedding": {
      "groom": string,
      "bride": string,
      "date": string,
      "venue": string,
      "photo": string,  // ⚠️ 기본값: "/assets/common/photo.png"
      "backgroundImage": string,  // 템플릿 001, 003
      "decorationImage": string   // 템플릿 001
    }
  }
}
```

### 📌 템플릿별 추가 필드

**템플릿 002:**
```json
{
  "layout": {
    "dday": { ... },
    "dateMonth": { ... },
    "dateDay": { ... },
    "dateDivider": { ... },
    "dateEnglish": { ... },
    "dateKorean": { ... },
    "groomLabel": { ... },
    "brideLabel": { ... }
  },
  "data": {
    "wedding": {
      "dday": "D-100",
      "dateMonth": "10",
      "dateDay": "12",
      "dateEnglish": "OCTOBER 12, 2038",
      "dateKorean": "2038년 10월 12일 토요일 오후 2시",
      "groomLabel": "GROOM",
      "brideLabel": "BRIDE",
      "decoration": "/assets/wedding-card-002/decoration.svg",
      "dateDivider": "/assets/wedding-card-002/date-divider.svg"
    }
  }
}
```

**템플릿 003:**
```json
{
  "layout": {
    "title": { ... }
  },
  "data": {
    "wedding": {
      "title": "WEDDING INVITATION",
      "decoration": "/assets/wedding-card-003/decoration.png"
    }
  }
}
```

**템플릿 004:**
```json
{
  "layout": {
    "separator": { ... }
  },
  "data": {
    "wedding": {
      "separator": "&",
      "decoration": "/assets/wedding-card-004/decoration.gif"
    }
  }
}
```

---

## ⚠️ 중요 주의사항

### 1. **aspectRatio 필수!**
```typescript
// ✅ 올바른 방법
<div style={{
  width: '100%',
  aspectRatio: '335 / 515'  // 반드시 필요!
}}>
  <WeddingCard ... />
</div>

// ❌ 잘못된 방법
<div style={{
  width: '100%',
  height: '100%'  // 비율이 깨짐!
}}>
  <WeddingCard ... />
</div>
```

### 2. **좌표 시스템**
- JSON의 모든 좌표는 **BG 컨테이너 기준 상대 좌표**입니다
- Figma 캔버스 절대 좌표가 아닙니다!
- baseSize (335×515)를 기준으로 백분율 변환됩니다

### 3. **기본 photo 이미지**
```typescript
// ⚠️ photo가 없을 때 반드시 기본값 사용!
photo: weddingData.photo || '/assets/common/photo.png'
```

### 4. **폰트 로드**
```css
/* NanumMyeongjo 폰트 필수 */
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&display=swap');
```

---

## 🎯 빠른 시작 체크리스트

- [ ] JSON 템플릿 파일 4개 복사
- [ ] `/assets/` 디렉토리 전체 복사
- [ ] `renderLayoutElement` 함수 복사
- [ ] NanumMyeongjo 폰트 로드
- [ ] Mock API 응답에 위 JSON 구조 사용
- [ ] 컴포넌트에 `aspectRatio: '335 / 515'` 적용
- [ ] 각 템플릿별 추가 필드 확인

---

## 📞 문의사항

구현 중 문제가 발생하면:
1. `renderLayoutElement` 함수가 올바르게 복사되었는지 확인
2. JSON 응답 구조가 위 형식과 일치하는지 확인
3. `aspectRatio`가 적용되었는지 확인
4. 브라우저 콘솔에서 layout 객체 확인

---

## 📄 라이선스

이 템플릿과 관련 코드는 프로젝트 내에서 자유롭게 사용 가능합니다.
