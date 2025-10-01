'use client'

import { useEffect, useRef, useState } from 'react'
import css from './EnvelopeCard.module.css'
import animationData from '../data/animation.json'

interface EnvelopeCardProps {
  isAnimating: boolean
  onAnimationStart: () => void
}

// Easing functions
const easingFunctions = {
  cubicInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  cubicOut: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  sinusoidalOut: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  linear: 'linear'
}

// Parse rotation values like "132cw", "-132.5ccw", "0cw"
function parseRotation(value: string | number): number {
  if (typeof value === 'number') return value

  const match = value.match(/^(-?[\d.]+)(cw|ccw)$/)
  if (!match) return 0

  const degrees = parseFloat(match[1])
  const direction = match[2]

  return direction === 'ccw' ? -degrees : degrees
}

// Build transform string from transform object
function buildTransform(transforms: any): string {
  const parts: string[] = []

  if (transforms.translateX !== undefined) parts.push(`translateX(${transforms.translateX}%)`)
  if (transforms.translateY !== undefined) parts.push(`translateY(${transforms.translateY}%)`)
  if (transforms.translateZ !== undefined) parts.push(`translateZ(${transforms.translateZ}px)`)
  if (transforms.rotateX !== undefined) parts.push(`rotateX(${parseRotation(transforms.rotateX)}deg)`)
  if (transforms.rotateY !== undefined) parts.push(`rotateY(${parseRotation(transforms.rotateY)}deg)`)
  if (transforms.rotate !== undefined) parts.push(`rotate(${transforms.rotate}deg)`)
  if (transforms.scale !== undefined) parts.push(`scale(${transforms.scale})`)

  return parts.join(' ')
}

