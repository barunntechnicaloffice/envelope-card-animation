'use client'

import { JSONPath } from 'jsonpath-plus'
import type {
  Component,
  PageSchema,
  DataBinding,
  StyleProps,
  TextComponent,
  ImageComponent,
  ButtonComponent,
  ContainerComponent,
  TemplateComponent,
  WeddingCardTemplate001Component,
  WeddingCardTemplate002Component,
  WeddingCardTemplate003Component,
  WeddingCardTemplate004Component,
  WeddingCardTemplate005Component,
  WeddingCardTemplate006Component,
  WeddingCardTemplate007Component,
  WeddingCardTemplate008Component,
  WeddingCardTemplate009Component,
  WeddingCardTemplate010Component,
  WeddingCardTemplate011Component,
  WeddingCardTemplate012Component,
  WeddingCardTemplate013Component,
  WeddingCardTemplate015Component,
  WeddingCardTemplate016Component,
  WeddingCardTemplate017Component,
  WeddingCardTemplate018Component,
  WeddingCardTemplate019Component,
  WeddingCardTemplate020Component,
  WeddingCardTemplate021Component,
  WeddingCardTemplate022Component,
  WeddingCardTemplate023Component,
  WeddingCardTemplate024Component,
  WeddingCardTemplate025Component,
  WeddingCardTemplate026Component,
  WeddingCardTemplate027Component,
  WeddingCardTemplate028Component,
  WeddingCardTemplate029Component,
  WeddingCardTemplate030Component,
  WeddingCardTemplate031Component,
  WeddingCardTemplate032Component,
  WeddingCardTemplate033Component,
  WeddingCardTemplate034Component,
  WeddingCardTemplate035Component,
  WeddingCardTemplate036Component,
  WeddingCardTemplate037Component,
  WeddingCardTemplate038Component,
  WeddingCardTemplate039Component,
  WeddingCardTemplate040Component,
  WeddingCardTemplate041Component,
  WeddingCardTemplate042Component,
  WeddingCardTemplate043Component,
  WeddingCardTemplate044Component,
  WeddingCardTemplate045Component,
  WeddingCardTemplate046Component,
  WeddingCardTemplate047Component,
  WeddingCardTemplate048Component,
  WeddingCardTemplate049Component,
} from '@/types/server-driven-ui/schema'

/**
 * JSONPath를 사용하여 데이터를 resolve
 */
function resolveJSONPath(data: Record<string, any>, path: string): any {
  try {
    const result = JSONPath({ path, json: data })
    return result && result.length > 0 ? result[0] : undefined
  } catch (error) {
    console.error(`JSONPath error for path "${path}":`, error)
    return undefined
  }
}

/**
 * 데이터 바인딩 적용
 */
function applyDataBindings(
  component: Component,
  data: Record<string, any>
): Record<string, any> {
  if (!component.dataBindings || component.dataBindings.length === 0) {
    return {}
  }

  const bindings: Record<string, any> = {}

  component.dataBindings.forEach((binding: DataBinding) => {
    let value = resolveJSONPath(data, binding.path)

    // Fallback 처리
    if (value === undefined && binding.fallback !== undefined) {
      value = binding.fallback
    }

    // Transform 적용
    if (value !== undefined && binding.transform) {
      value = applyTransform(value, binding.transform)
    }

    bindings[binding.type] = value
  })

  return bindings
}

/**
 * Transform 함수
 */
function applyTransform(value: any, transform: string): any {
  switch (transform) {
    case 'uppercase':
      return String(value).toUpperCase()
    case 'lowercase':
      return String(value).toLowerCase()
    case 'capitalize':
      return String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase()
    case 'date-format':
      // 간단한 날짜 포맷팅
      return new Date(value).toLocaleDateString('ko-KR')
    case 'number-format':
      return Number(value).toLocaleString('ko-KR')
    default:
      return value
  }
}

/**
 * 조건부 렌더링 체크
 */
function shouldRender(component: Component, data: Record<string, any>): boolean {
  if (!component.conditional) return true

  const { condition, operator = 'exists', value: expectedValue } = component.conditional

  const actualValue = resolveJSONPath(data, condition)

  switch (operator) {
    case 'exists':
      return actualValue !== undefined && actualValue !== null
    case 'not-exists':
      return actualValue === undefined || actualValue === null
    case '==':
      return actualValue == expectedValue
    case '!=':
      return actualValue != expectedValue
    case '>':
      return actualValue > expectedValue
    case '<':
      return actualValue < expectedValue
    case '>=':
      return actualValue >= expectedValue
    case '<=':
      return actualValue <= expectedValue
    default:
      return true
  }
}

/**
 * Style을 React CSSProperties로 변환
 */
