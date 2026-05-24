interface Props {
  value: string
  onChange: (datetime: string) => void
  minDate?: string
}

export function TimeSlotSelect({ value, onChange, minDate }: Props) {
  const min = minDate ?? new Date().toISOString().slice(0, 16)

  return (
    <div>
      <label htmlFor="scheduledAt">Data e Horário</label>
      <input
        id="scheduledAt"
        type="datetime-local"
        value={value}
        min={min}
        onChange={(e) => {
          // Convert local datetime to ISO with offset
          const local = new Date(e.target.value)
          onChange(local.toISOString())
        }}
        required
      />
    </div>
  )
}
