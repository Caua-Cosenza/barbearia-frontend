interface Props {
  message: string | null
}

export function ErrorMessage({ message }: Props) {
  if (!message) return null
  return (
    <div role="alert" className="p-4 rounded-lg bg-red-900/30 border border-red-500/30 text-red-400 text-sm">
      {message}
    </div>
  )
}
