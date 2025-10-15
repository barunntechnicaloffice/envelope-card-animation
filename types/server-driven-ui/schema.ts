/**
 * Server-Driven UI JSON Schema
 * JSONPath 기반 동적 데이터 바인딩 시스템
 */

// ============================================================================
// 1. Component Types
// ============================================================================

export type ComponentType =
  | 'container'
  | 'text'
  | 'image'
  | 'button'
  | 'card'
  | 'wedding-card-template-001';

export type LayoutType = 'flex' | 'grid' | 'absolute' | 'relative';

export type AlignItems = 'start' | 'center' | 'end' | 'stretch';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around';

// ============================================================================
// 2. Style System
// ============================================================================

export interface StyleProps {
  // Layout
  layout?: LayoutType;
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  // Flexbox
  flexDirection?: 'row' | 'column';
  alignItems?: AlignItems;
  justifyContent?: JustifyContent;
  gap?: string | number;

  // Spacing
  padding?: string | number;
  paddingX?: string | number;
  paddingY?: string | number;
  margin?: string | number;
  marginX?: string | number;
  marginY?: string | number;

  // Position
  position?: 'absolute' | 'relative' | 'fixed';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;

  // Visual
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  border?: string;
  borderRadius?: string | number;
  opacity?: number;

  // Typography
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;

  // Transform
  transform?: string;
  rotate?: string | number;
  scale?: number;
  translateX?: string | number;
  translateY?: string | number;

  // Shadow
  boxShadow?: string;

  // Custom CSS
  className?: string;
}

// ============================================================================
// 3. Data Binding with JSONPath
// ============================================================================

/**
 * JSONPath 표현식
 * 예: "$.data.groom", "$.data.wedding.venue"
 */
export type JSONPathExpression = string;

/**
 * 바인딩 타입
 */
export type BindingType = 'text' | 'src' | 'href' | 'style' | 'visibility' | 'className';

/**
 * 단일 데이터 바인딩
 */
export interface DataBinding {
  type: BindingType;
  path: JSONPathExpression;
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'date-format' | 'number-format';
  fallback?: any;
}

/**
 * 조건부 렌더링
 */
export interface ConditionalRendering {
  condition: JSONPathExpression;
  operator?: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'exists' | 'not-exists';
  value?: any;
}

// ============================================================================
// 4. Component Base
// ============================================================================

export interface BaseComponent {
  id: string;
  type: ComponentType;
  style?: StyleProps;
  dataBindings?: DataBinding[];
  conditional?: ConditionalRendering;
  children?: Component[];
}

// ============================================================================
// 5. Specific Components
// ============================================================================

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string | JSONPathExpression;
  html?: boolean;
}

export interface ImageComponent extends BaseComponent {
  type: 'image';
  src: string | JSONPathExpression;
  alt?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

export interface ButtonComponent extends BaseComponent {
  type: 'button';
  label: string | JSONPathExpression;
  onClick?: {
    action: 'navigate' | 'open-url' | 'api-call' | 'custom';
    target?: string;
    params?: Record<string, any>;
  };
}

export interface ContainerComponent extends BaseComponent {
  type: 'container';
  children: Component[];
}

export interface CardComponent extends BaseComponent {
  type: 'card';
  children: Component[];
}

export interface WeddingCardTemplate001Component extends BaseComponent {
  type: 'wedding-card-template-001';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    photo: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
    decorationImage?: JSONPathExpression;
  };
}

export type Component =
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | ContainerComponent
  | CardComponent
  | WeddingCardTemplate001Component;

// ============================================================================
// 6. Page Schema
// ============================================================================

export interface PageSchema {
  id: string;
  version: string;
  name: string;
  description?: string;

  // 메타데이터
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    og?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };

  // 전역 데이터
  data: Record<string, any>;

  // 컴포넌트 트리
  components: Component[];

  // 전역 스타일
  globalStyles?: StyleProps;

  // API 엔드포인트 (동적 데이터 로딩용)
  apiEndpoint?: string;
}

// ============================================================================
// 7. Template Registry
// ============================================================================

export interface TemplateDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  thumbnail?: string;
  category: 'wedding' | 'birthday' | 'event' | 'general';
  schema: PageSchema;
}

export interface TemplateRegistry {
  templates: TemplateDefinition[];
}
