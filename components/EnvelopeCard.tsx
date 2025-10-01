'use client'

import { useEffect, useState } from 'react'
import styles from './EnvelopeCard.module.css'

interface EnvelopeCardProps {
  isAnimating: boolean
  onAnimationStart: () => void
}

export default function EnvelopeCard({ isAnimating, onAnimationStart }: EnvelopeCardProps) {
  const [phase, setPhase] = useState<'initial' | 'start' | 'flap-open' | 'card-slide' | 'card-rotate'>('initial')
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (isAnimating && !hasStarted) {
      playAnimation()
    }
  }, [isAnimating, hasStarted])

  const playAnimation = () => {
    setHasStarted(true)

    // Step 1: Start opening flap immediately
    setTimeout(() => {
      setPhase('start')
    }, 0)

    // Step 2: Flap fully open (after 750ms animation)
    setTimeout(() => {
      setPhase('flap-open')
    }, 750)

    // Step 3: Card slides up (after flap is open)
    setTimeout(() => {
      setPhase('card-slide')
    }, 1260)

    // Step 4: Card rotates
    setTimeout(() => {
      setPhase('card-rotate')
    }, 2250)
  }

  const handleEnvelopeClick = () => {
    if (!hasStarted) {
      onAnimationStart()
      playAnimation()
    }
  }

  const handleReplay = () => {
    // Force reload to reset everything
    window.location.reload()
  }

  return (
    <div className={styles.container}>
      <div className={styles.mediaRoot}>
        <div
          className={styles.graphics}
          style={{
            opacity: 1
          }}
        >

          {/* CARD - 원본과 동일한 구조 (사용 안함) */}
          <div
            id="card"
            className={styles.scenario}
            style={{
              top: '50%',
              left: '50%',
              width: '267.375px',
              height: '374.325px',
              visibility: 'hidden',
              zIndex: 1,
              transform: 'translateX(-50%) translateY(-50%) scale(1.2)',
              transition: 'all 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95)'
            }}
          >
            <div
              id="cardChild"
              className={styles.scenarioChild}
              style={{
                transform: 'rotateY(0deg)'
              }}
            >
              <div id="cardFront" className={styles.scene}>
                <div className={styles.cardFrontContent}>
                  <div className={styles.cardHeader}></div>
                  <h2>You're Invited</h2>
                  <p>to our special event</p>
                </div>
              </div>
            </div>
          </div>

          {/* ENVELOPE - 가로로 긴 봉투 */}
          <div
            id="envelope"
            className={styles.scenario}
            onClick={handleEnvelopeClick}
            style={{
              top: '50%',
              left: '50%',
              width: '380px',
              height: '250px',
              visibility: 'inherit',
              zIndex: phase === 'initial' ? 1 : 0,
              cursor: hasStarted ? 'default' : 'pointer',
              transform: phase === 'initial'
                ? 'translateX(-50%) translateY(calc(-50% - 28%)) scale(1.0)'
                : 'translateX(-50%) translateY(calc(-50% + 210%)) scale(2.0)',
              transition: 'all 2s cubic-bezier(0.445, 0.05, 0.55, 0.95)'
            }}
          >
            <div id="envelopeChild" className={styles.scenarioChild}>

              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: '#8B6F47',
                overflow: 'visible'
              }}>

                {/* 봉투 내부 바닥 (내지 - 위쪽까지 확장) */}
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: '100%',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 0
                }}>
                  <svg width="100%" height="100%" viewBox="0 0 340 250" preserveAspectRatio="none">
                    <defs>
                      <pattern id="damaskPattern" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                        <rect width="40" height="40" fill="#F5EFE7"/>
                        <path d="M20 5 Q25 10 20 15 Q15 10 20 5 M20 25 Q25 30 20 35 Q15 30 20 25 M5 20 Q10 25 5 30 Q0 25 5 20 M35 20 Q40 25 35 30 Q30 25 35 20" fill="none" stroke="#E8DCC8" strokeWidth="0.5" opacity="0.6"/>
                      </pattern>
                    </defs>
                    <rect width="340" height="250" fill="url(#damaskPattern)" rx="4"/>
                  </svg>
                </div>

                {/* 아래쪽 플랩 */}
                <svg width="335" height="173" viewBox="0 0 335 173" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: '3px', left: 0, zIndex: 4, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <defs>
                    <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#A68B5B" />
                      <stop offset="50%" stopColor="#8B6F47" />
                      <stop offset="100%" stopColor="#6B5738" />
                    </linearGradient>
                  </defs>
                  <path d="M333.604 164.977C333.241 162.314 331.568 159.911 329.015 158.389L180.084 68.9955C172.529 64.4654 162.49 64.4654 154.917 68.9955L5.98593 158.372C3.43302 159.911 1.75983 162.297 1.39759 164.96L0.638619 170.562C0.569621 171.081 1.03535 171.547 1.65633 171.547H333.345C333.949 171.547 334.432 171.081 334.363 170.562L333.604 164.96V164.977Z" fill="url(#bottomGradient)" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                </svg>

                {/* 왼쪽 플랩 */}
                <svg width="335" height="173" viewBox="0 0 335 173" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 2, filter: 'drop-shadow(-2px 0 3px rgba(0,0,0,0.15))' }}>
                  <defs>
                    <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#5D4A2F" />
                      <stop offset="100%" stopColor="#8B6F47" />
                    </linearGradient>
                  </defs>
                  <path d="M12.8506 0.904175H0.5V172.222C0.5 172.654 0.965734 173 1.51771 173H19.1466L155.469 90.1594C158.177 88.5168 158.177 85.4044 155.469 83.7618L24.0627 3.8782C20.8888 1.94163 16.9387 0.904175 12.8678 0.904175H12.8506Z" fill="url(#leftGradient)" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                </svg>

                {/* 오른쪽 플랩 */}
                <svg width="335" height="173" viewBox="0 0 335 173" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 3, filter: 'drop-shadow(2px 0 3px rgba(0,0,0,0.15))' }}>
                  <defs>
                    <linearGradient id="rightGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#5D4A2F" />
                      <stop offset="100%" stopColor="#8B6F47" />
                    </linearGradient>
                  </defs>
                  <path d="M322.132 0.904175H334.483V172.222C334.483 172.654 334.017 173 333.465 173H315.836L179.515 90.1594C176.806 88.5168 176.806 85.4044 179.515 83.7618L310.938 3.89551C314.112 1.95893 318.062 0.921483 322.132 0.921483V0.904175Z" fill="url(#rightGradient)" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                </svg>

                {/* 위쪽 뚜껑 (열리는 부분) */}
                <div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '50%',
                    top: 0,
                    left: 0,
                    transformOrigin: 'center top',
                    transform: phase === 'initial'
                      ? 'rotateX(0deg)'
                      : 'rotateX(180deg)',
                    transition: 'transform 0.75s cubic-bezier(0.445, 0.05, 0.55, 0.95), z-index 0s linear 0.75s',
                    zIndex: phase === 'initial' ? 5 : (phase === 'start' ? 5 : -1),
                    pointerEvents: 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* 뚜껑 외부 (갈색) */}
                  <svg
                    width="334"
                    height="125"
                    viewBox="0 0 334 125"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.25))'
                    }}
                  >
                    <defs>
                      <linearGradient id="topGradient" x1="50%" y1="100%" x2="50%" y2="0%">
                        <stop offset="0%" stopColor="#5D4A2F" />
                        <stop offset="50%" stopColor="#74583A" />
                        <stop offset="100%" stopColor="#8B6F47" />
                      </linearGradient>
                    </defs>
                    <path d="M0.897426 7.47704C1.25968 10.4096 2.93296 13.0489 5.486 14.7222L154.425 120.673C161.981 125.659 172.02 125.659 179.593 120.673L328.532 14.7394C331.085 13.0489 332.758 10.4096 333.121 7.49429L333.88 1.31869C333.949 0.749427 333.483 0.231918 332.862 0.231918H167L1.15618 0.231918C0.552421 0.231918 0.069413 0.732176 0.138414 1.31869L0.897426 7.49429V7.47704Z" fill="url(#topGradient)" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
                  </svg>

                  {/* 뚜껑 내부 (내지 - 열렸을 때만 보임, 뚜껑 모양) */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    transform: 'rotateX(180deg) scaleY(-1)',
                    zIndex: 1,
                    backfaceVisibility: 'hidden'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 334 125" preserveAspectRatio="none">
                      <defs>
                        <pattern id="damaskPatternTop" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                          <rect width="40" height="40" fill="#F5EFE7"/>
                          <path d="M20 5 Q25 10 20 15 Q15 10 20 5 M20 25 Q25 30 20 35 Q15 30 20 25 M5 20 Q10 25 5 30 Q0 25 5 20 M35 20 Q40 25 35 30 Q30 25 35 20" fill="none" stroke="#E8DCC8" strokeWidth="0.5" opacity="0.6"/>
                        </pattern>
                      </defs>
                      {/* 뚜껑과 같은 삼각형 모양 - 약간 작게 */}
                      <path d="M20 18C22 20 25 22 30 25L160 100C166 103.5 170 103.5 176 100L306 25C311 22 314 20 316 18L314 15H22L20 18Z" fill="url(#damaskPatternTop)" opacity="0.95"/>
                    </svg>
                  </div>
                </div>

                {/* 카드 */}
                <div
                  id="envelopeCard"
                  className={styles.scene}
                  style={{
                    visibility: 'inherit',
                    width: '220px',
                    height: '340px',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    zIndex: phase === 'initial' || phase === 'start' || phase === 'flap-open' || phase === 'card-slide' ? 1 : 10,
                    transform:
                      phase === 'initial' || phase === 'start' || phase === 'flap-open'
                        ? 'translateX(-50%) translateY(-50%) translateZ(-0.1px) rotate(-90deg) scale(0.95)'
                        : phase === 'card-slide'
                        ? 'translateX(-50%) translateY(-140%) translateZ(10px) rotate(-90deg) scale(1)'
                        : 'translateX(-50%) translateY(-130%) translateZ(20px) rotate(0deg) scale(1)',
                    transition: phase === 'card-rotate'
                      ? 'all 0.8s cubic-bezier(0.445, 0.05, 0.55, 0.95)'
                      : 'all 1.5s cubic-bezier(0.445, 0.05, 0.55, 0.95)'
                  }}
                >
                  <div className={styles.envelopeCardInner}>
                    <div className={styles.cardHeaderSmall}>
                      <div className={styles.headerDecoration}>✦</div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>You're Invited</h3>
                      <p className={styles.cardSubtitle}>To a Special Event</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Replay Button */}
      <div className={styles.replayButton}>
        <button onClick={handleReplay} className={styles.replayBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 5.7l10.7 5.8L7 17.3V5.7m0-1c-.6 0-1 .4-1 1v11.6c0 .6.4 1 1 1 .2 0 .3 0 .5-.1l10.7-5.8c.5-.3.7-.9.4-1.4-.1-.2-.2-.3-.4-.4L7.5 4.8c-.2-.1-.3-.1-.5-.1z" />
          </svg>
          <span>Replay</span>
        </button>
      </div>

      <div className={styles.status}>
        <p>Phase: {
          phase === 'initial' ? '📪 준비' :
          phase === 'start' ? '🚀 시작' :
          phase === 'flap-open' ? '📬 플랩 열림' :
          '🔄 카드 회전 + 슬라이드'
        }</p>
      </div>
    </div>
  )
}