function styleToCSS(style?: StyleProps): React.CSSProperties {
  if (!style) return {}

  const cssProps: React.CSSProperties = {}

  // Layout
  if (style.width) cssProps.width = style.width
  if (style.height) cssProps.height = style.height
  if (style.minWidth) cssProps.minWidth = style.minWidth
  if (style.minHeight) cssProps.minHeight = style.minHeight
  if (style.maxWidth) cssProps.maxWidth = style.maxWidth
  if (style.maxHeight) cssProps.maxHeight = style.maxHeight

  // Flexbox
  if (style.layout === 'flex') cssProps.display = 'flex'
  if (style.flexDirection) cssProps.flexDirection = style.flexDirection
  if (style.alignItems) cssProps.alignItems = style.alignItems
  if (style.justifyContent) {
    const justifyMap: Record<string, string> = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
    }
    cssProps.justifyContent = justifyMap[style.justifyContent] || style.justifyContent
  }
  if (style.gap) cssProps.gap = style.gap

  // Spacing
  if (style.padding) cssProps.padding = style.padding
  if (style.paddingX) {
    cssProps.paddingLeft = style.paddingX
    cssProps.paddingRight = style.paddingX
  }
  if (style.paddingY) {
    cssProps.paddingTop = style.paddingY
    cssProps.paddingBottom = style.paddingY
  }
  if (style.margin) cssProps.margin = style.margin
  if (style.marginX) {
    cssProps.marginLeft = style.marginX
    cssProps.marginRight = style.marginX
  }
  if (style.marginY) {
    cssProps.marginTop = style.marginY
    cssProps.marginBottom = style.marginY
  }

  // Position
  if (style.position) cssProps.position = style.position
  if (style.top !== undefined) cssProps.top = style.top
  if (style.right !== undefined) cssProps.right = style.right
  if (style.bottom !== undefined) cssProps.bottom = style.bottom
  if (style.left !== undefined) cssProps.left = style.left
  if (style.zIndex !== undefined) cssProps.zIndex = style.zIndex

  // Visual
  if (style.background) cssProps.background = style.background
  if (style.backgroundColor) cssProps.backgroundColor = style.backgroundColor
  if (style.backgroundImage) cssProps.backgroundImage = style.backgroundImage
  if (style.border) cssProps.border = style.border
  if (style.borderRadius) cssProps.borderRadius = style.borderRadius
  if (style.opacity !== undefined) cssProps.opacity = style.opacity

  // Typography
  if (style.fontSize) cssProps.fontSize = style.fontSize
  if (style.fontWeight) cssProps.fontWeight = style.fontWeight
  if (style.fontFamily) cssProps.fontFamily = style.fontFamily
  if (style.lineHeight) cssProps.lineHeight = style.lineHeight
  if (style.letterSpacing) cssProps.letterSpacing = style.letterSpacing
  if (style.textAlign) cssProps.textAlign = style.textAlign
  if (style.color) cssProps.color = style.color

  // Transform
  if (style.transform) {
    cssProps.transform = style.transform
  } else {
    const transforms: string[] = []
    if (style.rotate) transforms.push(`rotate(${style.rotate})`)
    if (style.scale) transforms.push(`scale(${style.scale})`)
    if (style.translateX) transforms.push(`translateX(${style.translateX})`)
    if (style.translateY) transforms.push(`translateY(${style.translateY})`)
    if (transforms.length > 0) cssProps.transform = transforms.join(' ')
  }

  // Shadow
  if (style.boxShadow) cssProps.boxShadow = style.boxShadow

  return cssProps
}

/**
 * Component Renderer
 */
