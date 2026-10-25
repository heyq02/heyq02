import { useEffect, useRef } from 'react'

const gridSize = 120
const meteorCount = 3

const Direction = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3
} as const

type Direction = (typeof Direction)[keyof typeof Direction]

interface Size {
  width: number
  height: number
}

interface Meteor {
  x: number
  y: number
  direction: Direction
  speed: number
  length: number
  opacity: number
  size: Size
}

function gridLine(span: number) {
  const count = Math.floor(span / gridSize)
  const index = 1 + Math.floor(Math.random() * Math.max(0, count - 1))
  return index * gridSize
}

function tokenColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

function withAlpha(color: string, alpha: number) {
  const hex = color.replace('#', '')
  const value = Number.parseInt(hex, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

function resetMeteor(meteor: Meteor) {
  meteor.direction = Math.floor(Math.random() * 4) as Direction
  meteor.speed = 2 + Math.random() * 3
  meteor.length = gridSize * (1 + Math.random() * 2)
  meteor.opacity = 0.6 + Math.random() * 0.4

  switch (meteor.direction) {
    case Direction.Up: {
      meteor.x = gridLine(meteor.size.width)
      meteor.y = meteor.size.height
      break
    }
    case Direction.Right: {
      meteor.x = 0
      meteor.y = gridLine(meteor.size.height)
      break
    }
    case Direction.Down: {
      meteor.x = gridLine(meteor.size.width)
      meteor.y = 0
      break
    }
    case Direction.Left: {
      meteor.x = meteor.size.width
      meteor.y = gridLine(meteor.size.height)
      break
    }
    default: {
      break
    }
  }
}

function createMeteor(size: Size): Meteor {
  const meteor: Meteor = {
    x: 0,
    y: 0,
    direction: Direction.Up,
    speed: 0,
    length: 0,
    opacity: 0,
    size
  }
  resetMeteor(meteor)
  return meteor
}

function updateMeteor(meteor: Meteor) {
  switch (meteor.direction) {
    case Direction.Up: {
      meteor.y -= meteor.speed
      if (meteor.y + meteor.length < 0) {
        resetMeteor(meteor)
      }
      break
    }
    case Direction.Right: {
      meteor.x += meteor.speed
      if (meteor.x > meteor.size.width) {
        resetMeteor(meteor)
      }
      break
    }
    case Direction.Down: {
      meteor.y += meteor.speed
      if (meteor.y > meteor.size.height) {
        resetMeteor(meteor)
      }
      break
    }
    case Direction.Left: {
      meteor.x -= meteor.speed
      if (meteor.x + meteor.length < 0) {
        resetMeteor(meteor)
      }
      break
    }
    default: {
      break
    }
  }
}

function drawMeteor(meteor: Meteor, ctx: CanvasRenderingContext2D, head: string, tail: string) {
  let endX = meteor.x
  let endY = meteor.y

  switch (meteor.direction) {
    case Direction.Up: {
      endY = meteor.y + meteor.length
      break
    }
    case Direction.Right: {
      endX = meteor.x - meteor.length
      break
    }
    case Direction.Down: {
      endY = meteor.y - meteor.length
      break
    }
    case Direction.Left: {
      endX = meteor.x + meteor.length
      break
    }
    default: {
      break
    }
  }

  const gradient = ctx.createLinearGradient(meteor.x, meteor.y, endX, endY)
  gradient.addColorStop(0, withAlpha(head, meteor.opacity))
  gradient.addColorStop(0.02, withAlpha(head, meteor.opacity * 0.8))
  gradient.addColorStop(0.05, withAlpha(tail, meteor.opacity * 0.6))
  gradient.addColorStop(1, withAlpha(tail, 0))

  ctx.beginPath()
  ctx.strokeStyle = gradient
  ctx.lineWidth = 2
  ctx.moveTo(meteor.x, meteor.y)
  ctx.lineTo(endX, endY)
  ctx.stroke()
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()

  for (let x = 0; x <= width; x += gridSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }

  ctx.stroke()
}

export function MeteorsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) {
      return () => {}
    }

    const size = { width: 0, height: 0 }
    const reduced = globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = globalThis.devicePixelRatio || 1
      size.width = rect.width
      size.height = rect.height
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    const grid = tokenColor('--color-grid')
    const head = tokenColor('--color-meteor-head')
    const tail = tokenColor('--color-meteor-tail')

    let frame = 0

    if (reduced) {
      drawGrid(ctx, size.width, size.height, grid)
      return () => {
        observer.disconnect()
      }
    }

    const meteors = Array.from({ length: meteorCount }, () => createMeteor(size))

    const animate = () => {
      ctx.clearRect(0, 0, size.width, size.height)
      drawGrid(ctx, size.width, size.height, grid)
      for (const meteor of meteors) {
        updateMeteor(meteor)
        drawMeteor(meteor, ctx, head, tail)
      }
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return (
    <canvas
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 h-full w-full'
      ref={canvasRef}
    />
  )
}
