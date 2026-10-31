export const gridSize = 120
export const meteorCount = 3

export const Direction = {
  Up: 0,
  Right: 1,
  Down: 2,
  Left: 3
} as const

export type Direction = (typeof Direction)[keyof typeof Direction]

export interface Size {
  width: number
  height: number
}

export interface Meteor {
  x: number
  y: number
  direction: Direction
  speed: number
  length: number
  opacity: number
  size: Size
}

export function gridLine(span: number, random = Math.random) {
  const count = Math.floor(span / gridSize)
  const index = 1 + Math.floor(random() * Math.max(0, count - 1))
  return index * gridSize
}

export function tokenColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function withAlpha(color: string, alpha: number) {
  const hex = color.replace('#', '')
  const value = Number.parseInt(hex, 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

export function resetMeteor(meteor: Meteor, random = Math.random, pickGrid = gridLine): void {
  meteor.direction = Math.floor(random() * 4) as Direction
  meteor.speed = 2 + random() * 3
  meteor.length = gridSize * (1 + random() * 2)
  meteor.opacity = 0.6 + random() * 0.4

  switch (meteor.direction) {
    case Direction.Up: {
      meteor.x = pickGrid(meteor.size.width, random)
      meteor.y = meteor.size.height
      break
    }
    case Direction.Right: {
      meteor.x = 0
      meteor.y = pickGrid(meteor.size.height, random)
      break
    }
    case Direction.Down: {
      meteor.x = pickGrid(meteor.size.width, random)
      meteor.y = 0
      break
    }
    case Direction.Left: {
      meteor.x = meteor.size.width
      meteor.y = pickGrid(meteor.size.height, random)
      break
    }
    default: {
      break
    }
  }
}

export function createMeteor(size: Size, random = Math.random): Meteor {
  const meteor: Meteor = {
    x: 0,
    y: 0,
    direction: Direction.Up,
    speed: 0,
    length: 0,
    opacity: 0,
    size
  }
  resetMeteor(meteor, random)
  return meteor
}

export function updateMeteor(meteor: Meteor, random = Math.random): void {
  switch (meteor.direction) {
    case Direction.Up: {
      meteor.y -= meteor.speed
      if (meteor.y + meteor.length < 0) {
        resetMeteor(meteor, random)
      }
      break
    }
    case Direction.Right: {
      meteor.x += meteor.speed
      if (meteor.x > meteor.size.width) {
        resetMeteor(meteor, random)
      }
      break
    }
    case Direction.Down: {
      meteor.y += meteor.speed
      if (meteor.y > meteor.size.height) {
        resetMeteor(meteor, random)
      }
      break
    }
    case Direction.Left: {
      meteor.x -= meteor.speed
      if (meteor.x + meteor.length < 0) {
        resetMeteor(meteor, random)
      }
      break
    }
    default: {
      break
    }
  }
}

export function drawMeteor(
  meteor: Meteor,
  ctx: CanvasRenderingContext2D,
  head: string,
  tail: string
): void {
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

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
): void {
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
