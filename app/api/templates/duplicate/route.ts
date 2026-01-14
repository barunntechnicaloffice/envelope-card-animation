import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir, copyFile, readdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const TEMPLATES_DIR = path.join(process.cwd(), 'public', 'templates')
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sourceTemplateId, newTemplateId, newName } = body

    if (!sourceTemplateId || !newTemplateId || !newName) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 원본 템플릿 파일 읽기
    const sourcePath = path.join(TEMPLATES_DIR, `${sourceTemplateId}.json`)
    if (!existsSync(sourcePath)) {
      return NextResponse.json(
        { error: '원본 템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 새 템플릿 ID 중복 체크
    const newPath = path.join(TEMPLATES_DIR, `${newTemplateId}.json`)
    if (existsSync(newPath)) {
      return NextResponse.json(
        { error: '이미 존재하는 템플릿 ID입니다.' },
        { status: 409 }
      )
    }

    // 원본 JSON 읽기
    const sourceContent = await readFile(sourcePath, 'utf-8')
    const sourceData = JSON.parse(sourceContent)

    // 새 템플릿 데이터 생성
    const newData = {
      ...sourceData,
      id: newTemplateId,
      name: newName,
      // 에셋 경로 업데이트
      thumbnail: sourceData.thumbnail?.replace(sourceTemplateId, newTemplateId),
      set: sourceData.set ? {
        envelope: sourceData.set.envelope ? {
          pattern: sourceData.set.envelope.pattern?.replace(sourceTemplateId, newTemplateId),
          seal: sourceData.set.envelope.seal?.replace(sourceTemplateId, newTemplateId),
          lining: sourceData.set.envelope.lining?.replace(sourceTemplateId, newTemplateId),
        } : undefined,
        page: sourceData.set.page ? {
          background: sourceData.set.page.background?.replace(sourceTemplateId, newTemplateId),
        } : undefined,
        cards: sourceData.set.cards ? {
          main: sourceData.set.cards.main?.replace(sourceTemplateId, newTemplateId),
          default: sourceData.set.cards.default?.replace(sourceTemplateId, newTemplateId),
          background: sourceData.set.cards.background?.replace(sourceTemplateId, newTemplateId),
        } : undefined,
      } : undefined,
      data: sourceData.data ? {
        ...sourceData.data,
        wedding: sourceData.data.wedding ? {
          ...sourceData.data.wedding,
          photo: sourceData.data.wedding.photo?.replace(sourceTemplateId, newTemplateId),
          cardBackground: sourceData.data.wedding.cardBackground?.replace(sourceTemplateId, newTemplateId),
          decoration: sourceData.data.wedding.decoration?.replace(sourceTemplateId, newTemplateId),
        } : undefined,
      } : undefined,
    }

    // 새 JSON 파일 저장
    await writeFile(newPath, JSON.stringify(newData, null, 2), 'utf-8')

    // 에셋 폴더 복제 (있으면)
    const sourceAssetsDir = path.join(ASSETS_DIR, sourceTemplateId)
    const newAssetsDir = path.join(ASSETS_DIR, newTemplateId)

    if (existsSync(sourceAssetsDir)) {
      // 새 에셋 폴더 생성
      await mkdir(newAssetsDir, { recursive: true })

      // 모든 파일 복사
      const files = await readdir(sourceAssetsDir)
      for (const file of files) {
        const srcFile = path.join(sourceAssetsDir, file)
        const destFile = path.join(newAssetsDir, file)
        await copyFile(srcFile, destFile)
      }
    }

    return NextResponse.json({
      success: true,
      templateId: newTemplateId,
      message: '템플릿이 복제되었습니다.',
    })

  } catch (error) {
    console.error('Template duplicate error:', error)
    return NextResponse.json(
      { error: '템플릿 복제에 실패했습니다.' },
      { status: 500 }
    )
  }
}
