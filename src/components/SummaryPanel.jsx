import { useState } from 'react'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'
import { useAnimatedNumber } from '@/hooks/useAnimatedValue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function MacroRow({ label, grams, percent, barClass }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-calorix-text">{label}</span>
        <span className="tabular-nums font-bold text-calorix-muted">
          {grams}
          g
        </span>
      </div>
      <Progress value={percent} indicatorClassName={barClass} />
    </div>
  )
}

export default function SummaryPanel() {
  const { totals, shareUrl, language } = useCalorieContext()
  const t = getUiStrings(language)
  const [copied, setCopied] = useState(false)

  const animatedKcal = useAnimatedNumber(totals.calories, { duration: 550 })

  const pCal = totals.protein * 4
  const cCal = totals.carbs * 4
  const fCal = totals.fat * 9
  const macroTotal = pCal + cCal + fCal || 1

  const pPct = Math.min(100, Math.round((pCal / macroTotal) * 100))
  const cPct = Math.min(100, Math.round((cCal / macroTotal) * 100))
  const fPct = Math.min(100, Math.round((fCal / macroTotal) * 100))

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card className="sticky top-6 border-primary/10 shadow-calorix-lg ring-1 ring-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{t.summary}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium text-calorix-muted">{t.kcalToday}</p>
          <p className="mt-1 flex items-baseline gap-2 text-4xl font-black tabular-nums tracking-tight text-calorix-text">
            <span className="text-3xl" aria-hidden>
              🔥
            </span>
            {Math.round(animatedKcal)}
            <span className="text-lg font-bold text-primary">kcal</span>
          </p>
        </div>

        <div className="space-y-5">
          <MacroRow
            label={t.protein}
            grams={totals.protein}
            percent={pPct}
            barClass="bg-accent"
          />
          <MacroRow
            label={t.carbs}
            grams={totals.carbs}
            percent={cPct}
            barClass="bg-primary"
          />
          <MacroRow
            label={t.fat}
            grams={totals.fat}
            percent={fPct}
            barClass="bg-amber-500"
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full rounded-xl border-primary/20 font-semibold hover:border-primary/40"
          onClick={handleShare}
        >
          {copied ? t.linkCopied : t.sharePlan}
        </Button>
      </CardContent>
    </Card>
  )
}
