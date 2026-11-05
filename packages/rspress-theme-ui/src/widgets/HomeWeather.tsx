import type { HomePlace } from '@heyq02/rspress-site-content'
import { useEffect, useState } from 'react'
import type { ReactElement } from 'react'

/** WMO weather interpretation codes → short Chinese labels. */
const weatherLabel: Record<number, string> = {
  0: '晴',
  1: '晴间多云',
  2: '多云',
  3: '阴',
  45: '雾',
  48: '雾凇',
  51: '小毛毛雨',
  53: '毛毛雨',
  55: '大毛毛雨',
  61: '小雨',
  63: '中雨',
  65: '大雨',
  71: '小雪',
  73: '中雪',
  75: '大雪',
  80: '阵雨',
  81: '强阵雨',
  82: '暴阵雨',
  95: '雷阵雨',
  96: '雷阵雨伴冰雹',
  99: '强雷阵雨伴冰雹'
}

type WeatherState =
  | { status: 'loading' }
  | { status: 'ready'; temperature: number; label: string }
  | { status: 'error' }

async function fetchHomeWeather(
  home: HomePlace
): Promise<Extract<WeatherState, { status: 'ready' }>> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(home.latitude))
  url.searchParams.set('longitude', String(home.longitude))
  url.searchParams.set('current', 'temperature_2m,weather_code')
  url.searchParams.set('timezone', 'Asia/Shanghai')

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`weather ${response.status}`)
  }
  const payload = (await response.json()) as {
    current?: { temperature_2m?: number; weather_code?: number }
  }
  const temperature = payload.current?.temperature_2m
  const code = payload.current?.weather_code
  if (typeof temperature !== 'number' || typeof code !== 'number') {
    throw new TypeError('weather payload incomplete')
  }
  return {
    status: 'ready',
    temperature,
    label: weatherLabel[code] ?? `天气码 ${code}`
  }
}

/** Live home-place weather strip via Open-Meteo. */
export function HomeWeather({ home }: { home: HomePlace }): ReactElement {
  const [state, setState] = useState<WeatherState>({ status: 'loading' })
  const { label, latitude, longitude } = home

  useEffect(() => {
    let cancelled = false
    const place = { label, latitude, longitude }

    async function load() {
      try {
        const next = await fetchHomeWeather(place)
        if (!cancelled) {
          setState(next)
        }
      } catch {
        if (!cancelled) {
          setState({ status: 'error' })
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [label, latitude, longitude])

  if (state.status === 'loading') {
    return (
      <span
        className='font-mono text-[length:var(--rp-code-font-size)] text-[var(--rp-c-text-3)]'
        aria-live='polite'
      >
        {home.label} · 天气加载中…
      </span>
    )
  }

  if (state.status === 'error') {
    return (
      <span className='font-mono text-[length:var(--rp-code-font-size)] text-[var(--rp-c-text-2)]'>
        {home.label}
      </span>
    )
  }

  return (
    <span
      className='font-mono text-[length:var(--rp-code-font-size)] text-[var(--rp-c-text-2)]'
      title='数据来自 Open-Meteo'
      aria-live='polite'
    >
      {home.label} · {state.label} {Math.round(state.temperature)}°C
    </span>
  )
}
