import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DailyTargetRibbon from '../components/DailyTargetRibbon'
import Footer from '../components/Footer'
import Header from '../components/Header'
import MobileSummaryBar from '../components/MobileSummaryBar'
import useCalorieContext from '../context/useCalorieContext'
import useSeoMeta from '../hooks/useSeoMeta'
import { fetchUsdaSearchCandidates, getMacroNutrients } from '../services/usdaApi'
import {
  getKeywordBySlug,
  getRelatedFoodKeywords,
  getRelatedKeywords,
  slugify,
} from '../utils/seoKeywords'

function round(v) {
  return Math.round((Number(v) || 0) * 10) / 10
}

const DESC_EN = [
  'If you are wondering {keyword}, this page provides estimated calories and nutritional values to help you track your diet.',
  'Looking for {keyword}? Here you can quickly check estimated calories and macronutrients for smarter meal planning.',
  'This guide answers {keyword} with practical nutrition data you can use in your daily calorie tracking.',
]

const DESC_ES = [
  'Si te preguntas {keyword}, esta pagina muestra calorias estimadas y valores nutricionales para ayudarte a controlar tu dieta.',
  'Si buscas {keyword}, aqui puedes revisar calorias y macronutrientes estimados para planificar mejor tus comidas.',
  'Esta guia responde {keyword} con datos practicos para el control diario de tu alimentacion.',
]

function hashText(text) {
  let h = 0
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0
  }
  return h
}

export default function SEOPage() {
  const { slug } = useParams()
  const { addFood } = useCalorieContext()

  const entry = getKeywordBySlug(slug)
  const [nutrition, setNutrition] = useState(null)

  const language = entry?.lang === 'es' ? 'es' : 'en'

  const description = useMemo(() => {
    if (!entry) return ''
    const templates = language === 'es' ? DESC_ES : DESC_EN
    const idx = hashText(entry.slug) % templates.length
    return templates[idx].replace('{keyword}', entry.keyword)
  }, [entry, language])

  useSeoMeta({
    title: entry ? `${entry.keyword} | Calorix` : 'Calorix',
    description:
      language === 'es'
        ? `Consulta calorias, proteinas, carbohidratos y grasas del ${entry?.foodEs || 'alimento'} por 100g.`
        : `Check calories, protein, carbs and fat in ${entry?.foodEn || 'food'} per 100g. Free calorie calculator.`,
  })

  const jsonLd = entry
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `${entry.keyword} | Calorix`,
        description,
        url: `https://calorix.app/${entry.slug}`,
      }
    : null

  useEffect(() => {
    if (!entry) return
    const controller = new AbortController()

    fetchUsdaSearchCandidates(entry.foodEn, controller.signal, 10)
      .then((items) => {
        const best =
          items.find((x) =>
            String(x.description || '')
              .toLowerCase()
              .includes(entry.foodEn.toLowerCase()),
          ) || items[0]
        if (!best) {
          setNutrition({ calories: 120, protein: 5, carbs: 15, fat: 4 })
          return
        }
        setNutrition(getMacroNutrients(best))
      })
      .catch(() => setNutrition({ calories: 120, protein: 5, carbs: 15, fat: 4 }))

    return () => controller.abort()
  }, [entry])

  if (!entry) return <Navigate to="/" replace />
  if (!nutrition) {
    return (
      <main className="min-h-screen bg-calorix-bg pb-32 md:pb-10">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <Header />
          <DailyTargetRibbon />
          <Card className="mt-8">
            <CardContent className="pt-6 text-sm text-calorix-muted">Loading SEO page...</CardContent>
          </Card>
          <Footer />
        </div>
        <MobileSummaryBar />
      </main>
    )
  }

  const relatedKeywords = getRelatedKeywords(entry, 5)
  const relatedFoods = getRelatedFoodKeywords(entry, 5)

  return (
    <main className="min-h-screen bg-calorix-bg pb-32 md:pb-10">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Header />
        <DailyTargetRibbon />
        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
          <Card>
            <CardHeader>
              <h1 className="text-xl font-bold tracking-tight text-calorix-text">{entry.keyword}</h1>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <p className="leading-relaxed text-calorix-muted">{description}</p>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <h2 className="text-xs text-calorix-muted">Calories</h2>
                  <p className="mt-1 text-lg font-bold text-calorix-text">{Math.round(nutrition.calories)} kcal</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <h2 className="text-xs text-calorix-muted">Protein</h2>
                  <p className="mt-1 text-lg font-bold text-calorix-text">{round(nutrition.protein)}g</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <h2 className="text-xs text-calorix-muted">Carbs</h2>
                  <p className="mt-1 text-lg font-bold text-calorix-text">{round(nutrition.carbs)}g</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <h2 className="text-xs text-calorix-muted">Fat</h2>
                  <p className="mt-1 text-lg font-bold text-calorix-text">{round(nutrition.fat)}g</p>
                </div>
              </div>

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
                      ? 'Los carbohidratos aportan energia para actividades diarias.'
                      : 'Carbohydrates provide energy for daily activities.'}
                  </li>
                  <li>
                    {language === 'es'
                      ? 'Las grasas apoyan la funcion hormonal y absorcion de nutrientes.'
                      : 'Fats support hormone function and nutrient absorption.'}
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-bold text-calorix-text">
                  {language === 'es' ? 'Aplicacion practica' : 'Practical guidance'}
                </h3>
                <p className="mt-2 leading-relaxed text-calorix-muted">
                  {language === 'es'
                    ? 'Incluye este alimento en un plato equilibrado con proteina, carbohidrato, grasas saludables y vegetales. Controlar porciones ayuda a tus objetivos.'
                    : 'Include this food in a balanced plate with protein, carbohydrates, healthy fats, and vegetables. Portion control supports your goals.'}
                </p>
              </section>

              <Button
                onClick={() =>
                  addFood({
                    id: `kw-${entry.slug}`,
                    nameEn: entry.foodEn,
                    calories: Math.round(nutrition.calories),
                    protein: round(nutrition.protein),
                    carbs: round(nutrition.carbs),
                    fat: round(nutrition.fat),
                  })
                }
              >
                {language === 'es' ? 'Añadir al calculador' : 'Add to calculator'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === 'es' ? 'Enlaces relacionados' : 'Related links'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-calorix-text">
                  {language === 'es' ? 'Keywords relacionados' : 'Related keywords'}
                </h3>
                <div className="space-y-2">
                  {relatedKeywords.map((k) => (
                    <Link
                      key={k.slug}
                      to={`/${k.slug}`}
                      className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-calorix-text hover:border-primary/40"
                    >
                      {k.keyword}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-calorix-text">
                  {language === 'es' ? 'Alimentos relacionados' : 'Related foods'}
                </h3>
                <div className="space-y-2">
                  {relatedFoods.map((k) => (
                    <Link
                      key={`food-${k.slug}`}
                      to={`/food/${slugify(k.foodEn)}`}
                      className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-calorix-text hover:border-primary/40"
                    >
                      {language === 'es' ? k.foodEs : k.foodEn}
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <MobileSummaryBar />
    </main>
  )
}
