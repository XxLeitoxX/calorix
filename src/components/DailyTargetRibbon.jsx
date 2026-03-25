import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'
import { cn } from '@/lib/utils'

/** Objetivo calórico visible al navegar (p. ej. páginas de alimentos); en desktop queda sticky al hacer scroll. */
export default function DailyTargetRibbon({ className }) {
  const { language, targetDailyCalories } = useCalorieContext()
  const t = getUiStrings(language)

  return (
    <p
      className={cn(
        'mt-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2.5 text-center text-sm font-bold text-calorix-text shadow-sm ring-1 ring-primary/10 md:sticky md:top-3 md:z-20',
        className,
      )}
    >
      {t.estimatedCal(targetDailyCalories)}
    </p>
  )
}
