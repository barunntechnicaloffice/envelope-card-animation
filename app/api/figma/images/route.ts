import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

export async function POST(request: NextRequest) {
  try {
    const { fileKey, nodeId, apiKey, templateId } = await request.json()

    if (!fileKey || !nodeId || !apiKey || !templateId) {
      return NextResponse.json(
        { error: 'fileKey, nodeId, apiKey, templateId가 모두 필요합니다.' },
        { status: 400 }
      )
    }

    // Node ID 형식 변환 (46-1150 → 46:1150)
    const formattedNodeId = nodeId.replace('-', ':')

    // 1. 먼저 노드의 자식들 가져오기 (이미지 노드 ID 수집용)
    const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(formattedNodeId)}`

    const nodesResponse = await fetch(nodesUrl, {
      headers: { 'X-Figma-Token': apiKey },
    })

    if (!nodesResponse.ok) {
      return NextResponse.json(
        { error: 'Figma 노드 정보를 가져오는데 실패했습니다.' },
        { status: nodesResponse.status }
      )
    }

    const nodesData = await nodesResponse.json()
    const rootNode = nodesData.nodes[formattedNodeId]?.document

    if (!rootNode) {
      return NextResponse.json(
        { error: '노드를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 이미지로 내보낼 노드 수집: { nodeId, name, type }
    interface NodeToExport {
      id: string
      name: string
      type: 'frame' | 'bg' | 'photo' | 'decoration' | 'other'
    }

    const nodesToExport: NodeToExport[] = []

    // 이미지로 내보낼 노드 찾기 (BG, photo, decoration 등)
    function findImageNodes(node: any, depth: number = 0) {
      const nodeName = node.name || ''
      const nameLower = nodeName.toLowerCase()
      const nodeType = node.type || 'unknown'

      // 디버그 로그
      console.log(`${'  '.repeat(depth)}[${nodeType}] "${nodeName}" (id: ${node.id})`)

      // [locked], [editable] 태그 제거 (공백 유무 모두 처리)
      const cleanName = nameLower
        .replace(/\s*\[locked\]\s*/gi, '')
        .replace(/\s*\[editable\]\s*/gi, '')
        .trim()

      // BG 노드 → card-main-bg로 저장 (배경 이미지)
      if (cleanName === 'bg' || cleanName === 'background') {
        console.log(`  → Found BG node: ${node.id}`)
        nodesToExport.push({
          id: node.id,
          name: 'card-main-bg',
          type: 'bg'
        })
      }
      // photo 노드 (vector, rectangle, frame 등 모든 타입)
      else if (cleanName.includes('photo') || cleanName.includes('image')) {
        console.log(`  → Found photo node: ${node.id}`)
        nodesToExport.push({
          id: node.id,
          name: 'photo',
          type: 'photo'
        })
      }
      // decoration 노드 (SVG/벡터 장식)
      else if (cleanName.includes('decoration') || cleanName.includes('ornament')) {
        const decoName = cleanName.replace(/\s+/g, '-') || 'decoration'
        console.log(`  → Found decoration node: ${node.id} as ${decoName}`)
        nodesToExport.push({
          id: node.id,
          name: decoName,
          type: 'decoration'
        })
      }

      // 자식 노드 탐색
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child: any) => findImageNodes(child, depth + 1))
      }
    }
    findImageNodes(rootNode, 0)

    console.log('Nodes to export:', nodesToExport)

    // 2. Figma Images API로 이미지 URL 가져오기
    const idsParam = nodesToExport.map(n => n.id).join(',')
    const imagesUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(idsParam)}&format=png&scale=2`

    const imagesResponse = await fetch(imagesUrl, {
      headers: { 'X-Figma-Token': apiKey },
    })

    if (!imagesResponse.ok) {
      const errorText = await imagesResponse.text()
      console.error('Figma Images API Error:', errorText)
      return NextResponse.json(
        { error: 'Figma 이미지를 가져오는데 실패했습니다.' },
        { status: imagesResponse.status }
      )
    }

    const imagesData = await imagesResponse.json()

    if (imagesData.err) {
      return NextResponse.json(
        { error: `Figma 이미지 오류: ${imagesData.err}` },
        { status: 400 }
      )
    }

    // 3. 에셋 폴더 생성
    const templateAssetsDir = path.join(ASSETS_DIR, templateId)
    if (!existsSync(templateAssetsDir)) {
      await mkdir(templateAssetsDir, { recursive: true })
    }

    // 4. 이미지 다운로드 및 저장
    const savedImages: { name: string; path: string; type: string }[] = []

    for (const [exportNodeId, imageUrl] of Object.entries(imagesData.images)) {
      if (!imageUrl) continue

      // 해당 노드 정보 찾기
      const nodeInfo = nodesToExport.find(n => n.id === exportNodeId)
      if (!nodeInfo) continue

      try {
        const imgResponse = await fetch(imageUrl as string)
        if (!imgResponse.ok) continue

        const arrayBuffer = await imgResponse.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 파일명 결정
        const fileName = `${nodeInfo.name}.png`

        const filePath = path.join(templateAssetsDir, fileName)
        await writeFile(filePath, buffer)

        savedImages.push({
          name: fileName,
          path: `/assets/${templateId}/${fileName}`,
          type: nodeInfo.type
        })

        console.log(`Saved: ${fileName} (${nodeInfo.type})`)
      } catch (err) {
        console.error(`Failed to download image for node ${exportNodeId}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedImages.length}개 이미지가 저장되었습니다.`,
      images: savedImages,
      assetsPath: `/assets/${templateId}/`
    })

  } catch (error) {
    console.error('Image download error:', error)
    return NextResponse.json(
      { error: '이미지 다운로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}
