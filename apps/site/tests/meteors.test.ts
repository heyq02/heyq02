/** @vitest-environment happy-dom */
import { expect, it, vi } from 'vite-plus/test'

import {
  Direction,
  createMeteor,
  drawGrid,
  drawMeteor,
  gridLine,
  resetMeteor,
  updateMeteor,
  withAlpha
} from '../src/meteors.ts'

function fakeCtx() {
  const gradient = { addColorStop: vi.fn<(offset: number, color: string) => void>() }
  const beginPath = vi.fn<() => void>()
  const createLinearGradient = vi.fn<
    (x0: number, y0: number, x1: number, y1: number) => CanvasGradient
  >(() => gradient)
  const stroke = vi.fn<() => void>()
  return {
    ctx: {
      beginPath,
      clearRect: vi.fn<(x: number, y: number, w: number, h: number) => void>(),
      createLinearGradient,
      lineTo: vi.fn<(x: number, y: number) => void>(),
      moveTo: vi.fn<(x: number, y: number) => void>(),
      setTransform:
        vi.fn<(a: number, b: number, c: number, d: number, e: number, f: number) => void>(),
      stroke,
      lineWidth: 0,
      strokeStyle: ''
    } as unknown as CanvasRenderingContext2D,
    beginPath,
    createLinearGradient,
    stroke
  }
}

it('snaps grid lines and converts hex colors with alpha', () => {
  expect(gridLine(360, () => 0)).toBe(120)
  expect(gridLine(360, () => 0.99)).toBe(240)
  expect(withAlpha('#12e5e5', 0.5)).toBe('rgba(18, 229, 229, 0.5)')
  expect(withAlpha('ff351a', 1)).toBe('rgba(255, 53, 26, 1)')
})

it('creates and resets meteors for every direction', () => {
  const size = { width: 480, height: 360 }
  const values = [0, 0.2, 0.4, 0.6, 0.8]
  let i = 0
  const random = () => values[i++ % values.length]

  const up = createMeteor(size, () => 0)
  expect(up.direction).toBe(Direction.Up)
  expect(up.y).toBe(size.height)

  const right = createMeteor(size, () => 0.3)
  expect(right.direction).toBe(Direction.Right)
  expect(right.x).toBe(0)

  const down = createMeteor(size, () => 0.5)
  expect(down.direction).toBe(Direction.Down)
  expect(down.y).toBe(0)

  const left = createMeteor(size, () => 0.8)
  expect(left.direction).toBe(Direction.Left)
  expect(left.x).toBe(size.width)

  resetMeteor(up, random)
  expect([0, 1, 2, 3]).toContain(up.direction)
})

it('updates meteors and respawns when they leave the canvas', () => {
  const size = { width: 240, height: 240 }
  const meteor = createMeteor(size, () => 0)
  meteor.direction = Direction.Up
  meteor.y = -10
  meteor.length = 5
  meteor.speed = 1
  updateMeteor(meteor, () => 0.3)
  expect(meteor.direction).toBe(Direction.Right)

  meteor.direction = Direction.Right
  meteor.x = size.width + 1
  updateMeteor(meteor, () => 0.5)
  expect(meteor.direction).toBe(Direction.Down)

  meteor.direction = Direction.Down
  meteor.y = size.height + 1
  updateMeteor(meteor, () => 0.8)
  expect(meteor.direction).toBe(Direction.Left)

  meteor.direction = Direction.Left
  meteor.x = -10
  meteor.length = 5
  updateMeteor(meteor, () => 0)
  expect(meteor.direction).toBe(Direction.Up)

  meteor.direction = Direction.Up
  meteor.y = 100
  meteor.speed = 2
  meteor.length = 10
  updateMeteor(meteor)
  expect(meteor.y).toBe(98)

  meteor.direction = Direction.Right
  meteor.x = 10
  meteor.speed = 2
  updateMeteor(meteor)
  expect(meteor.x).toBe(12)

  meteor.direction = Direction.Down
  meteor.y = 10
  meteor.speed = 2
  updateMeteor(meteor)
  expect(meteor.y).toBe(12)

  meteor.direction = Direction.Left
  meteor.x = 100
  meteor.length = 10
  meteor.speed = 2
  updateMeteor(meteor)
  expect(meteor.x).toBe(98)
})

it('draws meteors and the background grid', () => {
  const { ctx, beginPath, createLinearGradient, stroke } = fakeCtx()
  const size = { width: 240, height: 240 }

  for (const direction of [
    Direction.Up,
    Direction.Right,
    Direction.Down,
    Direction.Left
  ] as const) {
    const meteor = createMeteor(size, () => 0)
    meteor.direction = direction
    meteor.x = 100
    meteor.y = 100
    meteor.length = 40
    meteor.opacity = 1
    drawMeteor(meteor, ctx, '#12e5e5', '#ff351a')
  }

  drawGrid(ctx, 240, 240, '#8080801a')
  expect(beginPath).toHaveBeenCalled()
  expect(stroke).toHaveBeenCalled()
  expect(createLinearGradient).toHaveBeenCalled()
})

it('ignores an unknown meteor direction', () => {
  const meteor = createMeteor({ width: 100, height: 80 }, () => 0)
  meteor.direction = 4 as Direction
  updateMeteor(meteor)
  drawMeteor(meteor, fakeCtx().ctx, '#12e5e5', '#ff351a')
  resetMeteor(meteor, () => 1)
  expect(meteor.direction).toBe(4)
})