export function renderComponent(
  component: Component,
  data: Record<string, any>,
  key?: string | number
): React.ReactNode {
  // 조건부 렌더링 체크
  if (!shouldRender(component, data)) {
    return null
  }

  // 데이터 바인딩 적용
  const bindings = applyDataBindings(component, data)
  const style = styleToCSS(component.style)
  const className = component.style?.className || ''

  switch (component.type) {
    case 'text':
      return renderTextComponent(component as TextComponent, data, bindings, style, className, key)

    case 'image':
      return renderImageComponent(component as ImageComponent, data, bindings, style, className, key)

    case 'button':
      return renderButtonComponent(component as ButtonComponent, data, bindings, style, className, key)

    case 'container':
      return renderContainerComponent(component as ContainerComponent, data, style, className, key)

    case 'card':
      return renderCardComponent(component as any, data, style, className, key)

    case 'wedding-card-template-001':
      return renderWeddingCardTemplate001(component as WeddingCardTemplate001Component, data, style, className, key)

    case 'wedding-card-template-002':
      return renderWeddingCardTemplate002(component as WeddingCardTemplate002Component, data, style, className, key)

    case 'wedding-card-template-003':
      return renderWeddingCardTemplate003(component as WeddingCardTemplate003Component, data, style, className, key)

    case 'wedding-card-template-004':
      return renderWeddingCardTemplate004(component as WeddingCardTemplate004Component, data, style, className, key)

    case 'wedding-card-template-005':
      return renderWeddingCardTemplate005(component as WeddingCardTemplate005Component, data, style, className, key)

    case 'wedding-card-template-006':
      return renderWeddingCardTemplate006(component as WeddingCardTemplate006Component, data, style, className, key)

    case 'wedding-card-template-007':
      return renderWeddingCardTemplate007(component as WeddingCardTemplate007Component, data, style, className, key)

    case 'wedding-card-template-008':
      return renderWeddingCardTemplate008(component as WeddingCardTemplate008Component, data, style, className, key)

    case 'wedding-card-template-009':
      return renderWeddingCardTemplate009(component as WeddingCardTemplate009Component, data, style, className, key)

    case 'wedding-card-template-010':
      return renderWeddingCardTemplate010(component as WeddingCardTemplate010Component, data, style, className, key)

    case 'wedding-card-template-011':
      return renderWeddingCardTemplate011(component as WeddingCardTemplate011Component, data, style, className, key)

    case 'wedding-card-template-012':
      return renderWeddingCardTemplate012(component as WeddingCardTemplate012Component, data, style, className, key)

    case 'wedding-card-template-013':
      return renderWeddingCardTemplate013(component as WeddingCardTemplate013Component, data, style, className, key)

    case 'wedding-card-template-045':
      return renderWeddingCardTemplate045(component as WeddingCardTemplate045Component, data, style, className, key)

    case 'wedding-card-template-046':
      return renderWeddingCardTemplate046(component as WeddingCardTemplate046Component, data, style, className, key)

    case 'wedding-card-template-047':
      return renderWeddingCardTemplate047(component as WeddingCardTemplate047Component, data, style, className, key)

    case 'wedding-card-template-048':
      return renderWeddingCardTemplate048(component as WeddingCardTemplate048Component, data, style, className, key)

    case 'wedding-card-template-049':
      return renderWeddingCardTemplate049(component as WeddingCardTemplate049Component, data, style, className, key)

    case 'template':
      return renderTemplateById(component as TemplateComponent, data, style, className, key)

    default:
      console.warn(`Unknown component type: ${(component as any).type}`)
      return null
  }
}

function renderTextComponent(
  component: TextComponent,
  data: Record<string, any>,
  bindings: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  let content = component.content

  // JSONPath 표현식인 경우
  if (typeof content === 'string' && content.startsWith('$.')) {
    content = resolveJSONPath(data, content) || content
  }

  // 바인딩된 텍스트가 있으면 우선 사용
  if (bindings.text !== undefined) {
    content = bindings.text
  }

  if (component.html) {
    return (
      <div
        key={key}
        style={style}
        className={className}
        dangerouslySetInnerHTML={{ __html: String(content) }}
      />
    )
  }

  return (
    <span key={key} style={style} className={className}>
      {String(content)}
    </span>
  )
}

function renderImageComponent(
  component: ImageComponent,
  data: Record<string, any>,
  bindings: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  let src = component.src

  // JSONPath 표현식인 경우
  if (typeof src === 'string' && src.startsWith('$.')) {
    src = resolveJSONPath(data, src) || src
  }

  // 바인딩된 src가 있으면 우선 사용
  if (bindings.src !== undefined) {
    src = bindings.src
  }

  const imgStyle: React.CSSProperties = {
    ...style,
    objectFit: component.objectFit || 'cover',
  }

  return (
    <img
      key={key}
      src={String(src)}
      alt={component.alt || ''}
      style={imgStyle}
      className={className}
    />
  )
}

function renderButtonComponent(
  component: ButtonComponent,
  data: Record<string, any>,
  bindings: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  let label = component.label

  // JSONPath 표현식인 경우
  if (typeof label === 'string' && label.startsWith('$.')) {
    label = resolveJSONPath(data, label) || label
  }

  // 바인딩된 텍스트가 있으면 우선 사용
  if (bindings.text !== undefined) {
    label = bindings.text
  }

  const handleClick = () => {
    if (!component.onClick) return

    switch (component.onClick.action) {
      case 'navigate':
        if (component.onClick.target) {
          window.location.href = component.onClick.target
        }
        break
      case 'open-url':
        if (component.onClick.target) {
          window.open(component.onClick.target, '_blank')
        }
        break
      case 'api-call':
        console.log('API call:', component.onClick)
        break
      case 'custom':
        console.log('Custom action:', component.onClick)
        break
    }
  }

  return (
    <button key={key} style={style} className={className} onClick={handleClick}>
      {String(label)}
    </button>
  )
}

function renderContainerComponent(
  component: ContainerComponent,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  return (
    <div key={key} style={style} className={className}>
      {component.children?.map((child, index) =>
        renderComponent(child, data, `${component.id}-${index}`)
      )}
    </div>
  )
}

function renderCardComponent(
  component: ContainerComponent,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const cardStyle: React.CSSProperties = {
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    ...style,
  }

  return (
    <div key={key} style={cardStyle} className={className}>
      {component.children?.map((child, index) =>
        renderComponent(child, data, `${component.id}-${index}`)
      )}
    </div>
  )
}

