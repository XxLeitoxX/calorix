import { Link } from 'react-router-dom'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'

export default function Footer() {
  const { language } = useCalorieContext()
  const t = getUiStrings(language)

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 py-8 text-sm text-calorix-muted">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 md:px-6">
        <Link className="hover:text-calorix-text" to="/privacy">
          {t.footerPrivacy}
        </Link>
        <Link className="hover:text-calorix-text" to="/disclaimer">
          {t.footerDisclaimer}
        </Link>
        <Link className="hover:text-calorix-text" to="/cookies">
          {t.footerCookies}
        </Link>
        <a className="hover:text-calorix-text" href="mailto:contact@calorix.app">
          {t.footerContact}
        </a>
      </div>
    </footer>
  )
}
