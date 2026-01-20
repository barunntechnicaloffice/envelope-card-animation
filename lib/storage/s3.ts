/**
 * AWS S3 스토리지 (bdc-web 백오피스 참고)
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import path from 'path'

// S3 설정
const s3Config = {
  region: process.env.AWS_REGION || 'ap-northeast-2',
  bucket: process.env.AWS_S3_BUCKET || '',
  prefix: process.env.AWS_S3_PREFIX || 'card-templates',
  cloudFrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN || '',
}

// S3 클라이언트 (싱글톤)
let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: s3Config.region,
    })
  }
  return s3Client
}

// 지원하는 이미지 확장자
const imageExtensions: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
}

export interface UploadResult {
  key: string
  url: string
  cdnUrl?: string
  size: number
  mimeType: string
  fileName: string
}

/**
 * S3에 파일 업로드
 */
export async function uploadToS3(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  folder: string
): Promise<UploadResult> {
  if (!s3Config.bucket) {
    throw new Error('AWS_S3_BUCKET이 설정되지 않았습니다.')
  }

  const client = getS3Client()

  // 파일 확장자 추출
  const extFromName = path.extname(originalName).toLowerCase()
  const extension = extFromName || imageExtensions[mimeType] || '.png'

  // 안전한 파일명 생성
  const baseName = path.basename(originalName, extension)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9_-]/g, '')
  const safeBaseName = baseName || 'upload'

  // 고유한 파일명 생성
  const timestamp = new Date().toISOString().replace(/[:.]/g, '')
  const uuid = randomUUID().slice(0, 8)
  const fileName = `${timestamp}-${uuid}-${safeBaseName}${extension}`

  // S3 키 생성
  const key = `${s3Config.prefix}/${folder}/${fileName}`

  // S3에 업로드
  await client.send(
    new PutObjectCommand({
      Bucket: s3Config.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  )

  // URL 생성
  const s3Url = `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/${key}`
  const cdnUrl = s3Config.cloudFrontDomain
    ? `https://${s3Config.cloudFrontDomain.replace(/^https?:\/\//, '')}/${key}`
    : undefined

  return {
    key,
    url: cdnUrl || s3Url, // CDN 있으면 CDN URL 사용
    cdnUrl,
    size: buffer.length,
    mimeType,
    fileName: originalName,
  }
}

/**
 * S3에서 파일 삭제
 */
export async function deleteFromS3(key: string): Promise<void> {
  if (!s3Config.bucket) {
    throw new Error('AWS_S3_BUCKET이 설정되지 않았습니다.')
  }

  const client = getS3Client()

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: s3Config.bucket,
        Key: key,
      })
    )
  } catch (error) {
    console.warn('S3 삭제 실패:', error)
    // 삭제 실패는 에러를 던지지 않음 (파일이 이미 없을 수 있음)
  }
}

/**
 * S3 사용 여부 확인
 */
export function isS3Enabled(): boolean {
  return process.env.USE_S3 === 'true' && Boolean(s3Config.bucket)
}
