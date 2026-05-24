const STEPS = ['Profissional', 'Serviço', 'Data & Hora', 'Confirmação']

interface ProgressBarProps {
  currentStep: number
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="relative px-4">
        {/* Background connector line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-700" />
        {/* Active connector line */}
        <div
          className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500"
          style={{
            width: `calc(${(currentStep - 1) / (STEPS.length - 1)} * (100% - 2rem))`,
          }}
        />

        <div className="relative flex items-start justify-between">
          {STEPS.map((label, i) => {
            const stepNum = i + 1
            const done = stepNum < currentStep
            const active = stepNum === currentStep

            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                    done ? 'bg-violet-600 text-white' : '',
                    active
                      ? 'bg-gradient-to-br from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/40 scale-110'
                      : '',
                    !done && !active ? 'bg-gray-800 text-gray-500 border-2 border-gray-700' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {done ? '✓' : stepNum}
                </div>
                <span
                  className={[
                    'text-xs font-medium hidden sm:block',
                    active ? 'text-violet-400' : done ? 'text-gray-400' : 'text-gray-600',
                  ].join(' ')}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