export default function EnvelopeCardV2({ isAnimating, onAnimationStart }: EnvelopeCardProps) {
  const [elementStyles, setElementStyles] = useState<Record<string, any>>({})
  const timeoutsRef = useRef<number[]>([])

  useEffect(() => {
    onAnimationStart()
    playAnimation()
  }, [onAnimationStart])

  useEffect(() => {
    if (isAnimating) {
      playAnimation()
    }
  }, [isAnimating])

  const playAnimation = () => {
    // Clear all existing timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    const intro = animationData.intro

    // Step 1: Initial state (duration: 0)
    const step1 = intro.steps[0]
    applyTransforms(step1.transforms, 0)

    // Step 2: Main animations (with delays and durations)
    const step2 = intro.steps[1]

    // Envelope animation
    if (Array.isArray(step2.transforms.envelope)) {
      step2.transforms.envelope.forEach((anim: any) => {
        const timeout = window.setTimeout(() => {
          setElementStyles(prev => ({
            ...prev,
            envelope: {
              ...prev.envelope,
              transform: buildTransform({
                translateX: -50,
                translateY: `calc(-50% + ${anim.translateY}%)`,
                scale: anim.scale
              }),
              transition: `all ${anim.duration}ms ${easingFunctions[anim.ease as keyof typeof easingFunctions] || easingFunctions.cubicInOut}`
            }
          }))
        }, anim.delay)
        timeoutsRef.current.push(timeout)
      })
    }

    // Envelope card animations (multiple simultaneous)
    if (Array.isArray(step2.transforms.envelopeCard)) {
      step2.transforms.envelopeCard.forEach((anim: any) => {
        const timeout = window.setTimeout(() => {
          setElementStyles(prev => {
            const currentTransform = prev.envelopeCard?.transform || ''
            const newTransform = {
              translateX: anim.translateX ?? 0,
              translateY: anim.translateY ?? -41.67,
              translateZ: 0,
              rotate: anim.rotate ?? -90,
              scale: anim.scale ?? 0.68
            }

            return {
              ...prev,
              envelopeCard: {
                ...prev.envelopeCard,
                transform: buildTransform(newTransform),
                transition: `all ${anim.duration}ms ${easingFunctions[anim.ease as keyof typeof easingFunctions] || easingFunctions.linear}`
              }
            }
          })
        }, anim.delay)
        timeoutsRef.current.push(timeout)
      })
    }

    // Envelope back flap
    if (step2.transforms.envelopeBackFlap) {
      const anim = step2.transforms.envelopeBackFlap
      const timeout = window.setTimeout(() => {
        setElementStyles(prev => ({
          ...prev,
          envelopeBackFlap: {
            ...prev.envelopeBackFlap,
            transform: buildTransform({
              translateY: 0.03,
              translateZ: -0.4,
              rotateX: parseRotation(anim.rotateX)
            }),
            transition: `all ${anim.duration}ms ${easingFunctions[anim.ease as keyof typeof easingFunctions]}`
          }
        }))
      }, anim.delay)
      timeoutsRef.current.push(timeout)
    }

    // Envelope front flap
    if (step2.transforms.envelopeFrontFlap) {
      const anim = step2.transforms.envelopeFrontFlap
      const timeout = window.setTimeout(() => {
        setElementStyles(prev => ({
          ...prev,
          envelopeFrontFlap: {
            ...prev.envelopeFrontFlap,
            transform: buildTransform({
              translateY: -0.25,
              translateZ: -0.4,
              rotateY: 180,
              rotateX: parseRotation(anim.rotateX)
            }),
            transition: `all ${anim.duration}ms ${easingFunctions[anim.ease as keyof typeof easingFunctions]}`
          }
        }))
      }, anim.delay)
      timeoutsRef.current.push(timeout)
    }
  }

  const applyTransforms = (transforms: any, delay: number = 0) => {
    const timeout = window.setTimeout(() => {
      const newStyles: Record<string, any> = {}

      Object.keys(transforms).forEach(elementId => {
        const transform = transforms[elementId]

        newStyles[elementId] = {
          transform: buildTransform(transform),
          visibility: transform.visibility,
          opacity: transform.opacity,
          zIndex: transform.zIndex,
          transition: 'none'
        }
      })

      setElementStyles(newStyles)
    }, delay)

    timeoutsRef.current.push(timeout)
  }

  const handleReplay = () => {
    // Clear all timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    // Reset and replay
    setTimeout(() => {
      playAnimation()
    }, 100)
  }

  return (
    <div className={css.container}>
      <div className={css.mediaRoot}>
        <div className={css.graphics}>
          {/* CARD */}
          <div
            id="card"
            className={css.scenario}
            style={{
              top: '50%',
              left: '50%',
              width: '267.375px',
              height: '374.325px',
              ...elementStyles.card
            }}
          >
            <div id="cardChild" className={css.scenarioChild} style={elementStyles.cardChild}>
              <div id="cardFront" className={css.scene} style={elementStyles.cardFront}>
                <div className={css.cardFrontContent}>
                  <div className={css.cardHeader}></div>
                  <h2>You're Invited</h2>
                  <p>to our special event</p>
                </div>
              </div>
            </div>
          </div>

          {/* ENVELOPE */}
          <div
            id="envelope"
            className={css.scenario}
            style={{
              top: '50%',
              left: '50%',
              width: '267.375px',
              height: '375px',
              ...elementStyles.envelope
            }}
          >
            <div id="envelopeChild" className={css.scenarioChild} style={elementStyles.envelopeChild}>
              <div
                id="envelopeBackFlap"
                className={css.scene}
                style={{
                  transformOrigin: '50% 48.766%',
                  ...elementStyles.envelopeBackFlap
                }}
              >
                <div className={css.envelopeFlap}></div>
              </div>

              <div id="envelopeBackBase" className={css.scene} style={elementStyles.envelopeBackBase}>
                <div className={css.envelopeBase}></div>
              </div>

              <div id="envelopeCard" className={css.scene} style={elementStyles.envelopeCard}>
                <div className={css.envelopeCardInner}>
                  <div className={css.cardHeaderSmall}></div>
                </div>
              </div>

              <div id="envelopeBackCover" className={css.scene} style={elementStyles.envelopeBackCover}>
                <div className={css.envelopeCover}></div>
              </div>

              <div id="envelopeFrontBase" className={css.scene} style={elementStyles.envelopeFrontBase}>
                <div className={css.envelopeFrontBase}></div>
              </div>

              <div
                id="envelopeFrontFlap"
                className={css.scene}
                style={{
                  transformOrigin: '50% 48.766%',
                  ...elementStyles.envelopeFrontFlap
                }}
              >
                <div className={css.envelopeFrontFlap}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={css.replayButton}>
        <button onClick={handleReplay} className={css.replayBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5.7l10.7 5.8L7 17.3V5.7m0-1c-.6 0-1 .4-1 1v11.6c0 .6.4 1 1 1 .2 0 .3 0 .5-.1l10.7-5.8c.5-.3.7-.9.4-1.4-.1-.2-.2-.3-.4-.4L7.5 4.8c-.2-.1-.3-.1-.5-.1z" />
          </svg>
          <span>Replay</span>
        </button>
      </div>

      <div className={css.status}>
        <p>Animation running with original JSON data</p>
      </div>
    </div>
  )
}
