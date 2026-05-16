import { cn } from '@/lib/utils'

interface TalimaLogoProps {
  className?: string
  iconClassName?: string
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { icon: 'h-8 w-8', text: 'text-lg' },
  md: { icon: 'h-10 w-10', text: 'text-xl' },
  lg: { icon: 'h-12 w-12', text: 'text-2xl' },
}

export function TalimaLogo({
  className,
  iconClassName,
  showWordmark = true,
  size = 'md',
}: TalimaLogoProps) {
  const s = sizes[size]
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <img
        src={`${import.meta.env.BASE_URL}favicon.svg`}
        alt="Talima"
        className={cn(s.icon, 'rounded-xl shadow-lg shadow-indigo-500/25', iconClassName)}
      />
      {showWordmark && (
        <span className={cn('font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400', s.text)}>
          Talima
        </span>
      )}
    </div>
  )
}
