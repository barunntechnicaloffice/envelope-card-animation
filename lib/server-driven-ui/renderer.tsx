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
  WeddingCardTemplate001Component,
  WeddingCardTemplate002Component,
  WeddingCardTemplate003Component,
  WeddingCardTemplate004Component,
  WeddingCardTemplate005Component,
  WeddingCardTemplate006Component,
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
