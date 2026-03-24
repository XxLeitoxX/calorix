const baseFoods = [
  { en: 'rice', es: 'arroz', category: 'carbs' },
  { en: 'chicken', es: 'pollo', category: 'protein' },
  { en: 'egg', es: 'huevo', category: 'protein' },
  { en: 'bread', es: 'pan', category: 'carbs' },
  { en: 'banana', es: 'banana', category: 'carbs' },
  { en: 'potato', es: 'patata', category: 'carbs' },
  { en: 'oats', es: 'avena', category: 'carbs' },
  { en: 'quinoa', es: 'quinoa', category: 'carbs' },
  { en: 'pasta', es: 'pasta', category: 'carbs' },
  { en: 'beef', es: 'ternera', category: 'protein' },
  { en: 'turkey', es: 'pavo', category: 'protein' },
  { en: 'salmon', es: 'salmon', category: 'protein' },
  { en: 'tuna', es: 'atun', category: 'protein' },
  { en: 'milk', es: 'leche', category: 'protein' },
  { en: 'yogurt', es: 'yogur', category: 'protein' },
  { en: 'avocado', es: 'aguacate', category: 'fats' },
  { en: 'almonds', es: 'almendras', category: 'fats' },
  { en: 'olive oil', es: 'aceite de oliva', category: 'fats' },
  { en: 'broccoli', es: 'brocoli', category: 'vegetables' },
  { en: 'tomato', es: 'tomate', category: 'vegetables' },
]

const patternsEN = [
  'calories in {food}',
  '{food} calories per 100g',
  'how many calories in {food}',
  '{food} nutrition facts',
  '{food} macros',
  'is {food} good for diet',
  '{food} calories',
  '{food} protein carbs fat',
]

const patternsES = [
  'calorias {food}',
  'calorias del {food}',
  'cuantas calorias tiene {food}',
  '{food} calorias 100g',
  '{food} macronutrientes',
  '{food} en dieta',
  '{food} proteinas carbohidratos grasas',
  'informacion nutricional de {food}',
]

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function generateKeywords() {
  const keywords = []

  for (const food of baseFoods) {
    for (const p of patternsEN) {
      const keyword = p.replace('{food}', food.en)
      keywords.push({
        slug: slugify(keyword),
        keyword,
        lang: 'en',
        food: food.en,
        foodEn: food.en,
        foodEs: food.es,
        category: food.category,
      })
    }

    for (const p of patternsES) {
      const keyword = p.replace('{food}', food.es)
      keywords.push({
        slug: slugify(keyword),
        keyword,
        lang: 'es',
        food: food.es,
        foodEn: food.en,
        foodEs: food.es,
        category: food.category,
      })
    }
  }

  return keywords
}

export const SEO_KEYWORDS = generateKeywords()

const bySlug = new Map(SEO_KEYWORDS.map((k) => [k.slug, k]))

export function getKeywordBySlug(slug) {
  return bySlug.get(String(slug || '').toLowerCase()) || null
}

export function getRelatedKeywords(current, count = 5) {
  if (!current) return []
  return SEO_KEYWORDS.filter(
    (k) =>
      k.slug !== current.slug &&
      k.lang === current.lang &&
      (k.foodEn === current.foodEn || k.category === current.category),
  ).slice(0, count)
}

export function getRelatedFoodKeywords(current, count = 5) {
  if (!current) return []
  return SEO_KEYWORDS.filter(
    (k) => k.slug !== current.slug && k.lang === current.lang && k.category === current.category,
  ).slice(0, count)
}
