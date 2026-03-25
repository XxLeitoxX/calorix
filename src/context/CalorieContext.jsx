import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useFoodSearch } from '../hooks/useFoodSearch'
import CalorieContext from './calorie-context'

const PROFILE_STORAGE_KEY = 'calorix_profile'

const DEFAULT_PROFILE = {
  age: 30,
  weight: 70,
  height: 170,
  goal: 'maintain',
}

const GOAL_FACTORS = {
  lose: 0.85,
  maintain: 1,
  gain: 1.15,
}

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROFILE }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_PROFILE }
    const age = Number(parsed.age)
    const weight = Number(parsed.weight)
    const height = Number(parsed.height)
    const g = parsed.goal
    const goal =
      g === 'lose' || g === 'maintain' || g === 'gain' ? g : DEFAULT_PROFILE.goal
    return {
      age: Number.isFinite(age) && age >= 1 ? Math.round(age) : DEFAULT_PROFILE.age,
      weight: Number.isFinite(weight) && weight >= 1 ? weight : DEFAULT_PROFILE.weight,
      height: Number.isFinite(height) && height >= 1 ? height : DEFAULT_PROFILE.height,
      goal,
    }
  } catch {
    return { ...DEFAULT_PROFILE }
  }
}

function round(value) {
  return Math.round(value * 10) / 10
}

/** Restaura ítems compartidos por URL (macros + nameEn). */
function normalizeSharedItem(item) {
  if (!item || typeof item !== 'object') return null
  const qty = Number(item.quantity)
  if (!Number.isFinite(qty) || qty < 1) return null
  const id = item.id != null ? String(item.id) : null
  if (!id) return null
  const nameEn =
    typeof item.nameEn === 'string'
      ? item.nameEn
      : typeof item.name === 'string'
        ? item.name
        : 'Food'
  const calories = Number(item.calories)
  const protein = Number(item.protein)
  const carbs = Number(item.carbs)
  const fat = Number(item.fat)
  if (![calories, protein, carbs, fat].every(Number.isFinite)) return null
  return {
    id,
    nameEn,
    calories,
    protein,
    carbs,
    fat,
    quantity: Math.max(1, Math.round(qty)),
  }
}

function buildStateFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const itemsParam = params.get('items')
  if (!itemsParam) {
    return { query: '', selectedFoods: [] }
  }

  try {
    const decoded = JSON.parse(window.atob(itemsParam))
    if (!Array.isArray(decoded)) return { query: '', selectedFoods: [] }
    const selectedFoods = decoded.map(normalizeSharedItem).filter(Boolean)
    return { query: '', selectedFoods }
  } catch {
    return { query: '', selectedFoods: [] }
  }
}

const initialState = buildStateFromUrl()

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'ADD_FOOD': {
      const existing = state.selectedFoods.find((item) => item.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          selectedFoods: state.selectedFoods.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 100 }
              : item,
          ),
        }
      }
      return {
        ...state,
        selectedFoods: [
          ...state.selectedFoods,
          {
            id: action.payload.id,
            nameEn: action.payload.nameEn,
            calories: action.payload.calories,
            protein: action.payload.protein,
            carbs: action.payload.carbs,
            fat: action.payload.fat,
            quantity: 100,
          },
        ],
      }
    }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        selectedFoods: state.selectedFoods.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item,
        ),
      }
    case 'REMOVE_FOOD':
      return {
        ...state,
        selectedFoods: state.selectedFoods.filter((item) => item.id !== action.payload),
      }
    case 'RESET_CALCULATOR_STATE':
      return { query: '', selectedFoods: [] }
    default:
      return state
  }
}

export function CalorieProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved =
        localStorage.getItem('calorix_lang') || localStorage.getItem('calfitness_lang')
      if (saved === 'es' || saved === 'en') return saved
    } catch {
      /* ignore */
    }
    return 'en'
  })

  const persistLanguage = (lang) => {
    setLanguage(lang)
    try {
      localStorage.setItem('calorix_lang', lang)
    } catch {
      /* ignore */
    }
  }

  const [profile, setProfile] = useState(() => loadProfile())

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile))
    } catch {
      /* ignore */
    }
  }, [profile])

  const targetDailyCalories = useMemo(() => {
    const { age, weight, height, goal } = profile
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5
    const tdee = bmr * 1.35
    return Math.round(tdee * GOAL_FACTORS[goal])
  }, [profile])

  const [highlightFoodId, setHighlightFoodId] = useState(null)

  useEffect(() => {
    if (!highlightFoodId) return undefined
    const timer = window.setTimeout(() => setHighlightFoodId(null), 650)
    return () => window.clearTimeout(timer)
  }, [highlightFoodId])

  const [state, dispatch] = useReducer(reducer, initialState)

  const {
    results: searchResults,
    loading: searchLoading,
    error: searchError,
    debouncedQuery,
  } = useFoodSearch(state.query, language)

  const isSearchPending =
    state.query.trim() !== debouncedQuery.trim() ||
    (Boolean(state.query.trim()) && searchLoading)

  const totals = useMemo(() => {
    return state.selectedFoods.reduce(
      (acc, item) => {
        const factor = item.quantity / 100
        acc.calories += item.calories * factor
        acc.protein += item.protein * factor
        acc.carbs += item.carbs * factor
        acc.fat += item.fat * factor
        return acc
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }, [state.selectedFoods])

  const shareUrl = useMemo(() => {
    if (!state.selectedFoods.length) return window.location.origin + window.location.pathname
    const payload = state.selectedFoods.map((item) => ({
      id: item.id,
      nameEn: item.nameEn,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      quantity: item.quantity,
    }))
    const encoded = window.btoa(JSON.stringify(payload))
    const url = new URL(window.location.href)
    url.searchParams.set('items', encoded)
    return url.toString()
  }, [state.selectedFoods])

  const addFood = useCallback((food) => {
    dispatch({ type: 'ADD_FOOD', payload: food })
    setHighlightFoodId(String(food.id))
  }, [])

  const resetStoredAppData = useCallback(() => {
    try {
      localStorage.removeItem(PROFILE_STORAGE_KEY)
      localStorage.removeItem('calorix_lang')
      localStorage.removeItem('calfitness_lang')
    } catch {
      /* ignore */
    }
    setProfile({ ...DEFAULT_PROFILE })
    setLanguage((current) => {
      try {
        localStorage.setItem('calorix_lang', current)
      } catch {
        /* ignore */
      }
      return current
    })
    dispatch({ type: 'RESET_CALCULATOR_STATE' })
  }, [])

  const value = {
    language,
    setLanguage: persistLanguage,
    profile,
    setProfile,
    resetStoredAppData,
    targetDailyCalories,
    highlightFoodId,
    query: state.query,
    debouncedQuery,
    selectedFoods: state.selectedFoods,
    searchResults,
    searchLoading,
    searchError,
    isSearchPending,
    totals: {
      calories: round(totals.calories),
      protein: round(totals.protein),
      carbs: round(totals.carbs),
      fat: round(totals.fat),
    },
    shareUrl,
    setQuery: (query) => dispatch({ type: 'SET_QUERY', payload: query }),
    addFood,
    updateQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    removeFood: (id) => dispatch({ type: 'REMOVE_FOOD', payload: id }),
  }

  return <CalorieContext.Provider value={value}>{children}</CalorieContext.Provider>
}
