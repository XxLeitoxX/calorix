/**
 * USDA FoodData Central — fetch de candidatos y extracción de macros.
 * @see https://fdc.nal.usda.gov/api-guide.html
 */

/** IDs de nutrientes FDC */
const NUTRIENT_IDS = {
  energyKcal: 1008,
  protein: 1003,
  carbs: 1005,
  fat: 1004,
}

function nutrientValue(nutrients, id, fallbackNames = []) {
  if (!Array.isArray(nutrients)) return 0

  const byId = nutrients.find(
    (n) => n.nutrientId === id || n.nutrient?.id === id || n.nutrient?.number === String(id),
  )
  if (byId != null && byId.value != null) {
    return Number(byId.value) || 0
  }

  for (const name of fallbackNames) {
    const item = nutrients.find(
      (n) =>
        n.nutrientName === name ||
        n.nutrient?.name === name ||
        n.name === name,
    )
    if (item != null && item.value != null) {
      return Number(item.value) || 0
    }
  }
  return 0
}

function isFoundationOrSrLegacy(food) {
  return food?.dataType === 'Foundation' || food?.dataType === 'SR Legacy'
}

/**
 * Devuelve calorías (kcal) y gramos de P / C / G por 100 g según respuesta de búsqueda USDA.
 */
export function getMacroNutrients(food) {
  const nutrients = food?.foodNutrients || []

  let calories = nutrientValue(nutrients, NUTRIENT_IDS.energyKcal, [
    'Energy',
    'Energy (Atwater General Factors)',
  ])
  const unit = String(
    nutrients.find((n) => n.nutrientId === NUTRIENT_IDS.energyKcal)?.unitName ||
      nutrients.find((n) => n.nutrientName === 'Energy')?.unitName ||
      '',
  ).toLowerCase()
  if (unit === 'kj' || unit === 'kjoule') {
    calories = Math.round(calories / 4.184)
  }

  return {
    calories,
    protein: nutrientValue(nutrients, NUTRIENT_IDS.protein, ['Protein']),
    carbs: nutrientValue(nutrients, NUTRIENT_IDS.carbs, ['Carbohydrate, by difference']),
    fat: nutrientValue(nutrients, NUTRIENT_IDS.fat, ['Total lipid (fat)']),
  }
}

/**
 * Lista cruda Foundation + SR Legacy (sin ranking ni dedupe). Para `useFoodSearch`.
 */
export async function fetchUsdaSearchCandidates(apiQuery, signal, pageSize = 45) {
  const API_KEY = import.meta.env.VITE_USDA_API_KEY

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error(
      'Falta VITE_USDA_API_KEY en .env. Obtén una clave gratuita en https://fdc.nal.usda.gov/api-key-signup.html',
    )
  }

  const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search')
  url.searchParams.set('api_key', API_KEY)

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: apiQuery,
      pageSize,
      pageNumber: 1,
      dataType: ['Foundation', 'SR Legacy'],
    }),
    signal,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(
      text || `Error USDA (${response.status} ${response.statusText})`,
    )
  }

  const data = await response.json()
  const foods = Array.isArray(data.foods) ? data.foods : []
  return foods.filter((food) => isFoundationOrSrLegacy(food))
}
