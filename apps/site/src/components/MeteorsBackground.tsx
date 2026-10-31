import { useEffect, useRef } from 'react'

import {
  createMeteor,
  drawGrid,
  drawMeteor,
  meteorCount,
  tokenColor,
  updateMeteor
} from '../meteors.ts'

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
