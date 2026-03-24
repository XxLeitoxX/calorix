import { Check } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'

function macroValue(value) {
  return Math.round((Number(value) || 0) * 10) / 10
}

export default function SEOFoodTemplate({ food, nutrition, relatedFoods }) {
  const { language, addFood } = useCalorieContext()
  const t = getUiStrings(language)
  const [addedOk, setAddedOk] = useState(false)

  const displayName = language === 'es' ? food.name_es : food.name_en
  const cals = Math.round(nutrition.calories || 0)
  const protein = macroValue(nutrition.protein)
  const carbs = macroValue(nutrition.carbs)
  const fat = macroValue(nutrition.fat)

  const autoDescription =
    language === 'es'
      ? `El ${food.name_es.toLowerCase()} es un alimento comun que aporta nutrientes esenciales. Puede formar parte de una dieta equilibrada dependiendo de la cantidad y preparacion.`
      : `${food.name_en} is a commonly consumed food that provides essential nutrients. It can be part of a balanced diet depending on portion size and preparation.`

  const dietGuidance =
    language === 'es'
      ? 'Este alimento puede incluirse en un plato equilibrado con proteinas, carbohidratos, grasas saludables y vegetales. El control de porciones es clave para lograr tus objetivos.'
      : 'This food can be included in a balanced meal with protein, carbohydrates, healthy fats, and vegetables. Portion control is key to achieving your fitness goals.'

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold tracking-tight text-calorix-text">
            {t.foodPageTitle(displayName.toLowerCase())}
          </h1>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-calorix-muted">Calories</p>
              <p className="mt-1 text-lg font-bold text-calorix-text">{cals} kcal</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-calorix-muted">{t.protein}</p>
              <p className="mt-1 text-lg font-bold text-calorix-text">{protein}g</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-calorix-muted">{t.carbs}</p>
              <p className="mt-1 text-lg font-bold text-calorix-text">{carbs}g</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-3">
              <p className="text-xs text-calorix-muted">{t.fat}</p>
              <p className="mt-1 text-lg font-bold text-calorix-text">{fat}g</p>
            </div>
          </div>

          <section>
            <h2 className="text-base font-bold text-calorix-text">{language === 'es' ? 'Descripcion' : 'Description'}</h2>
            <p className="mt-2 leading-relaxed text-calorix-muted">{autoDescription}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-calorix-text">
              {language === 'es' ? 'Educacion nutricional' : 'Nutrition education'}
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-calorix-muted">
              <li>
                {language === 'es'
                  ? 'Las proteinas ayudan a formar y reparar tejidos.'
                  : 'Protein helps build and repair body tissues.'}
              </li>
              <li>
                {language === 'es'
                  ? 'Los carbohidratos aportan energia para las actividades diarias.'
                  : 'Carbohydrates provide energy for daily activities.'}
              </li>
              <li>
                {language === 'es'
                  ? 'Las grasas ayudan al funcionamiento hormonal y a la absorcion de nutrientes.'
                  : 'Fats support hormone function and nutrient absorption.'}
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-base font-bold text-calorix-text">
              {language === 'es' ? 'Como incluirlo en tu dieta' : 'How to include in your diet'}
            </h3>
            <p className="mt-2 leading-relaxed text-calorix-muted">{dietGuidance}</p>
          </section>

          <section>
            <h3 className="text-base font-bold text-calorix-text">
              {language === 'es' ? 'Ejemplo practico' : 'Practical example'}
            </h3>
            <ul className="mt-2 list-inside list-disc space-y-1 text-calorix-muted">
              <li>{language === 'es' ? 'Fuente de proteina' : 'Protein source'}</li>
              <li>
                {language === 'es'
                  ? 'Fuente de carbohidrato (este alimento)'
                  : 'Carbohydrate source (this food)'}
              </li>
              <li>{language === 'es' ? 'Vegetales' : 'Vegetables'}</li>
              <li>{language === 'es' ? 'Grasas saludables' : 'Healthy fats'}</li>
            </ul>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className={addedOk ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
              onClick={() => {
                addFood({
                  id: `seo-${food.slug}`,
                  nameEn: food.name_en,
                  calories: cals,
                  protein,
                  carbs,
                  fat,
                })
                setAddedOk(true)
                window.setTimeout(() => setAddedOk(false), 1200)
              }}
            >
              {addedOk ? (
                <span className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4" />
                  {t.addedToCalculator}
                </span>
              ) : (
                t.addToCalculator
              )}
            </Button>
            <Link
              to="/"
              className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-white px-4 py-2 font-semibold text-calorix-text hover:border-primary/40"
            >
              {t.goToCalculator}
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.relatedFoods}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {relatedFoods.map((item) => (
            <Link
              key={item.slug}
              to={`/food/${language === 'es' ? item.slug_es : item.slug}`}
              className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-calorix-text hover:border-primary/40"
            >
              {language === 'es' ? item.name_es : item.name_en}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
