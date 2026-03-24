import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3
}

export function useAnimatedNumber(target, { duration = 500 } = {}) {
  const [display, setDisplay] = useState(() => Number(target) || 0)
  const fromRef = useRef(Number(target) || 0)

  useEffect(() => {
    const from = fromRef.current
    const to = Number(target) || 0

    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const v = from + (to - from) * easeOutCubic(p)
      setDisplay(v)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
        setDisplay(to)
      }
    }

    if (Math.abs(from - to) < 0.5) {
      fromRef.current = to
      raf = requestAnimationFrame(() => setDisplay(to))
      return () => cancelAnimationFrame(raf)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return display
}
