import { Eraser } from 'lucide-react'
import { useEffect, useState } from 'react'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function parseIntField(raw) {
  const t = String(raw).trim()
  if (t === '') return null
  const n = parseInt(t.replace(',', '.'), 10)
  if (!Number.isFinite(n) || n < 1) return null
  return n
}

function parseWeightField(raw) {
  const t = String(raw).trim().replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 1) return null
  return n
}

export default function GoalCalculator() {
  const { language, profile, setProfile, targetDailyCalories, resetStoredAppData } =
    useCalorieContext()
  const t = getUiStrings(language)
  const { age, weight, height, goal } = profile

  const [ageStr, setAgeStr] = useState(() => String(age))
  const [weightStr, setWeightStr] = useState(() => String(weight))
  const [heightStr, setHeightStr] = useState(() => String(height))

  useEffect(() => {
    setAgeStr(String(profile.age))
    setWeightStr(String(profile.weight))
    setHeightStr(String(profile.height))
  }, [profile.age, profile.weight, profile.height])

  const commitAge = () => {
    const n = parseIntField(ageStr)
    if (n != null) {
      setProfile((p) => ({ ...p, age: n }))
      setAgeStr(String(n))
    } else {
      setAgeStr(String(profile.age))
    }
  }

  const commitWeight = () => {
    const n = parseWeightField(weightStr)
    if (n != null) {
      setProfile((p) => ({ ...p, weight: n }))
      setWeightStr(String(n))
    } else {
      setWeightStr(String(profile.weight))
    }
  }

  const commitHeight = () => {
    const n = parseIntField(heightStr)
    if (n != null) {
      setProfile((p) => ({ ...p, height: n }))
      setHeightStr(String(n))
    } else {
      setHeightStr(String(profile.height))
    }
  }

  return (
    <Card className="shadow-calorix-lg">
      <CardHeader>
        <CardTitle>{t.goalTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-medium text-calorix-text">
            {t.age}
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={ageStr}
              onChange={(e) => setAgeStr(e.target.value)}
              onBlur={commitAge}
              className="mt-1.5"
            />
          </label>
          <label className="text-sm font-medium text-calorix-text">
            {t.weightKg}
            <Input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={weightStr}
              onChange={(e) => setWeightStr(e.target.value)}
              onBlur={commitWeight}
              className="mt-1.5"
            />
          </label>
          <label className="text-sm font-medium text-calorix-text">
            {t.heightCm}
            <Input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={heightStr}
              onChange={(e) => setHeightStr(e.target.value)}
              onBlur={commitHeight}
              className="mt-1.5"
            />
          </label>
          <label className="text-sm font-medium text-calorix-text">
            {t.goal}
            <select
              value={goal}
              onChange={(e) => setProfile((p) => ({ ...p, goal: e.target.value }))}
              className="mt-1.5 flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-calorix-text shadow-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              <option value="lose">{t.goalLose}</option>
              <option value="maintain">{t.goalMaintain}</option>
              <option value="gain">{t.goalGain}</option>
            </select>
          </label>
        </div>
        <p className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3 text-center text-base font-bold text-calorix-text">
          {t.estimatedCal(targetDailyCalories)}
        </p>
        <div className="space-y-2 border-t border-slate-200 pt-4">
          <div className="flex flex-col items-end gap-1.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 gap-1.5 rounded-xl border border-amber-400/50 bg-amber-200/70 px-3 font-semibold text-amber-950 shadow-sm hover:border-amber-500/60 hover:bg-amber-300/75 focus-visible:ring-amber-400/45"
              onClick={resetStoredAppData}
            >
              <Eraser className="h-4 w-4 shrink-0 text-amber-900/85" aria-hidden />
              {t.clearSavedData}
            </Button>
            <p className="max-w-[260px] text-right text-xs leading-relaxed text-calorix-muted">
              {t.clearSavedDataHint}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
