import { useMemo, useState } from 'react'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const GOAL_FACTORS = {
  lose: 0.85,
  maintain: 1,
  gain: 1.15,
}

export default function GoalCalculator() {
  const { language } = useCalorieContext()
  const t = getUiStrings(language)

  const [age, setAge] = useState(30)
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(170)
  const [goal, setGoal] = useState('maintain')

  const estimatedCalories = useMemo(() => {
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5
    const tdee = bmr * 1.35
    return Math.round(tdee * GOAL_FACTORS[goal])
  }, [age, weight, height, goal])

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
              type="number"
              min={1}
              value={age}
              onChange={(e) => setAge(Number(e.target.value) || 1)}
              className="mt-1.5"
            />
          </label>
          <label className="text-sm font-medium text-calorix-text">
            {t.weightKg}
            <Input
              type="number"
              min={1}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 1)}
              className="mt-1.5"
            />
          </label>
          <label className="text-sm font-medium text-calorix-text">
            {t.heightCm}
            <Input
              type="number"
              min={1}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value) || 1)}
              className="mt-1.5"
            />
          </label>
          <label className="text-sm font-medium text-calorix-text">
            {t.goal}
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1.5 flex h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-calorix-text shadow-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
            >
              <option value="lose">{t.goalLose}</option>
              <option value="maintain">{t.goalMaintain}</option>
              <option value="gain">{t.goalGain}</option>
            </select>
          </label>
        </div>
        <p className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-3 text-center text-base font-bold text-calorix-text">
          {t.estimatedCal(estimatedCalories)}
        </p>
      </CardContent>
    </Card>
  )
}
