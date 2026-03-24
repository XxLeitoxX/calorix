import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Footer from '../components/Footer'
import Header from '../components/Header'
import useCalorieContext from '../context/useCalorieContext'
import { getUiStrings } from '../i18n/uiStrings'
import useSeoMeta from '../hooks/useSeoMeta'

export default function PrivacyPage() {
  const { language } = useCalorieContext()
  const t = getUiStrings(language)

  useSeoMeta({
    title: `${t.privacyTitle} | Calorix`,
    description: t.legalNoData,
  })

  return (
    <main className="min-h-screen bg-calorix-bg">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        <Header />
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{t.privacyTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-calorix-muted">
            <p>{t.legalNoData}</p>
            <p>{t.legalCookiesAnalytics}</p>
            <p>{t.legalNoSell}</p>
          </CardContent>
        </Card>
        <Footer />
      </div>
    </main>
  )
}
