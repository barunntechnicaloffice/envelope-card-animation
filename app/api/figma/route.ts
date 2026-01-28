import { NextRequest, NextResponse } from 'next/server'

interface FigmaNode {
  id: string
  name: string
  type: string
  absoluteBoundingBox?: {
    x: number
    y: number
    width: number
    height: number
  }
  style?: {
    fontFamily?: string
    fontSize?: number
    fontWeight?: number
    letterSpacing?: number
    lineHeightPx?: number
    textAlignHorizontal?: string
    textCase?: 'ORIGINAL' | 'UPPER' | 'LOWER' | 'TITLE'
  }
  fills?: Array<{
    type: string
    color?: {
      r: number
      g: number
      b: number
      a?: number
    }
  }>
  characters?: string
  children?: FigmaNode[]
}

interface ParsedElement {
  id: string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  color?: string
  textAlign?: string
  letterSpacing?: number
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  characters?: string
}

// Figma 색상을 HEX로 변환
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Figma 노드를 재귀적으로 파싱
function parseNode(node: FigmaNode, elements: ParsedElement[]): void {
  // 기본 요소 정보
  if (node.absoluteBoundingBox) {
    const element: ParsedElement = {
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.absoluteBoundingBox.x,
      y: node.absoluteBoundingBox.y,
      width: node.absoluteBoundingBox.width,
      height: node.absoluteBoundingBox.height,
    }

    // 텍스트 스타일
    if (node.type === 'TEXT' && node.style) {
      element.fontSize = node.style.fontSize
      element.fontFamily = node.style.fontFamily
      element.fontWeight = node.style.fontWeight
      element.letterSpacing = node.style.letterSpacing
      element.textAlign = node.style.textAlignHorizontal?.toLowerCase()
      element.characters = node.characters

      // textCase → textTransform 변환
      if (node.style.textCase) {
        const textCaseMap: Record<string, 'none' | 'uppercase' | 'lowercase' | 'capitalize'> = {
          'ORIGINAL': 'none',
          'UPPER': 'uppercase',
          'LOWER': 'lowercase',
          'TITLE': 'capitalize'
        }
        element.textTransform = textCaseMap[node.style.textCase] || 'none'
      }
    }

    // 색상 추출 (fills에서)
    if (node.fills && node.fills.length > 0) {
      const solidFill = node.fills.find(f => f.type === 'SOLID' && f.color)
      if (solidFill?.color) {
        element.color = rgbToHex(
          solidFill.color.r,
          solidFill.color.g,
          solidFill.color.b
        )
      }
    }

    elements.push(element)
  }

  // 자식 노드 재귀 파싱
  if (node.children) {
    for (const child of node.children) {
      parseNode(child, elements)
    }
  }
}

// BG 요소 찾기
function findBgElement(elements: ParsedElement[]): ParsedElement | null {
  // 정확히 일치하는 것 먼저 찾기
  const exactMatch = elements.find(el => {
    const name = el.name.toLowerCase().replace(/\s*\[.*?\]\s*/g, '').trim()
    return name === 'bg' || name === 'background'
  })
  if (exactMatch) return exactMatch

  // 이름에 bg 또는 background 포함하는 것 찾기
  const partialMatch = elements.find(el => {
    const name = el.name.toLowerCase()
    return name.includes('bg') || name.includes('background')
  })
  if (partialMatch) return partialMatch

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { fileKey, nodeId, apiKey } = await request.json()

    // 환경변수에서 토큰 읽기 (클라이언트에서 전달한 값이 있으면 그것 사용)
    const figmaToken = apiKey || process.env.FIGMA_ACCESS_TOKEN

    if (!fileKey || !nodeId) {
      return NextResponse.json(
        { error: 'fileKey, nodeId가 필요합니다.' },
        { status: 400 }
      )
    }

    if (!figmaToken) {
      return NextResponse.json(
        { error: 'Figma API 토큰이 설정되지 않았습니다. 서버 환경변수를 확인해주세요.' },
        { status: 400 }
      )
    }

    // Node ID 형식 변환 (46-1150 → 46:1150)
    const formattedNodeId = nodeId.replace('-', ':')

    // Figma API 호출
    const figmaUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(formattedNodeId)}`

    const response = await fetch(figmaUrl, {
      headers: {
        'X-Figma-Token': figmaToken,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Figma API Error:', errorText)

      if (response.status === 403) {
        return NextResponse.json(
          { error: 'Figma API 키가 유효하지 않습니다. 설정에서 API 키를 확인해주세요.' },
          { status: 403 }
        )
      }
      if (response.status === 404) {
        return NextResponse.json(
          { error: '파일 또는 노드를 찾을 수 없습니다. File Key와 Node ID를 확인해주세요.' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { error: `Figma API 오류: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()

    // 노드 데이터 추출
    const nodeData = data.nodes[formattedNodeId]
    if (!nodeData || !nodeData.document) {
      return NextResponse.json(
        { error: '노드 데이터를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    const rootNode: FigmaNode = nodeData.document

    // 모든 요소 파싱
    const elements: ParsedElement[] = []
    parseNode(rootNode, elements)

    // BG 요소 찾기 (없으면 루트 노드 좌표 사용)
    const bgElement = findBgElement(elements)
    const bgOffset = bgElement
      ? { x: bgElement.x, y: bgElement.y }
      : rootNode.absoluteBoundingBox
        ? { x: rootNode.absoluteBoundingBox.x, y: rootNode.absoluteBoundingBox.y }
        : { x: 0, y: 0 }

    // baseSize 계산 (BG 또는 루트 노드 기준)
    const baseSize = bgElement
      ? { width: bgElement.width, height: bgElement.height }
      : rootNode.absoluteBoundingBox
        ? { width: rootNode.absoluteBoundingBox.width, height: rootNode.absoluteBoundingBox.height }
        : { width: 335, height: 515 }

    return NextResponse.json({
      success: true,
      data: {
        nodeName: rootNode.name,
        nodeType: rootNode.type,
        elements,
        bgOffset,
        baseSize,
        totalElements: elements.length,
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
