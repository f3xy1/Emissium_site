import React, { useEffect, useRef } from 'react'
import './MatrixBackground.css'

const HEX_CHARS = '0123456789ABCDEF'

function MatrixBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class HexParticle {
      constructor() {
        this.reset()
        this.y = Math.random() * canvas.height
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = -20
        this.speed = 0.3 + Math.random() * 1.5
        this.char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
        this.opacity = 0.02 + Math.random() * 0.08
        this.fontSize = 12 + Math.floor(Math.random() * 18)
        this.changeInterval = 10 + Math.floor(Math.random() * 30)
        this.tick = 0
      }

      update() {
        this.y += this.speed
        this.tick++
        if (this.tick % this.changeInterval === 0) {
          this.char = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]
        }
        if (this.y > canvas.height + 20) {
          this.reset()
        }
      }

      draw(ctx) {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.font = `${this.fontSize}px Orbitron`
        ctx.fillStyle = getComputedStyle(document.documentElement)
          .getPropertyValue('--neon-primary').trim() || '#a855f7'
        ctx.shadowColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--neon-glow').trim() || 'rgba(168, 85, 247, 0.6)'
        ctx.shadowBlur = 8
        ctx.fillText(this.char, this.x, this.y)
        ctx.restore()
      }
    }

    // Create particles
    const particleCount = Math.floor((canvas.width * canvas.height) / 8000)
    for (let i = 0; i < Math.min(particleCount, 150); i++) {
      particles.push(new HexParticle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw(ctx)
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="matrix-bg" />
}

export default MatrixBackground