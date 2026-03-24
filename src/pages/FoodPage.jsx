import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SEOFoodTemplate from '../components/SEOFoodTemplate'
import Footer from '../components/Footer'
import Header from '../components/Header'
import useCalorieContext from '../context/useCalorieContext'
import { getFoodBySlug, getFoodFallbackMacros, getRelatedFoods } from '../data/seoFoods'
import { getUiStrings } from '../i18n/uiStrings'
import useSeoMeta from '../hooks/useSeoMeta'
import { fetchUsdaSearchCandidates, getMacroNutrients } from '../services/usdaApi'

export default function FoodPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { language } = useCalorieContext()
  const t = getUiStrings(language)
  const [nutrition, setNutrition] = useState(null)

  const food = getFoodBySlug(slug)
  const related = getRelatedFoods(food, 4)
  const displayName = food ? (language === 'es' ? food.name_es : food.name_en) : slug
  const canonicalName = food ? food.name_en : 'food'

  useSeoMeta({
    title: food
      ? `${language === 'es' ? 'Calorias' : 'Calories'} in ${food.name_en} | Calorix`
      : 'Calorix',
    description: food
      ? language === 'es'
        ? `Consulta calorias, proteinas, carbohidratos y grasas del ${food.name_es.toLowerCase()} por 100g.`
        : `Check calories, protein, carbs and fat in ${food.name_en.toLowerCase()} per 100g. Free calorie calculator.`
      : t.seoBody1,
  })

  const jsonLd = food
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: t.foodPageTitle(displayName.toLowerCase()),
        description:
          language === 'es'
            ? `Consulta calorias, proteinas, carbohidratos y grasas del ${food.name_es.toLowerCase()} por 100g.`
            : `Check calories, protein, carbs and fat in ${food.name_en.toLowerCase()} per 100g. Free calorie calculator.`,
        url: `https://calorix.app/food/${canonicalName.toLowerCase().replace(/\s+/g, '-')}`,
      }
    : null

  useEffect(() => {
    if (!food) return

    const controller = new AbortController()

    fetchUsdaSearchCandidates(food.name_en, controller.signal, 12)
      .then((items) => {
        if (!items.length) {
          setNutrition(getFoodFallbackMacros(food))
          return
        }
        const best =
          items.find((x) =>
            String(x.description || '')
              .toLowerCase()
              .includes(food.name_en.toLowerCase()),
          ) || items[0]
        setNutrition(getMacroNutrients(best))
      })
      .catch(() => {
        setNutrition(getFoodFallbackMacros(food))
      })

    return () => controller.abort()
  }, [food])

  if (!food) {
    return (
      <main className="min-h-screen bg-calorix-bg">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <Header />
          <Card className="mt-8">
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-calorix-muted">Food not found.</p>
              <Button onClick={() => navigate('/')}>Back</Button>
            </CardContent>
          </Card>
          <Footer />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-calorix-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Header />
        {!nutrition ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{t.foodPageTitle(displayName.toLowerCase())}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-calorix-muted">Loading nutrition data...</CardContent>
          </Card>
        ) : (
          <div className="mt-8">
            <SEOFoodTemplate food={food} nutrition={nutrition} relatedFoods={related} />
          </div>
        )}
        <Footer />
      </div>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </main>
  )
}
