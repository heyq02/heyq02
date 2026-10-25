function token(name: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!value) {
    throw new Error(`Missing design token ${name}`)
  }
  return value
}

function cubicBezier(name: string): [number, number, number, number] {
  const parts = token(name).match(/-?\d*\.?\d+/g)
  if (parts?.length !== 4) {
    throw new Error(`Design token ${name} is not a cubic-bezier`)
  }

  return [Number(parts[0]), Number(parts[1]), Number(parts[2]), Number(parts[3])]
}

function seconds(name: string) {
  const value = token(name)
  const amount = Number.parseFloat(value)
  return value.endsWith('ms') ? amount / 1000 : amount
}

let cachedEase: [number, number, number, number] | undefined
let cachedHover: number | undefined
let cachedRise: number | undefined

export function easeOutQuart() {
  cachedEase ??= cubicBezier('--ease-out-quart')
  return cachedEase
}

export function hoverDuration() {
  cachedHover ??= seconds('--default-transition-duration')
  return cachedHover
}

export function riseDuration() {
  cachedRise ??= seconds('--transition-duration-slow')
  return cachedRise
}
