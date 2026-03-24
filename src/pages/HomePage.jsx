import { Link } from 'react-router-dom'
import FoodSearchPanel from '../components/FoodSearchPanel'
import Footer from '../components/Footer'
import GoalCalculator from '../components/GoalCalculator'
import Header from '../components/Header'
import MobileSummaryBar from '../components/MobileSummaryBar'
import SelectedFoodList from '../components/SelectedFoodList'
import SummaryPanel from '../components/SummaryPanel'
import useCalorieContext from '../context/useCalorieContext'
import { getPopularFoods } from '../data/seoFoods'
import { getUiStrings } from '../i18n/uiStrings'
import useSeoMeta from '../hooks/useSeoMeta'
import HomeSEOSection from './HomeSEOSection'

export default function HomePage() {
  const { language } = useCalorieContext()
  const t = getUiStrings(language)
  const popular = getPopularFoods()

  useSeoMeta({
    title: `Calorix | ${t.title}`,
    description: t.seoBody1,
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Calorix',
    url: 'https://calorix.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://calorix.app/{search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <main className="min-h-screen bg-calorix-bg pb-32 md:pb-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.14),transparent)]" />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <Header />
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-calorix-text">{t.popularFoods}</p>
          <div className="flex flex-wrap gap-2">
            {popular.map((food) => (
              <Link
                key={food.slug}
                to={`/food/${language === 'es' ? food.slug_es : food.slug}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-calorix-text hover:border-primary/40"
              >
                {language === 'es' ? food.name_es : food.name_en}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-[1fr_340px] md:gap-8">
          <section className="space-y-6">
            <FoodSearchPanel />
            <SelectedFoodList />
            <GoalCalculator />
          </section>
          <aside className="hidden md:block">
            <SummaryPanel />
          </aside>
        </div>
        <HomeSEOSection />
        <Footer />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MobileSummaryBar />
    </main>
  )
}
