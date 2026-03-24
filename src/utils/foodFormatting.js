/**
 * Convierte nombres técnicos USDA en etiquetas cortas y legibles.
 * Ej: "Chicken, broilers or fryers, breast, meat only, raw" → "Chicken"
 */
export function cleanFoodName(raw) {
  if (raw == null || typeof raw !== 'string') return 'Food'

  const firstSegment = raw.split(',')[0] ?? raw
  let s = firstSegment.toLowerCase()
  s = s.replace(/\b(raw|cooked|broilers|fryers)\b/gi, '')
  s = s.replace(/\s+/g, ' ').trim()

  if (!s) {
    s = String(raw.split(',')[0] ?? 'food')
      .toLowerCase()
      .trim()
  }

  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}
