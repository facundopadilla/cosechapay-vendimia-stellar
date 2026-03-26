import type { PaymentStatus } from '@/types/payment'
import { Badge } from '@/components/ui/badge'

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' }
> = {
  draft:      { label: 'Borrador',    variant: 'neutral' },
  submitting: { label: 'Enviando…',   variant: 'info' },
  locked:     { label: 'Bloqueado',   variant: 'warning' },
  claiming:   { label: 'Reclamando…', variant: 'info' },
  claimed:    { label: 'Reclamado',   variant: 'success' },
  failed:     { label: 'Fallido',     variant: 'danger' },
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}
