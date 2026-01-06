import TemplateEditClient from './TemplateEditClient'

// 정적 빌드를 위한 파라미터 생성
export function generateStaticParams() {
  const params = []

  // 50개 템플릿 + 추가 여유분
  for (let i = 1; i <= 60; i++) {
    params.push({ id: `wedding-card-${String(i).padStart(3, '0')}` })
  }

  return params
}

export default function TemplateEditPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  return <TemplateEditClient params={params} />
}
