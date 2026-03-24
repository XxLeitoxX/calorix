import { Minus, Plus, Trash2 } from 'lucide-react'
import useCalorieContext from '../context/useCalorieContext'
import { displayFoodName } from '../i18n/foodLocale'
import { getUiStrings } from '../i18n/uiStrings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

function FoodRow({ item, updateQuantity, removeFood, language, highlight }) {
  const t = getUiStrings(language)
  const factor = item.quantity / 100
  const calories = Math.round(item.calories * factor)
  const label =
    displayFoodName(item.nameEn || item.name || '', language) ||
    (language === 'es' ? 'Alimento' : 'Food')

  return (
    <li
      className={cn(
        'rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-calorix',
        highlight && 'animate-calorix-pop ring-2 ring-primary/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-calorix-text">{label}</p>
          <p className="mt-0.5 text-sm text-calorix-muted">
            {calories} kcal · {item.quantity}
            {t.grams}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          onClick={() => removeFood(item.id)}
          aria-label={t.remove}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        <Button
          type="button"
          variant="icon"
          size="icon"
          className="h-11 w-11"
          onClick={() => updateQuantity(item.id, item.quantity - 10)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="min-w-[4.5rem] rounded-xl border border-slate-200 bg-slate-50 py-2 text-center text-sm font-bold tabular-nums text-calorix-text">
          {item.quantity}
          {t.grams}
        </span>
        <Button
          type="button"
          variant="icon"
          size="icon"
          className="h-11 w-11"
          onClick={() => updateQuantity(item.id, item.quantity + 10)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </li>
  )
}

export default function SelectedFoodList() {
  const { selectedFoods, updateQuantity, removeFood, language, highlightFoodId } = useCalorieContext()
  const t = getUiStrings(language)

  return (
    <Card className="shadow-calorix-lg">
      <CardHeader>
        <CardTitle>{t.yourList}</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedFoods.length === 0 ? (
          <p className="text-sm text-calorix-muted">{t.emptyList}</p>
        ) : (
          <ul className="space-y-3">
            {selectedFoods.map((item) => (
              <FoodRow
                key={item.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFood={removeFood}
                language={language}
                highlight={highlightFoodId === item.id}
              />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
