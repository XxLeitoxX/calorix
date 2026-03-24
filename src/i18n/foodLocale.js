/**
 * Búsqueda (ES→EN solo si el idioma de UI es español) y nombres de alimentos (EN→ES).
 */

export const ES_TO_EN = {
  pollo: 'chicken',
  arroz: 'rice',
  huevo: 'egg',
  manzana: 'apple',
  ternera: 'beef',
  leche: 'milk',
  pan: 'bread',
  pescado: 'fish',
  atun: 'tuna',
  queso: 'cheese',
  tomate: 'tomato',
  aguacate: 'avocado',
  platano: 'banana',
  naranja: 'orange',
  cerdo: 'pork',
  pavo: 'turkey',
  yogurt: 'yogurt',
  yogur: 'yogurt',
  avena: 'oats',
  pasta: 'pasta',
  patata: 'potato',
  papa: 'potato',
  zanahoria: 'carrot',
  espinaca: 'spinach',
  brocoli: 'broccoli',
  brócoli: 'broccoli',
  salmon: 'salmon',
  salmón: 'salmon',
  mantequilla: 'butter',
  aceite: 'oil',
  nueces: 'nuts',
  almendras: 'almonds',
}

function buildEnToEs() {
  const map = {}
  for (const [es, en] of Object.entries(ES_TO_EN)) {
    const k = en.toLowerCase()
    if (!(k in map)) map[k] = es
  }
  return map
}

export const EN_TO_ES = buildEnToEs()

export function normalizeSearchKey(query) {
  return String(query ?? '')
    .trim()
    .toLowerCase()
}

/**
 * Si el idioma es español, traduce términos comunes al inglés para USDA.
 * En inglés, se envía la consulta tal cual.
 */
export function prepareSearchQuery(query, language) {
  const q = String(query ?? '').trim()
  if (!q) return ''
  if (language !== 'es') return q

  const lower = q.toLowerCase()
  if (ES_TO_EN[lower]) return ES_TO_EN[lower]

  return lower
    .split(/\s+/)
    .map((word) => ES_TO_EN[word] || word)
    .join(' ')
}

function titleCaseWord(word) {
  if (!word) return word
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Muestra el nombre del alimento según idioma (traducción por diccionario si existe).
 * @param {string} nameEn — nombre limpio en inglés
 * @param {'en'|'es'} language
 */
export function displayFoodName(nameEn, language) {
  if (!nameEn) return ''
  if (language !== 'es') return nameEn

  const trimmed = nameEn.trim()
  const lower = trimmed.toLowerCase()

  if (EN_TO_ES[lower]) return titleCaseWord(EN_TO_ES[lower])

  const first = lower.split(/\s+/)[0]
  if (EN_TO_ES[first]) {
    const rest = trimmed.slice(first.length).trim()
    const head = titleCaseWord(EN_TO_ES[first])
    return rest ? `${head} ${rest}` : head
  }

  return nameEn
}
