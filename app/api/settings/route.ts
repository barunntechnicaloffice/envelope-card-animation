import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const SETTINGS_DIR = path.join(process.cwd(), '.admin')
const SETTINGS_FILE = path.join(SETTINGS_DIR, 'settings.json')

interface AdminSettings {
  figmaApiKey?: string
  defaultBaseSize: {
    width: number
    height: number
  }
  autoBackup: boolean
  darkMode: boolean
}

const DEFAULT_SETTINGS: AdminSettings = {
  figmaApiKey: '',
  defaultBaseSize: { width: 335, height: 515 },
  autoBackup: true,
  darkMode: false
}

// GET: 설정 조회
export async function GET() {
  try {
    if (!existsSync(SETTINGS_FILE)) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_SETTINGS
      })
    }

    const content = await readFile(SETTINGS_FILE, 'utf-8')
    const settings = JSON.parse(content)

    return NextResponse.json({
      success: true,
      settings: { ...DEFAULT_SETTINGS, ...settings }
    })
  } catch (error) {
    console.error('Settings read error:', error)
    return NextResponse.json({
      success: true,
      settings: DEFAULT_SETTINGS
    })
  }
}

// POST: 설정 저장
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!settings) {
      return NextResponse.json(
        { error: '설정 데이터가 없습니다.' },
        { status: 400 }
      )
    }

    // .admin 디렉토리 생성
    if (!existsSync(SETTINGS_DIR)) {
      await mkdir(SETTINGS_DIR, { recursive: true })
    }

    // 설정 저장
    const settingsToSave: AdminSettings = {
      figmaApiKey: settings.figmaApiKey || '',
      defaultBaseSize: settings.defaultBaseSize || DEFAULT_SETTINGS.defaultBaseSize,
      autoBackup: settings.autoBackup ?? DEFAULT_SETTINGS.autoBackup,
      darkMode: settings.darkMode ?? DEFAULT_SETTINGS.darkMode
    }

    await writeFile(SETTINGS_FILE, JSON.stringify(settingsToSave, null, 2))

    return NextResponse.json({
      success: true,
      message: '설정이 저장되었습니다.'
    })
  } catch (error) {
    console.error('Settings save error:', error)
    return NextResponse.json(
      { error: '설정 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}
