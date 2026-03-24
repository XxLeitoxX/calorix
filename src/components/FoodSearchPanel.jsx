import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import useCalorieContext from '../context/useCalorieContext'
import { displayFoodName } from '../i18n/foodLocale'
import { getUiStrings } from '../i18n/uiStrings'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function FoodSearchPanel() {
  const {
    query,
    setQuery,
    debouncedQuery,
    searchResults,
    searchLoading,
    searchError,
    addFood,
    language,
    isSearchPending,
  } = useCalorieContext()
  const t = getUiStrings(language)
  const panelRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const showDropdown = isOpen && query.trim().length > 0

  const showEmpty =
    debouncedQuery.trim().length > 0 &&
    !searchLoading &&
    !isSearchPending &&
    !searchError &&
    searchResults.length === 0

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!panelRef.current) return
      if (!panelRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className="relative z-30" ref={panelRef}>
      <Card className="overflow-visible p-0 shadow-calorix-lg">
        <div className="p-4 md:p-5">
          <label htmlFor="calorix-search" className="mb-2 block text-sm font-semibold text-calorix-text">
            {t.search}
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary"
              aria-hidden
            />
            <Input
              id="calorix-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => {
                if (query.trim()) setIsOpen(true)
              }}
              placeholder={t.searchPlaceholder}
              className="h-14 rounded-xl border-slate-200 pl-12 text-base shadow-inner"
              autoComplete="off"
            />
          </div>
        </div>

        {showDropdown && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-80 overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-calorix-lg animate-in fade-in slide-in-from-top-2 duration-200"
            role="listbox"
            aria-label={t.results}
          >
            {searchError && (
              <p className="p-4 text-sm text-rose-600" role="alert">
                {searchError}
              </p>
            )}
            {!searchError && isSearchPending && (
              <p className="p-4 text-sm text-calorix-muted">{t.loadingResults}</p>
            )}
            {!searchError && !isSearchPending && showEmpty && (
              <p className="p-4 text-sm text-calorix-muted">{t.noFoodsFound(debouncedQuery)}</p>
            )}
            {!searchError && !isSearchPending && searchResults.length > 0 && (
              <ul className="max-h-72 divide-y divide-slate-100 overflow-y-auto py-1">
                {searchResults.map((food) => (
                  <li key={food.id} role="option">
                    <div className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-slate-50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-calorix-text">
                          {displayFoodName(food.nameEn || '', language)}
                        </p>
                        <p className="text-xs text-calorix-muted">
                          {Math.round(food.calories)} kcal · P {food.protein}g · C {food.carbs}g · F {food.fat}g ·{' '}
                          {t.per100g}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="default"
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl"
                        onClick={() => addFood(food)}
                        aria-label={`Add ${displayFoodName(food.nameEn || '', language)}`}
                      >
                        +
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>

      {!query.trim() && <p className="mt-2 px-1 text-xs text-calorix-muted">{t.startTyping}</p>}
    </div>
  )
}
