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
  | 'template'
  | 'wedding-card-template-001'
  | 'wedding-card-template-002'
  | 'wedding-card-template-003'
  | 'wedding-card-template-004'
  | 'wedding-card-template-005'
  | 'wedding-card-template-006'
  | 'wedding-card-template-007'
  | 'wedding-card-template-008'
  | 'wedding-card-template-009'
  | 'wedding-card-template-010'
  | 'wedding-card-template-011'
  | 'wedding-card-template-012'
  | 'wedding-card-template-013'
  | 'wedding-card-template-015'
  | 'wedding-card-template-016';

export type LayoutType = 'flex' | 'grid' | 'absolute' | 'relative';

/**
 * Layout Element Type
 * JSON 스키마의 layout 객체에서 사용되는 요소 타입
 */
export type LayoutElementType =
  | 'text'       // 텍스트 요소 (이름, 날짜, 장소 등)
  | 'image'      // 이미지 요소 (사진, 배경, 장식 이미지 등)
  | 'vector'     // SVG 벡터 요소 (아이콘, 구분선 등)
  | 'container'  // 컨테이너 요소 (여러 요소를 감싸는 그룹)
  | 'background'; // 배경 요소 (전체 배경)

export type AlignItems = 'start' | 'center' | 'end' | 'stretch';
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around';

// ============================================================================
// 1.5. Layout Element (for JSON Schema)
// ============================================================================

/**
 * 기본 Layout 요소 속성
 */
export interface BaseLayoutElement {
  type: LayoutElementType;
  x: number;
  y: number;
  width?: number | 'auto';
  height?: number;
  zIndex: number;
  editable: boolean;
}

/**
 * 텍스트 Layout 요소
 */
export interface TextLayoutElement extends BaseLayoutElement {
  type: 'text';
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

/**
 * 이미지 Layout 요소
 */
export interface ImageLayoutElement extends BaseLayoutElement {
  type: 'image';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

/**
 * 벡터 Layout 요소
 */
export interface VectorLayoutElement extends BaseLayoutElement {
  type: 'vector';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * 컨테이너 Layout 요소
 */
export interface ContainerLayoutElement extends BaseLayoutElement {
  type: 'container';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
}

/**
 * 배경 Layout 요소
 */
export interface BackgroundLayoutElement extends BaseLayoutElement {
  type: 'background';
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
}

/**
 * Layout 요소 Union Type
 */
export type LayoutElement =
  | TextLayoutElement
  | ImageLayoutElement
  | VectorLayoutElement
  | ContainerLayoutElement
  | BackgroundLayoutElement;

/**
 * Layout 스키마 구조
 */
export interface LayoutSchema {
  baseSize?: {
    width: number;
    height: number;
  };
  [elementName: string]: LayoutElement | { width: number; height: number } | undefined;
}

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

export interface TemplateComponent extends BaseComponent {
  type: 'template';
  data: Record<string, any>;
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

export interface WeddingCardTemplate002Component extends BaseComponent {
  type: 'wedding-card-template-002';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    photo: JSONPathExpression;
    cardBackground?: JSONPathExpression;
    decoration?: JSONPathExpression;
    dateDivider?: JSONPathExpression;
    dday?: JSONPathExpression;
    dateMonth?: JSONPathExpression;
    dateDay?: JSONPathExpression;
    dateEnglish?: JSONPathExpression;
    dateKorean?: JSONPathExpression;
    groomLabel?: JSONPathExpression;
    brideLabel?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate003Component extends BaseComponent {
  type: 'wedding-card-template-003';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    photo: JSONPathExpression;
    cardBackground?: JSONPathExpression;
    decoration?: JSONPathExpression;
    title?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate004Component extends BaseComponent {
  type: 'wedding-card-template-004';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    photo: JSONPathExpression;
    decoration?: JSONPathExpression;
    separator?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate005Component extends BaseComponent {
  type: 'wedding-card-template-005';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
    decorationFrame?: JSONPathExpression;
    decoration?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate006Component extends BaseComponent {
  type: 'wedding-card-template-006';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    title?: JSONPathExpression;
    separator?: JSONPathExpression;
    cardBackground?: JSONPathExpression;
    decoration?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate007Component extends BaseComponent {
  type: 'wedding-card-template-007';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    groomLabel?: JSONPathExpression;
    brideLabel?: JSONPathExpression;
    cardBackground?: JSONPathExpression;
    decoration?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate008Component extends BaseComponent {
  type: 'wedding-card-template-008';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    dday?: JSONPathExpression;
    mainText?: JSONPathExpression;
    cardBackground?: JSONPathExpression;
    decoration?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate009Component extends BaseComponent {
  type: 'wedding-card-template-009';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    groomLabel?: JSONPathExpression;
    brideLabel?: JSONPathExpression;
    photo?: JSONPathExpression;
    cardBackground?: JSONPathExpression;
    decoration?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate010Component extends BaseComponent {
  type: 'wedding-card-template-010';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    title?: JSONPathExpression;
    separator?: JSONPathExpression;
    photo?: JSONPathExpression;
    cardBackground?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate011Component extends BaseComponent {
  type: 'wedding-card-template-011';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    decoration?: JSONPathExpression;
    cardBackground?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate012Component extends BaseComponent {
  type: 'wedding-card-template-012';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate013Component extends BaseComponent {
  type: 'wedding-card-template-013';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate015Component extends BaseComponent {
  type: 'wedding-card-template-015';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
  };
}

export interface WeddingCardTemplate016Component extends BaseComponent {
  type: 'wedding-card-template-016';
  data: {
    groom: JSONPathExpression;
    bride: JSONPathExpression;
    date: JSONPathExpression;
    venue: JSONPathExpression;
    backgroundImage?: JSONPathExpression;
  };
}

export type Component =
  | TextComponent
  | ImageComponent
  | ButtonComponent
  | ContainerComponent
  | CardComponent
  | TemplateComponent
  | WeddingCardTemplate001Component
  | WeddingCardTemplate002Component
  | WeddingCardTemplate003Component
  | WeddingCardTemplate004Component
  | WeddingCardTemplate005Component
  | WeddingCardTemplate006Component
  | WeddingCardTemplate007Component
  | WeddingCardTemplate008Component
  | WeddingCardTemplate009Component
  | WeddingCardTemplate010Component
  | WeddingCardTemplate011Component
  | WeddingCardTemplate012Component
  | WeddingCardTemplate013Component
  | WeddingCardTemplate015Component
  | WeddingCardTemplate016Component;

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
