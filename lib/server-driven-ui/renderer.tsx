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
  // JSONPath로 데이터 추출
  const groom = resolveJSONPath(data, component.data.groom) || '신랑'
  const bride = resolveJSONPath(data, component.data.bride) || '신부'
  const date = resolveJSONPath(data, component.data.date) || '날짜 미정'
  const venue = resolveJSONPath(data, component.data.venue) || '장소 미정'
  const photo = resolveJSONPath(data, component.data.photo) || '/placeholder.jpg'
  const backgroundImage = component.data.backgroundImage
    ? resolveJSONPath(data, component.data.backgroundImage)
    : undefined
  const decorationImage = component.data.decorationImage
    ? resolveJSONPath(data, component.data.decorationImage)
    : undefined

  return (
    <div
      key={key}
      style={{
        width: '320px',
        height: '580px',
        position: 'relative',
        backgroundColor: '#EFEEEB',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...style,
      }}
      className={className}
    >
      {/* 배경 이미지 */}
      {backgroundImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.95,
          }}
        />
      )}

      {/* 사진 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '282px',
          transform: 'translateX(-50%)',
          width: '233px',
          height: '257px',
          overflow: 'hidden',
        }}
      >
        <img
          src={photo}
          alt="Wedding Photo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* 장식 이미지 (중앙) */}
      {decorationImage && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '562px',
            transform: 'translateX(-50%)',
            width: '42px',
            height: '40px',
          }}
        >
          <img
            src={decorationImage}
            alt="Decoration"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* 신랑 이름 */}
      <p
        style={{
          position: 'absolute',
          left: '72px',
          top: '574px',
          fontFamily: "'NanumMyeongjo', serif",
          fontSize: '20px',
          color: '#333',
          letterSpacing: '-0.316px',
        }}
      >
        {groom}
      </p>

      {/* 신부 이름 */}
      <p
        style={{
          position: 'absolute',
          right: '71px',
          top: '574px',
          fontFamily: "'NanumMyeongjo', serif",
          fontSize: '20px',
          color: '#333',
          letterSpacing: '-0.316px',
          textAlign: 'right',
        }}
      >
        {bride}
      </p>

      {/* 날짜 및 장소 */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '616px',
          transform: 'translateX(-50%)',
          width: '177px',
          fontFamily: "'NanumMyeongjo', serif",
          fontSize: '12px',
          color: '#333',
          textAlign: 'center',
          lineHeight: '20px',
        }}
      >
        <p style={{ margin: 0 }}>{date}</p>
        <p style={{ margin: 0 }}>{venue}</p>
      </div>
    </div>
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
