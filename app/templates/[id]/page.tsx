import TemplatePageClient from './TemplatePageClient'

// Static export를 위한 generateStaticParams
export function generateStaticParams() {
  return [
    { id: 'wedding-card-001' },
    { id: 'wedding-card-002' },
    { id: 'wedding-card-003' },
    { id: 'wedding-card-004' },
    { id: 'wedding-card-005' },
    { id: 'wedding-card-006' },
    { id: 'wedding-card-007' },
    { id: 'wedding-card-008' },
    { id: 'wedding-card-009' },
    { id: 'wedding-card-010' },
    { id: 'wedding-card-011' },
    { id: 'wedding-card-012' },
    { id: 'wedding-card-013' },
    { id: 'wedding-card-014' },
    { id: 'wedding-card-015' },
    { id: 'wedding-card-016' },
    { id: 'wedding-card-017' },
    { id: 'wedding-card-018' },
    { id: 'wedding-card-019' },
    { id: 'wedding-card-020' },
    { id: 'wedding-card-021' },
    { id: 'wedding-card-022' },
    { id: 'wedding-card-023' },
    { id: 'wedding-card-024' },
    { id: 'wedding-card-025' },
    { id: 'wedding-card-026' },
    { id: 'wedding-card-027' },
    { id: 'wedding-card-028' },
    { id: 'wedding-card-029' },
    { id: 'wedding-card-030' },
    { id: 'wedding-card-031' },
    { id: 'wedding-card-032' },
    { id: 'wedding-card-033' },
    { id: 'wedding-card-034' },
    { id: 'wedding-card-035' },
    { id: 'wedding-card-036' },
    { id: 'wedding-card-037' }
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
