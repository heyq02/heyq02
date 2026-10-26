/** @vitest-environment happy-dom */
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vite-plus/test'

import { MeteorsBackground } from '../src/components/MeteorsBackground.tsx'

function mediaQuery(matches: boolean): MediaQueryList {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    }
  } as unknown as MediaQueryList
}

function mockCanvas() {
  const gradient = { addColorStop: vi.fn<(offset: number, color: string) => void>() }
  const beginPath = vi.fn<() => void>()
  const clearRect = vi.fn<(x: number, y: number, w: number, h: number) => void>()
  const createLinearGradient = vi.fn<
    (x0: number, y0: number, x1: number, y1: number) => typeof gradient
  >(() => gradient)
  const lineTo = vi.fn<(x: number, y: number) => void>()
  const moveTo = vi.fn<(x: number, y: number) => void>()
  const setTransform =
    vi.fn<(a: number, b: number, c: number, d: number, e: number, f: number) => void>()
  const stroke = vi.fn<() => void>()
  const ctx = {
    beginPath,
    clearRect,
    createLinearGradient,
    lineTo,
    moveTo,
    setTransform,
    stroke,
    lineWidth: 0,
    strokeStyle: ''
  }

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 240,
    height: 180,
    top: 0,
    left: 0,
    bottom: 180,
    right: 240,
    x: 0,
    y: 0,
    toJSON() {
      return {}
    }
  })

  return { beginPath, clearRect, setTransform, stroke }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

it('draws a static grid when reduced motion is preferred', () => {
  const { stroke } = mockCanvas()
  vi.spyOn(globalThis, 'matchMedia').mockReturnValue(mediaQuery(true))

  const { unmount } = render(<MeteorsBackground />)
  expect(stroke).toHaveBeenCalled()
  unmount()
})

it('animates meteors when motion is allowed', () => {
  const { clearRect, setTransform } = mockCanvas()
  const frames: FrameRequestCallback[] = []
  vi.spyOn(globalThis, 'matchMedia').mockReturnValue(mediaQuery(false))
  Object.defineProperty(globalThis, 'devicePixelRatio', { configurable: true, value: 0 })
  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
    frames.push(cb)
    return frames.length
  })
  const cancel = vi
    .spyOn(globalThis, 'cancelAnimationFrame')
    .mockImplementation((_id: number) => {})

  const { unmount } = render(<MeteorsBackground />)
  expect(frames.length).toBeGreaterThan(0)
  frames[0]?.(0)
  expect(clearRect).toHaveBeenCalled()
  expect(setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0, 0)
  unmount()
  expect(cancel).toHaveBeenCalled()
})

it('exits cleanly when the canvas context is unavailable', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
  const { unmount } = render(<MeteorsBackground />)
  expect(() => {
    unmount()
  }).not.toThrow()
})
