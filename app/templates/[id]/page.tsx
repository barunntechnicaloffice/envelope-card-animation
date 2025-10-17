import TemplatePageClient from './TemplatePageClient'

// Static export를 위한 generateStaticParams
export function generateStaticParams() {
  return [
    { id: 'wedding-card-001' },
    { id: 'wedding-card-002' }
  ]
}

export default function TemplatePage({ params }: { params: { id: string } }) {
  return <TemplatePageClient templateId={params.id} />
}