function renderWeddingCardTemplate001(
  component: WeddingCardTemplate001Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard 컴포넌트 import
  const { WeddingCard } = require('@/components/cards/WeddingCard')

  // JSONPath로 데이터 추출
  console.log('Component data paths:', component.data)
  console.log('Full data object:', data)
  console.log('backgroundImage path:', component.data.backgroundImage)
  console.log('decorationImage path:', component.data.decorationImage)

  const backgroundImagePath = component.data.backgroundImage
  const decorationImagePath = component.data.decorationImage

  console.log('Resolved backgroundImage:', backgroundImagePath ? resolveJSONPath(data, backgroundImagePath) : 'NO PATH')
  console.log('Resolved decorationImage:', decorationImagePath ? resolveJSONPath(data, decorationImagePath) : 'NO PATH')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',
    backgroundImage: backgroundImagePath ? resolveJSONPath(data, backgroundImagePath) : undefined,
    decorationImage: decorationImagePath ? resolveJSONPath(data, decorationImagePath) : undefined
  }

  console.log('Wedding Card 001 Data:', weddingData)

  // Layout 정보 - JSON의 layout 사용 ($.layout 참조)
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate002(
  component: WeddingCardTemplate002Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard002 컴포넌트 import
  const { WeddingCard002 } = require('@/components/cards/WeddingCard002')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',
    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : undefined,
    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined,
    dateDivider: component.data.dateDivider
      ? resolveJSONPath(data, component.data.dateDivider)
      : undefined,
    dday: component.data.dday
      ? resolveJSONPath(data, component.data.dday)
      : undefined,
    dateMonth: component.data.dateMonth
      ? resolveJSONPath(data, component.data.dateMonth)
      : undefined,
    dateDay: component.data.dateDay
      ? resolveJSONPath(data, component.data.dateDay)
      : undefined,
    dateEnglish: component.data.dateEnglish
      ? resolveJSONPath(data, component.data.dateEnglish)
      : undefined,
    dateKorean: component.data.dateKorean
      ? resolveJSONPath(data, component.data.dateKorean)
      : undefined,
    groomLabel: component.data.groomLabel
      ? resolveJSONPath(data, component.data.groomLabel)
      : undefined,
    brideLabel: component.data.brideLabel
      ? resolveJSONPath(data, component.data.brideLabel)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard002
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate003(
  component: WeddingCardTemplate003Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard003 컴포넌트 import
  const { WeddingCard003 } = require('@/components/cards/WeddingCard003')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : undefined,
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : undefined,
    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined,
    title: component.data.title
      ? resolveJSONPath(data, component.data.title)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard003
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate004(
  component: WeddingCardTemplate004Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard004 컴포넌트 import
  const { WeddingCard004 } = require('@/components/cards/WeddingCard004')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    photo: resolveJSONPath(data, component.data.photo) || '/assets/common/photo.png',
    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined,
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard004
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate005(
  component: WeddingCardTemplate005Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard005 컴포넌트 import
  const { WeddingCard005 } = require('@/components/cards/WeddingCard005')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    // ⚠️ 중요: backgroundImage는 기본값 제공
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-005/card-bg.png',

    decorationFrame: component.data.decorationFrame
      ? resolveJSONPath(data, component.data.decorationFrame)
      : undefined,

    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard005
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate006(
  component: WeddingCardTemplate006Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard006 컴포넌트 import
  const { WeddingCard006 } = require('@/components/cards/WeddingCard006')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    title: component.data.title
      ? resolveJSONPath(data, component.data.title)
      : undefined,

    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : undefined,

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-006/card-bg.png',

    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard006
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate007(
  component: WeddingCardTemplate007Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard007 컴포넌트 import
  const { WeddingCard007 } = require('@/components/cards/WeddingCard007')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    groomLabel: component.data.groomLabel
      ? resolveJSONPath(data, component.data.groomLabel)
      : 'GROOM',

    brideLabel: component.data.brideLabel
      ? resolveJSONPath(data, component.data.brideLabel)
      : 'BRIDE',

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-007/card-bg.png',

    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard007
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate008(
  component: WeddingCardTemplate008Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard008 컴포넌트 import
  const { WeddingCard008 } = require('@/components/cards/WeddingCard008')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    dday: component.data.dday
      ? resolveJSONPath(data, component.data.dday)
      : 'D-DAY',

    // title 우선 사용, 없으면 mainText fallback (하위 호환성)
    title: (component.data.title
      ? resolveJSONPath(data, component.data.title)
      : component.data.mainText
        ? resolveJSONPath(data, component.data.mainText)
        : 'we are\ngetting married'),

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-008/card-bg.png',

    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard008
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate009(
  component: WeddingCardTemplate009Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard009 컴포넌트 import
  const { WeddingCard009 } = require('@/components/cards/WeddingCard009')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',

    groomLabel: component.data.groomLabel
      ? resolveJSONPath(data, component.data.groomLabel)
      : 'GROOM',

    brideLabel: component.data.brideLabel
      ? resolveJSONPath(data, component.data.brideLabel)
      : 'BRIDE',

    photo: component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : '/assets/common/photo.png',

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-009/card-bg.png',

    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : undefined
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard009
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate010(
  component: WeddingCardTemplate010Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard010 컴포넌트 import
  const { WeddingCard010 } = require('@/components/cards/WeddingCard010')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',

    title: component.data.title
      ? resolveJSONPath(data, component.data.title)
      : 'The marriage of',

    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : 'and',

    photo: component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : '/assets/common/photo.png',

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-010/card-bg.png'
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard010
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate011(
  component: WeddingCardTemplate011Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard011 컴포넌트 import
  const { WeddingCard011 } = require('@/components/cards/WeddingCard011')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',

    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : '/assets/wedding-card-011/decoration.png',

    cardBackground: component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : '/assets/wedding-card-011/card-bg.png'
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard011
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate012(
  component: WeddingCardTemplate012Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard012 컴포넌트 import
  const { WeddingCard012 } = require('@/components/cards/WeddingCard012')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-012/card-bg.png'
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard012
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate013(
  component: WeddingCardTemplate013Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard013 컴포넌트 import
  const { WeddingCard013 } = require('@/components/cards/WeddingCard013')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-013/card-bg.png'
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard013
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate015(
  component: WeddingCardTemplate015Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  // WeddingCard015 컴포넌트 import
  const { WeddingCard015 } = require('@/components/cards/WeddingCard015')

  // JSONPath로 데이터 추출
  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-015/card-bg.png'
  }

  // Layout 정보 - JSON의 layout 사용
  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard015
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate016(
  component: WeddingCardTemplate016Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard016 } = require('@/components/cards/WeddingCard016')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-016/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard016
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate017(
  component: WeddingCardTemplate017Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard017 } = require('@/components/cards/WeddingCard017')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : '/assets/wedding-card-017/decoration.png',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-017/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard017
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate018(
  component: WeddingCardTemplate018Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard018 } = require('@/components/cards/WeddingCard018')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    month: component.data.month
      ? resolveJSONPath(data, component.data.month)
      : '10',
    day: component.data.day
      ? resolveJSONPath(data, component.data.day)
      : '28',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-018/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard018
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate019(
  component: WeddingCardTemplate019Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard019 } = require('@/components/cards/WeddingCard019')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '그리고',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    decoration: component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : '/assets/wedding-card-019/decoration.png',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-019/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard019
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate020(
  component: WeddingCardTemplate020Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard020 } = require('@/components/cards/WeddingCard020')

  const weddingData = {
    title: component.data.title
      ? resolveJSONPath(data, component.data.title)
      : 'OUR LOVE STORY',
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '&',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-020/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard020
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate021(
  component: WeddingCardTemplate021Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard021 } = require('@/components/cards/WeddingCard021')

  const weddingData = {
    title: component.data.title
      ? resolveJSONPath(data, component.data.title)
      : 'The marriage of',
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '그리고',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    backgroundImage: component.data.backgroundImage
      ? resolveJSONPath(data, component.data.backgroundImage)
      : '/assets/wedding-card-021/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard021
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate022(
  component: WeddingCardTemplate022Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard022 } = require('@/components/cards/WeddingCard022')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '그리고',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/wedding-card-022/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-022/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard022
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate023(
  component: WeddingCardTemplate023Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard023 } = require('@/components/cards/WeddingCard023')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '그리고',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/wedding-card-023/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-023/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard023
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate024(
  component: WeddingCardTemplate024Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard024 } = require('@/components/cards/WeddingCard024')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '&',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/wedding-card-024/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-024/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard024
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate025(
  component: WeddingCardTemplate025Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard025 } = require('@/components/cards/WeddingCard025')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/wedding-card-025/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-025/decoration.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-025/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard025
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate026(
  component: WeddingCardTemplate026Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard026 } = require('@/components/cards/WeddingCard026')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    separator: component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : '그리고',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/wedding-card-026/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-026/card-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard026
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate027(
  component: WeddingCardTemplate027Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard027 } = require('@/components/cards/WeddingCard027')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-027/card-bg.png',
    decorationTop: (component.data.decorationTop
      ? resolveJSONPath(data, component.data.decorationTop)
      : null) || '/assets/wedding-card-027/decoration-top.png',
    decorationLeft: (component.data.decorationLeft
      ? resolveJSONPath(data, component.data.decorationLeft)
      : null) || '/assets/wedding-card-027/decoration-left.png',
    decorationRight: (component.data.decorationRight
      ? resolveJSONPath(data, component.data.decorationRight)
      : null) || '/assets/wedding-card-027/decoration-right.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard027
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate028(
  component: WeddingCardTemplate028Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard028 } = require('@/components/cards/WeddingCard028')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-028/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard028
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate029(
  component: WeddingCardTemplate029Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard029 } = require('@/components/cards/WeddingCard029')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-029/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard029
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate030(
  component: WeddingCardTemplate030Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard030 } = require('@/components/cards/WeddingCard030')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-030/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard030
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate031(
  component: WeddingCardTemplate031Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard031 } = require('@/components/cards/WeddingCard031')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-031/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-031/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard031
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate032(
  component: WeddingCardTemplate032Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard032 } = require('@/components/cards/WeddingCard032')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    separator: (component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : null) || 'and',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-032/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-032/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard032
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate033(
  component: WeddingCardTemplate033Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard033 } = require('@/components/cards/WeddingCard033')

  const weddingData = {
    title: (component.data.title
      ? resolveJSONPath(data, component.data.title)
      : null) || 'A NEW BEGINNING',
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    date: resolveJSONPath(data, component.data.date) || '날짜 미정',
    venue: resolveJSONPath(data, component.data.venue) || '장소 미정',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-033/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-033/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard033
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate034(
  component: WeddingCardTemplate034Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard034 } = require('@/components/cards/WeddingCard034')

  const weddingData = {
    weddingDayLabel: (component.data.weddingDayLabel
      ? resolveJSONPath(data, component.data.weddingDayLabel)
      : null) || 'WEDDING DAY',
    date: resolveJSONPath(data, component.data.date) || '2038.10.23',
    groomLabel: (component.data.groomLabel
      ? resolveJSONPath(data, component.data.groomLabel)
      : null) || 'GROOM',
    groom: resolveJSONPath(data, component.data.groom) || '신랑',
    brideLabel: (component.data.brideLabel
      ? resolveJSONPath(data, component.data.brideLabel)
      : null) || 'BRIDE',
    bride: resolveJSONPath(data, component.data.bride) || '신부',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-034/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-034/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard034
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate035(
  component: WeddingCardTemplate035Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard035 } = require('@/components/cards/WeddingCard035')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'JUNSEO',
    bride: resolveJSONPath(data, component.data.bride) || 'EUNJAE',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일 오후 2시',
    venue: resolveJSONPath(data, component.data.venue) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '#FFFFFF',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-035/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard035
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate036(
  component: WeddingCardTemplate036Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard036 } = require('@/components/cards/WeddingCard036')

  const weddingData = {
    title: (component.data.title
      ? resolveJSONPath(data, component.data.title)
      : null) || 'OUR WEDDING DAY',
    groom: resolveJSONPath(data, component.data.groom) || 'LEE JUNSEO',
    bride: resolveJSONPath(data, component.data.bride) || 'KIM EUNJAE',
    date: resolveJSONPath(data, component.data.date) || '2038.10.23 SAT PM 2:00',
    venue: resolveJSONPath(data, component.data.venue) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-036/card-main-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard036
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate037(
  component: WeddingCardTemplate037Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard037 } = require('@/components/cards/WeddingCard037')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Eunjae',
    date: resolveJSONPath(data, component.data.date) || 'October 23, 2038',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-037/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-037/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard037
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate038(
  component: WeddingCardTemplate038Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard038 } = require('@/components/cards/WeddingCard038')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Lee Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Kim Eunjae',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일 오후 2시',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-038/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-038/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard038
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate039(
  component: WeddingCardTemplate039Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard039 } = require('@/components/cards/WeddingCard039')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '이 준 서',
    bride: resolveJSONPath(data, component.data.bride) || '김 은 재',
    date: resolveJSONPath(data, component.data.date) || '2038.10.23 SAT PM 2:00',
    venue: resolveJSONPath(data, component.data.venue) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-039/card-main-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard039
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate040(
  component: WeddingCardTemplate040Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard040 } = require('@/components/cards/WeddingCard040')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Eunjae',
    date: resolveJSONPath(data, component.data.date) || 'October 23, 2038',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-040/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-040/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard040
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate041(
  component: WeddingCardTemplate041Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard041 } = require('@/components/cards/WeddingCard041')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Eunjae',
    date: resolveJSONPath(data, component.data.date) || 'October 23, 2038',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-041/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-041/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard041
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate042(
  component: WeddingCardTemplate042Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard042 } = require('@/components/cards/WeddingCard042')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Eunjae',
    date: resolveJSONPath(data, component.data.date) || 'October 23, 2038',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-042/card-main-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard042
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate043(
  component: WeddingCardTemplate043Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard043 } = require('@/components/cards/WeddingCard043')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '이 준 서',
    bride: resolveJSONPath(data, component.data.bride) || '김 은 재',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일 오후 2시',
    venue: resolveJSONPath(data, component.data.venue) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-043/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-043/decoration.png',
    title: (component.data.title
      ? resolveJSONPath(data, component.data.title)
      : null) || 'The marriage of'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard043
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate044(
  component: WeddingCardTemplate044Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard044 } = require('@/components/cards/WeddingCard044')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Eunjae',
    date: resolveJSONPath(data, component.data.date) || 'October 23, 2038',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-044/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard044
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate045(
  component: WeddingCardTemplate045Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard045 } = require('@/components/cards/WeddingCard045')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '이 준 서',
    bride: resolveJSONPath(data, component.data.bride) || '김 은 재',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일 오후 2시',
    venue: resolveJSONPath(data, component.data.venue) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-045/card-main-bg.png',
    decoration1: (component.data.decoration1
      ? resolveJSONPath(data, component.data.decoration1)
      : null) || '/assets/wedding-card-045/decoration1.png',
    decoration2: (component.data.decoration2
      ? resolveJSONPath(data, component.data.decoration2)
      : null) || '/assets/wedding-card-045/decoration2.png',
    groomLabel: (component.data.groomLabel
      ? resolveJSONPath(data, component.data.groomLabel)
      : null) || 'GROOM',
    brideLabel: (component.data.brideLabel
      ? resolveJSONPath(data, component.data.brideLabel)
      : null) || 'BRIDE'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard045
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate046(
  component: WeddingCardTemplate046Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard046 } = require('@/components/cards/WeddingCard046')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || 'Lee Junseo',
    bride: resolveJSONPath(data, component.data.bride) || 'Kim Eunjae',
    date: resolveJSONPath(data, component.data.date) || 'October 23, 2038',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-046/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-046/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard046
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate047(
  component: WeddingCardTemplate047Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard047 } = require('@/components/cards/WeddingCard047')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '이 준 서',
    bride: resolveJSONPath(data, component.data.bride) || '김 은 재',
    separator: (component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : null) || 'and',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일 오후 2시',
    venue: resolveJSONPath(data, component.data.venue) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-047/card-main-bg.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard047
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate048(
  component: WeddingCardTemplate048Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard048 } = require('@/components/cards/WeddingCard048')

  const weddingData = {
    title: (component.data.title
      ? resolveJSONPath(data, component.data.title)
      : null) || 'The marriage of',
    groom: resolveJSONPath(data, component.data.groom) || '이 준 서',
    bride: resolveJSONPath(data, component.data.bride) || '김 은 재',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일\n오후 2시',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    cardBackground: (component.data.cardBackground
      ? resolveJSONPath(data, component.data.cardBackground)
      : null) || '/assets/wedding-card-048/card-main-bg.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-048/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard048
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

function renderWeddingCardTemplate049(
  component: WeddingCardTemplate049Component,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const { WeddingCard049 } = require('@/components/cards/WeddingCard049')

  const weddingData = {
    groom: resolveJSONPath(data, component.data.groom) || '이 준 서',
    bride: resolveJSONPath(data, component.data.bride) || '김 은 재',
    separator: (component.data.separator
      ? resolveJSONPath(data, component.data.separator)
      : null) || '&',
    date: resolveJSONPath(data, component.data.date) || '2038년 10월 23일 토요일 오후 2시',
    venue: (component.data.venue
      ? resolveJSONPath(data, component.data.venue)
      : null) || '메종 드 프리미어 그랜드홀',
    photo: (component.data.photo
      ? resolveJSONPath(data, component.data.photo)
      : null) || '/assets/common/photo.png',
    decoration: (component.data.decoration
      ? resolveJSONPath(data, component.data.decoration)
      : null) || '/assets/wedding-card-049/decoration.png'
  }

  const layout = resolveJSONPath(data, '$.layout') || data.layout

  return (
    <WeddingCard049
      key={key}
      data={weddingData}
      layout={layout}
      style={style}
      className={className}
    />
  )
}

/**
 * "template" 타입일 때 JSON의 최상위 id로 렌더러 결정
 */
function renderTemplateById(
  component: TemplateComponent,
  data: Record<string, any>,
  style: React.CSSProperties,
  className: string,
  key?: string | number
): React.ReactNode {
  const templateId = resolveJSONPath(data, '$.id') || data.id

  switch (templateId) {
    case 'wedding-card-001':
      return renderWeddingCardTemplate001(component as any, data, style, className, key)
    case 'wedding-card-002':
      return renderWeddingCardTemplate002(component as any, data, style, className, key)
    case 'wedding-card-003':
      return renderWeddingCardTemplate003(component as any, data, style, className, key)
    case 'wedding-card-004':
      return renderWeddingCardTemplate004(component as any, data, style, className, key)
    case 'wedding-card-005':
      return renderWeddingCardTemplate005(component as any, data, style, className, key)
    case 'wedding-card-006':
      return renderWeddingCardTemplate006(component as any, data, style, className, key)
    case 'wedding-card-007':
      return renderWeddingCardTemplate007(component as any, data, style, className, key)
    case 'wedding-card-008':
      return renderWeddingCardTemplate008(component as any, data, style, className, key)
    case 'wedding-card-009':
      return renderWeddingCardTemplate009(component as any, data, style, className, key)
    case 'wedding-card-010':
      return renderWeddingCardTemplate010(component as any, data, style, className, key)
    case 'wedding-card-011':
      return renderWeddingCardTemplate011(component as any, data, style, className, key)
    case 'wedding-card-012':
      return renderWeddingCardTemplate012(component as any, data, style, className, key)
    case 'wedding-card-013':
      return renderWeddingCardTemplate013(component as any, data, style, className, key)
    case 'wedding-card-014':
      return renderWeddingCardTemplate013(component as any, data, style, className, key)
    case 'wedding-card-015':
      return renderWeddingCardTemplate015(component as any, data, style, className, key)
    case 'wedding-card-016':
      return renderWeddingCardTemplate016(component as any, data, style, className, key)
    case 'wedding-card-017':
      return renderWeddingCardTemplate017(component as any, data, style, className, key)
    case 'wedding-card-018':
      return renderWeddingCardTemplate018(component as any, data, style, className, key)
    case 'wedding-card-019':
      return renderWeddingCardTemplate019(component as any, data, style, className, key)
    case 'wedding-card-020':
      return renderWeddingCardTemplate020(component as any, data, style, className, key)
    case 'wedding-card-021':
      return renderWeddingCardTemplate021(component as any, data, style, className, key)
    case 'wedding-card-022':
      return renderWeddingCardTemplate022(component as any, data, style, className, key)
    case 'wedding-card-023':
      return renderWeddingCardTemplate023(component as any, data, style, className, key)
    case 'wedding-card-024':
      return renderWeddingCardTemplate024(component as any, data, style, className, key)
    case 'wedding-card-025':
      return renderWeddingCardTemplate025(component as any, data, style, className, key)
    case 'wedding-card-026':
      return renderWeddingCardTemplate026(component as any, data, style, className, key)
    case 'wedding-card-027':
      return renderWeddingCardTemplate027(component as any, data, style, className, key)
    case 'wedding-card-028':
      return renderWeddingCardTemplate028(component as any, data, style, className, key)
    case 'wedding-card-029':
      return renderWeddingCardTemplate029(component as any, data, style, className, key)
    case 'wedding-card-030':
      return renderWeddingCardTemplate030(component as any, data, style, className, key)
    case 'wedding-card-031':
      return renderWeddingCardTemplate031(component as any, data, style, className, key)
    case 'wedding-card-032':
      return renderWeddingCardTemplate032(component as any, data, style, className, key)
    case 'wedding-card-033':
      return renderWeddingCardTemplate033(component as any, data, style, className, key)
    case 'wedding-card-034':
      return renderWeddingCardTemplate034(component as any, data, style, className, key)
    case 'wedding-card-035':
      return renderWeddingCardTemplate035(component as any, data, style, className, key)
    case 'wedding-card-036':
      return renderWeddingCardTemplate036(component as any, data, style, className, key)
    case 'wedding-card-037':
      return renderWeddingCardTemplate037(component as any, data, style, className, key)
    case 'wedding-card-038':
      return renderWeddingCardTemplate038(component as any, data, style, className, key)
    case 'wedding-card-039':
      return renderWeddingCardTemplate039(component as any, data, style, className, key)
    case 'wedding-card-040':
      return renderWeddingCardTemplate040(component as any, data, style, className, key)
    case 'wedding-card-041':
      return renderWeddingCardTemplate041(component as any, data, style, className, key)
    case 'wedding-card-042':
      return renderWeddingCardTemplate042(component as any, data, style, className, key)
    case 'wedding-card-043':
      return renderWeddingCardTemplate043(component as any, data, style, className, key)
    case 'wedding-card-044':
      return renderWeddingCardTemplate044(component as any, data, style, className, key)
    case 'wedding-card-045':
      return renderWeddingCardTemplate045(component as any, data, style, className, key)
    case 'wedding-card-046':
      return renderWeddingCardTemplate046(component as any, data, style, className, key)
    case 'wedding-card-047':
      return renderWeddingCardTemplate047(component as any, data, style, className, key)
    case 'wedding-card-048':
      return renderWeddingCardTemplate048(component as any, data, style, className, key)
    case 'wedding-card-049':
      return renderWeddingCardTemplate049(component as any, data, style, className, key)
    default:
      console.warn(`Unknown template id: ${templateId}`)
      return null
  }
}

/**
 * Page Renderer
 */
export interface ServerDrivenUIRendererProps {
  schema: PageSchema
}

export default function ServerDrivenUIRenderer({ schema }: ServerDrivenUIRendererProps) {
  const globalStyle = styleToCSS(schema.globalStyles)

  return (
    <div style={globalStyle}>
      {schema.components.map((component, index) =>
        renderComponent(component, schema.data, `root-${index}`)
      )}
    </div>
  )
}
