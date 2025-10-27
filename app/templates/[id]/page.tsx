import TemplatePageClient from './TemplatePageClient'

// Static export를 위한 generateStaticParams
export function generateStaticParams() {
  return [
    { id: 'wedding-card-001' },
    { id: 'wedding-card-002' },
    { id: 'wedding-card-003' },
    { id: 'wedding-card-004' },
    { id: 'wedding-card-005' }
  ]
}

export default async function TemplatePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TemplatePageClient templateId={id} />
}
