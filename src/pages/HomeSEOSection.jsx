import { Link } from 'react-router-dom'
import useCalorieContext from '../context/useCalorieContext'
import { getPopularFoods } from '../data/seoFoods'
import { getUiStrings } from '../i18n/uiStrings'

export default function HomeSEOSection() {
  const { language } = useCalorieContext()
  const t = getUiStrings(language)
  const popular = getPopularFoods()

  return (
    <section className="mt-14 border-t border-slate-200/80 bg-white/60 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-bold tracking-tight text-calorix-text md:text-2xl">{t.seoTitle}</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-calorix-muted md:text-base">
          <p>{t.seoBody1}</p>
          <p>{t.seoBody2}</p>
          <div>
            <p className="font-semibold text-calorix-text">{t.seoPopular}</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>{t.seoBullet1}</li>
              <li>{t.seoBullet2}</li>
              <li>{t.seoBullet3}</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-calorix-text">{t.popularFoods}</p>
            <div className="mt-2 flex flex-wrap gap-2">
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
        </div>
      </div>
    </section>
  )
}
