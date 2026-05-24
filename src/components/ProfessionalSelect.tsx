import { api } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import { formatDayOfWeek } from '../utils/formatting'
import type { Professional } from '../types'

interface Props {
  value: string
  onChange: (id: string) => void
}

export function ProfessionalSelect({ value, onChange }: Props) {
  const { data: professionals, loading, error } = useFetch<Professional[]>(api.professionals.list)

  if (loading) return <p>Carregando profissionais...</p>
  if (error) return <p>Erro ao carregar profissionais</p>

  return (
    <div>
      <label htmlFor="professional">Profissional</label>
      <select
        id="professional"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Selecione...</option>
        {professionals?.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name} — {p.availability.map((a) => formatDayOfWeek(a.dayOfWeek)).join(', ')}
          </option>
        ))}
      </select>
    </div>
  )
}
