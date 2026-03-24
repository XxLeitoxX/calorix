import { useState } from 'react'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'
import { useAnimatedNumber } from '@/hooks/useAnimatedValue'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export default function MobileSummaryBar() {
  const { totals, language } = useCalorieContext()
  const t = getUiStrings(language)
  const [open, setOpen] = useState(false)

  const animatedKcal = useAnimatedNumber(totals.calories, { duration: 500 })

  const pCal = totals.protein * 4
  const cCal = totals.carbs * 4
  const fCal = totals.fat * 9
  const macroTotal = pCal + cCal + fCal || 1
  const pPct = Math.min(100, Math.round((pCal / macroTotal) * 100))
  const cPct = Math.min(100, Math.round((cCal / macroTotal) * 100))
  const fPct = Math.min(100, Math.round((fCal / macroTotal) * 100))

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/90 bg-white/95 p-3 shadow-[0_-8px_30px_-8px_rgba(15,23,42,0.12)] backdrop-blur-md md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3.5 text-left text-white shadow-calorix transition-transform active:scale-[0.99]"
      >
        <div>
          <span className="block text-xs font-medium opacity-90">{t.mobileTotalCal}</span>
          <span className="text-xl font-black tabular-nums">
            🔥 {Math.round(animatedKcal)} kcal
          </span>
        </div>
        <span className={cn('text-xs font-medium opacity-90', open && 'underline')}>{t.tapExpand}</span>
      </button>
      {open && (
        <div
          className="mt-3 space-y-4 rounded-xl border border-slate-200 bg-white p-4 animate-in fade-in slide-in-from-bottom-2 duration-200"
          role="region"
          aria-label={t.summary}
        >
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-semibold text-calorix-text">
              <span>{t.protein}</span>
              <span className="tabular-nums">
                {totals.protein}g
              </span>
            </div>
            <Progress value={pPct} indicatorClassName="bg-accent" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-semibold text-calorix-text">
              <span>{t.carbs}</span>
              <span className="tabular-nums">
                {totals.carbs}g
              </span>
            </div>
            <Progress value={cPct} indicatorClassName="bg-primary" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-semibold text-calorix-text">
              <span>{t.fat}</span>
              <span className="tabular-nums">
                {totals.fat}g
              </span>
            </div>
            <Progress value={fPct} indicatorClassName="bg-amber-500" />
          </div>
        </div>
      )}
    </div>
  )
}
