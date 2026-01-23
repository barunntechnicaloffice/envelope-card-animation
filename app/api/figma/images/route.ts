import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { uploadToS3, isS3Enabled } from '@/lib/storage/s3'

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

export async function POST(request: NextRequest) {
  try {
    const { fileKey, nodeId, apiKey, templateId } = await request.json()

    // 환경변수에서 토큰 읽기 (클라이언트에서 전달한 값이 있으면 그것 사용)
    const figmaToken = apiKey || process.env.FIGMA_ACCESS_TOKEN

    if (!fileKey || !nodeId || !templateId) {
      return NextResponse.json(
        { error: 'fileKey, nodeId, templateId가 필요합니다.' },
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

    // 1. 먼저 노드의 자식들 가져오기 (이미지 노드 ID 수집용)
    const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(formattedNodeId)}`

    const nodesResponse = await fetch(nodesUrl, {
      headers: { 'X-Figma-Token': figmaToken },
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
    // 중복 방지를 위한 Set (이름 기준)
    const exportedNames = new Set<string>()

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
        if (!exportedNames.has('card-main-bg')) {
          console.log(`  → Found BG node: ${node.id}`)
          nodesToExport.push({
            id: node.id,
            name: 'card-main-bg',
            type: 'bg'
          })
          exportedNames.add('card-main-bg')
        }
      }
      // photo 노드 (vector, rectangle, frame 등 모든 타입)
      else if (cleanName.includes('photo') || cleanName.includes('image')) {
        if (!exportedNames.has('photo')) {
          console.log(`  → Found photo node: ${node.id}`)
          nodesToExport.push({
            id: node.id,
            name: 'photo',
            type: 'photo'
          })
          exportedNames.add('photo')
        }
      }
      // decoration 노드 (SVG/벡터 장식)
      // decoration, decoration1, decoration2, decoration 1, Decoration_01 등 다양한 형식 지원
      else if (cleanName.includes('decoration') || cleanName.includes('ornament')) {
        // 공백, 언더스코어를 제거하고 숫자만 추출
        const numMatch = cleanName.match(/(\d+)/)
        const num = numMatch ? numMatch[1] : ''
        // decoration1, decoration2 형식으로 통일
        const decoName = num ? `decoration${num}` : 'decoration'

        if (!exportedNames.has(decoName)) {
          console.log(`  → Found decoration node: ${node.id} as ${decoName}`)
          nodesToExport.push({
            id: node.id,
            name: decoName,
            type: 'decoration'
          })
          exportedNames.add(decoName)
        }
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
      headers: { 'X-Figma-Token': figmaToken },
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

    // 4. 이미지 다운로드 및 저장 (S3 또는 로컬)
    const savedImages: { name: string; path: string; type: string; storage: string }[] = []
    const useS3 = isS3Enabled()

    // 로컬 저장 시에만 폴더 생성
    if (!useS3) {
      const templateAssetsDir = path.join(ASSETS_DIR, templateId)
      if (!existsSync(templateAssetsDir)) {
        await mkdir(templateAssetsDir, { recursive: true })
      }
    }

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

        if (useS3) {
          // S3에 업로드
          // folder: assets/{templateId} → S3 경로: {prefix}/assets/{templateId}/{fileName}
          const s3Result = await uploadToS3(
            buffer,
            fileName,
            'image/png',
            `assets/${templateId}`  // assets/ prefix 추가
          )

          savedImages.push({
            name: fileName,
            path: s3Result.url,  // S3/CloudFront URL
            type: nodeInfo.type,
            storage: 's3'
          })

          console.log(`Uploaded to S3: ${fileName} -> ${s3Result.url}`)
        } else {
          // 로컬에 저장
          const templateAssetsDir = path.join(ASSETS_DIR, templateId)
          const filePath = path.join(templateAssetsDir, fileName)
          await writeFile(filePath, buffer)

          savedImages.push({
            name: fileName,
            path: `/assets/${templateId}/${fileName}`,
            type: nodeInfo.type,
            storage: 'local'
          })

          console.log(`Saved locally: ${fileName}`)
        }
      } catch (err) {
        console.error(`Failed to save image for node ${exportNodeId}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${savedImages.length}개 이미지가 ${useS3 ? 'S3에' : '로컬에'} 저장되었습니다.`,
      images: savedImages,
      assetsPath: useS3 ? `S3/${templateId}/` : `/assets/${templateId}/`,
      storage: useS3 ? 's3' : 'local'
    })

  } catch (error) {
    console.error('Image download error:', error)
    return NextResponse.json(
      { error: '이미지 다운로드에 실패했습니다.' },
      { status: 500 }
    )
  }
}
