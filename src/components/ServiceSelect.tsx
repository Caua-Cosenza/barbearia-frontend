import { api } from '../api/endpoints'
import { useFetch } from '../hooks/useFetch'
import { formatDuration } from '../utils/formatting'
import type { Service } from '../types'

interface Props {
  value: string
  onChange: (id: string) => void
}

export function ServiceSelect({ value, onChange }: Props) {
  const { data: services, loading, error } = useFetch<Service[]>(api.services.list)

  if (loading) return <p>Carregando serviços...</p>
  if (error) return <p>Erro ao carregar serviços</p>

  return (
    <div>
      <label htmlFor="service">Serviço</label>
      <select
        id="service"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Selecione...</option>
        {services?.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({formatDuration(s.durationMinutes)})
          </option>
        ))}
      </select>
    </div>
  )
}
