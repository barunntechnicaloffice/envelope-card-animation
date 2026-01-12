import TemplatePageClient from './TemplatePageClient'

// Static export를 위한 generateStaticParams
// 001~100까지 동적 생성
export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `wedding-card-${String(i + 1).padStart(3, '0')}`
  }))
}

export default async function TemplatePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TemplatePageClient templateId={id} />
}
