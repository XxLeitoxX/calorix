import { useEffect, useReducer, useRef } from 'react'
import { normalizeSearchKey, prepareSearchQuery } from '../i18n/foodLocale'
import { fetchUsdaSearchCandidates, getMacroNutrients } from '../services/usdaApi'
import useDebounce from './useDebounce'

const SEARCH_DEBOUNCE_MS = 300

/** Palabras que suelen indicar productos ultraprocesados / poco útiles para el MVP */
const EXCLUDE_WORDS = [
  'snack',
  'crackers',
  'cracker',
  'mix',
  'flavored',
  'flavour',
  'instant',
  'sauce',
  'soup',
  'prepared',
  'restaurant',
  'fast food',
]

/**
 * Limpieza de nombre al estilo “PRO” (prompt): primera parte antes de coma + quitar términos cocina.
 */
export function cleanFoodNamePro(raw) {
  if (raw == null || typeof raw !== 'string') return 'Food'

  const first = raw.split(',')[0] ?? raw
  let s = first.toLowerCase()
  s = s.replace(/\b(raw|cooked|boiled|fried|broilers|fryers)\b/gi, '')
  s = s.replace(/\s+/g, ' ').trim()

  if (!s) {
    s = String(raw.split(',')[0] ?? 'food')
      .toLowerCase()
      .trim()
  }

  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}

function descriptionLower(food) {
  return String(food?.description ?? '')
    .toLowerCase()
    .trim()
}

function hasExcludedWord(description) {
  const name = description.toLowerCase()
  return EXCLUDE_WORDS.some((word) => name.includes(word))
}

/**
 * @param {object} food — ítem crudo USDA
 * @param {string} queryLower — consulta ya en minúsculas (idealmente traducida EN)
 */
export function scoreFood(food, queryLower) {
  const name = descriptionLower(food)
  const q = queryLower.trim()
  if (!q) return 0

  let score = 0

  if (name === q) score += 100
  else if (name.startsWith(q)) score += 50
  else if (name.includes(q)) score += 20

  if (hasExcludedWord(name)) {
    score -= 50
  }

  score -= name.length * 0.2

  return score
}

/**
 * Una entrada por nombre limpio (mejor puntuación ya viene primero por sort previo).
 */
export function removeDuplicatesByCleanName(foods) {
  const seen = new Set()
  const out = []

  for (const food of foods) {
    const clean = cleanFoodNamePro(food.description).toLowerCase()
    if (!clean || seen.has(clean)) continue
    seen.add(clean)
    out.push(food)
  }
  return out
}

function mapToResult(food) {
  const nameEn = cleanFoodNamePro(food.description)
  const { calories, protein, carbs, fat } = getMacroNutrients(food)
  return {
    id: String(food.fdcId),
    nameEn,
    calories,
    protein,
    carbs,
    fat,
  }
}

const searchInitial = { results: [], loading: false, error: null }

function searchReducer(state, action) {
  switch (action.type) {
    case 'SEARCH_RESET':
      return searchInitial
    case 'SEARCH_START':
      return { ...state, loading: true, error: null }
    case 'SEARCH_SUCCESS':
      return { results: action.payload, loading: false, error: null }
    case 'SEARCH_ERROR':
      return { results: [], loading: false, error: action.payload }
    default:
      return state
  }
}

function processFoods(rawFoods, translatedQueryLower) {
  let foods = rawFoods.filter((f) => !hasExcludedWord(descriptionLower(f)))

  foods.sort(
    (a, b) => scoreFood(b, translatedQueryLower) - scoreFood(a, translatedQueryLower),
  )

  foods = removeDuplicatesByCleanName(foods)

  return foods.slice(0, 8).map(mapToResult).filter((x) => x.id)
}

/**
 * Búsqueda PRO: USDA + filtro + score + dedupe + nombres limpios + ES/EN.
 *
 * @param {string} query — texto del input (sin debounce externo)
 * @param {'en'|'es'} language
 * @returns {{ results: Array, loading: boolean, error: string|null, debouncedQuery: string }}
 */
export function useFoodSearch(query, language) {
  const debouncedQuery = useDebounce(String(query ?? '').trim(), SEARCH_DEBOUNCE_MS)
  const [state, dispatch] = useReducer(searchReducer, searchInitial)
  const abortRef = useRef(null)
  const cacheRef = useRef(new Map())

  useEffect(() => {
    const q = debouncedQuery.trim()

    if (!q) {
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
      dispatch({ type: 'SEARCH_RESET' })
      return
    }

    const apiQuery = prepareSearchQuery(q, language)
    const cacheKey = `${language}:${normalizeSearchKey(apiQuery)}`
    const cached = cacheRef.current.get(cacheKey)
    if (cached) {
      if (abortRef.current) {
        abortRef.current.abort()
        abortRef.current = null
      }
      dispatch({ type: 'SEARCH_SUCCESS', payload: cached })
      return
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    let cancelled = false
    dispatch({ type: 'SEARCH_START' })

    const qLower = apiQuery.toLowerCase()

    fetchUsdaSearchCandidates(apiQuery, controller.signal)
      .then((raw) => {
        if (cancelled) return
        const finalResults = processFoods(raw, qLower)
        cacheRef.current.set(cacheKey, finalResults)
        if (abortRef.current === controller) {
          abortRef.current = null
        }
        dispatch({ type: 'SEARCH_SUCCESS', payload: finalResults })
      })
      .catch((err) => {
        if (cancelled || err?.name === 'AbortError') return
        if (abortRef.current === controller) {
          abortRef.current = null
        }
        dispatch({
          type: 'SEARCH_ERROR',
          payload:
            err instanceof Error ? err.message : 'Error al buscar alimentos.',
        })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [debouncedQuery, language])

  return {
    results: state.results,
    loading: state.loading,
    error: state.error,
    debouncedQuery,
  }
}
