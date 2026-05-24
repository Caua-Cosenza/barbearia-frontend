export function LoadingSpinner() {
  return (
    <output className="flex items-center justify-center py-12" aria-label="Carregando">
      <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-violet-500 animate-spin" />
    </output>
  )
}
