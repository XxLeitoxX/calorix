import { LOGO_IMAGE_SRC } from '@/config/branding'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'

export default function Header() {
  const { language, setLanguage } = useCalorieContext()
  const t = getUiStrings(language)

  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <Link to="/" className="flex shrink-0 items-center justify-center" aria-label={t.brand}>
          <img
            src={LOGO_IMAGE_SRC}
            alt={t.brand}
            className="h-11 w-auto max-h-14 max-w-[200px] object-contain object-left md:h-14 md:max-w-[220px]"
            width={220}
            height={56}
            decoding="async"
          />
        </Link>
        <div className="min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight text-calorix-text md:text-3xl">{t.title}</h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-calorix-muted md:text-base">{t.subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-start sm:self-center">
        <span className="text-sm font-medium text-calorix-muted">{t.language}</span>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          <Button
            type="button"
            variant={language === 'en' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-lg px-4"
            onClick={() => setLanguage('en')}
          >
            EN
          </Button>
          <Button
            type="button"
            variant={language === 'es' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-lg px-4"
            onClick={() => setLanguage('es')}
          >
            ES
          </Button>
        </div>
      </div>
    </header>
  )
}
