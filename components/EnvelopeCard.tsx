'use client'

import { useEffect, useState, useRef } from 'react'
import styles from './EnvelopeCard.module.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCreative } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

// Swiper CSS
import 'swiper/css'
import 'swiper/css/effect-creative'

// Swiper 커스텀 스타일 - 동적 업데이트
function updateSwiperStyles(width: number, height: number) {
  const styles = `
    .envelope-swiper {
      width: 100% !important;
      height: 100% !important;
      overflow: visible !important;
    }
    .envelope-swiper .swiper-wrapper {
      overflow: visible !important;
    }
    .envelope-swiper .swiper-slide {
      width: ${width}px !important;
      height: ${height}px !important;
      overflow: visible !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }
    .envelope-swiper .swiper-slide > div {
      width: 100% !important;
      height: 100% !important;
    }
    .envelope-swiper .swiper-slide-shadow,
    .envelope-swiper .swiper-slide-shadow-creative {
      display: none !important;
    }
  `

  if (typeof document !== 'undefined') {
    let styleEl = document.getElementById('swiper-custom-styles') as HTMLStyleElement
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'swiper-custom-styles'
      document.head.appendChild(styleEl)
    }
    styleEl.textContent = styles
  }
}

interface Card {
  id: number
  title: string
  subtitle: string
  decoration: string
}

interface EnvelopeCardProps {
  isAnimating: boolean
  onAnimationStart: () => void
}

const ALL_CARDS: Card[] = [
  { id: 1, title: "You're Invited", subtitle: "To a Special Event", decoration: "" },
  { id: 2, title: "Save the Date", subtitle: "Join Us for Celebration", decoration: "" },
  { id: 3, title: "Wedding Invitation", subtitle: "Our Special Day", decoration: "" },
  { id: 4, title: "Birthday Party", subtitle: "Let's Celebrate Together", decoration: "" },
]

export default function EnvelopeCard({ isAnimating, onAnimationStart }: EnvelopeCardProps) {
  const [phase, setPhase] = useState<'initial' | 'start' | 'flap-open' | 'card-slide' | 'card-rotate'>('initial')
  const [hasStarted, setHasStarted] = useState(false)
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)
  const [finalCardSize, setFinalCardSize] = useState({ width: 440, height: 680 })
  const [swiperPosition, setSwiperPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
  const [swiperOpacity, setSwiperOpacity] = useState(0)
  const measureIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // 초기 크기는 대략적으로만 설정 (실제 측정값으로 나중에 업데이트됨)
  useEffect(() => {
    // 화면 크기 기준으로 카드 크기 계산
    const aspectRatio = 1.55 // 가로:세로 비율

    // 최대 크기 제한 (PC에서 너무 커지지 않도록)
    const maxWidth = 500
    const maxHeight = maxWidth * aspectRatio

    // 반응형 크기 (모바일에서는 화면에 맞춤)
    const vwWidth = window.innerWidth * 0.6 // 60vw
    const vhHeight = window.innerHeight * 0.85 // 85vh

    let finalWidth = Math.min(maxWidth, vwWidth)
    let finalHeight = finalWidth * aspectRatio

    // 높이가 화면을 넘으면 높이 기준으로 조정
    if (finalHeight > vhHeight) {
      finalHeight = vhHeight
      finalWidth = finalHeight / aspectRatio
    }

    updateSwiperStyles(finalWidth, finalHeight)
  }, [])

  // Swiper 활성화 후 봉투 카드 위치를 계속 추적
  useEffect(() => {
    if (isSwipeEnabled) {
      const measurePosition = () => {
        const envelopeCard = document.getElementById('envelope-card-inner')
        if (envelopeCard) {
          const rect = envelopeCard.getBoundingClientRect()

          setFinalCardSize({
            width: rect.width,
            height: rect.height
          })

          setSwiperPosition({
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            transform: 'none'
          })

          updateSwiperStyles(rect.width, rect.height)
        }
      }

      // 초기 측정
      measurePosition()

      // resize 이벤트 리스너
      window.addEventListener('resize', measurePosition)

      return () => {
        window.removeEventListener('resize', measurePosition)
      }
    }
  }, [isSwipeEnabled])

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

    // Step 2: Flap fully open
    setTimeout(() => {
      setPhase('flap-open')
    }, 750)

    // Step 3: Card slides up
    setTimeout(() => {
      setPhase('card-slide')
    }, 1260)

    // Step 4: Card rotates
    setTimeout(() => {
      setPhase('card-rotate')
    }, 1760)

    // Step 5: Swiper 활성화 (회전 완료 직후)
    setTimeout(() => {
      setIsSwipeEnabled(true)

      // Swiper fadein
      setTimeout(() => {
        setSwiperOpacity(1)
      }, 50)
    }, 2600) // 회전 완료 직후
  }

  const handleEnvelopeClick = () => {
    if (!hasStarted) {
      onAnimationStart()
      playAnimation()
    }
  }

  const handleReplay = () => {
    window.location.reload()
  }

  return (
    <>
      {/* Swiper 카드 스택 - 봉투와 완전히 분리 */}
      {isSwipeEnabled && (
        <div
          style={{
            position: 'fixed',
            top: swiperPosition.top,
            left: swiperPosition.left,
            transform: swiperPosition.transform,
            zIndex: 1000,
            width: `${finalCardSize.width}px`,
            height: `${finalCardSize.height}px`,
            perspective: '1200px',
            opacity: swiperOpacity,
            transition: swiperOpacity === 0 ? 'opacity 0.4s ease-out' : 'none' // fadein 시에만 transition
          }}
        >
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper
              console.log('🎯 Swiper initialized:', swiper)
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex)
              console.log('✅ Slide changed to index:', swiper.activeIndex)
            }}
            effect="creative"
            grabCursor={true}
            modules={[EffectCreative]}
            creativeEffect={{
              prev: {
                translate: ['-120%', 0, 0],
                opacity: 0,
              },
              next: {
                translate: [0, 0, -40],
                rotate: [0, 0, -7],
                opacity: 1,
                shadow: false,
              },
            }}
            slidesPerView="auto"
            centeredSlides={true}
            className="envelope-swiper"
          >
            {ALL_CARDS.map((card, index) => (
              <SwiperSlide key={card.id}>
                <div
                  className={styles.envelopeCardInner}
                  style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'grab',
                    userSelect: 'none'
                  }}
                >
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardSubtitle}>{card.subtitle}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* 봉투 컨테이너 */}
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
              width: 'min(1000px, 85vw)', // 반응형
              height: 'min(660px, 55vw)', // 반응형
              visibility: 'inherit',
              zIndex: phase === 'initial' ? 1 : phase === 'card-rotate' ? -10 : 0,
              cursor: hasStarted ? 'default' : 'pointer',
              transform: phase === 'initial'
                ? 'translateX(-50%) translateY(calc(-50% - 10vh)) scale(0.5)'
                : 'translateX(-50%) translateY(-50%) scale(1.0)',
              transition: 'all 2s cubic-bezier(0.445, 0.05, 0.55, 0.95)'
            }}
          >
            <div id="envelopeChild" className={styles.scenarioChild}>

              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                backgroundColor: phase === 'card-rotate' ? 'transparent' : '#1a1a1a',
                overflow: 'visible',
                transition: 'background-color 0.3s ease-out'
              }}>

                {/* 봉투 내부 바닥 (내지) */}
                <div style={{
                  position: 'absolute',
                  width: '90%',
                  height: '100%',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 0,
                  opacity: phase === 'card-rotate' ? 0 : 1,
                  transition: 'opacity 0.3s ease-out'
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
                <svg width="335" height="173" viewBox="0 0 335 173" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: '3px', left: 0, zIndex: 4, opacity: phase === 'card-rotate' ? 0 : 1, transition: 'opacity 0.3s ease-out' }}>
                  <defs>
                    <linearGradient id="bottomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2a2a2a" />
                      <stop offset="50%" stopColor="#1a1a1a" />
                      <stop offset="100%" stopColor="#0a0a0a" />
                    </linearGradient>
                  </defs>
                  <path d="M333.604 164.977C333.241 162.314 331.568 159.911 329.015 158.389L180.084 68.9955C172.529 64.4654 162.49 64.4654 154.917 68.9955L5.98593 158.372C3.43302 159.911 1.75983 162.297 1.39759 164.96L0.638619 170.562C0.569621 171.081 1.03535 171.547 1.65633 171.547H333.345C333.949 171.547 334.432 171.081 334.363 170.562L333.604 164.96V164.977Z" fill="url(#bottomGradient)" stroke="rgba(0,0,0,0.5)" strokeWidth="1"/>
                </svg>

                {/* 왼쪽 플랩 */}
                <svg width="335" height="173" viewBox="0 0 335 173" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 2, opacity: phase === 'card-rotate' ? 0 : 1, transition: 'opacity 0.3s ease-out' }}>
                  <defs>
                    <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0a0a0a" />
                      <stop offset="100%" stopColor="#1a1a1a" />
                    </linearGradient>
                  </defs>
                  <path d="M12.8506 0.904175H0.5V172.222C0.5 172.654 0.965734 173 1.51771 173H19.1466L155.469 90.1594C158.177 88.5168 158.177 85.4044 155.469 83.7618L24.0627 3.8782C20.8888 1.94163 16.9387 0.904175 12.8678 0.904175H12.8506Z" fill="url(#leftGradient)" stroke="rgba(0,0,0,0.5)" strokeWidth="1"/>
                </svg>

                {/* 오른쪽 플랩 */}
                <svg width="335" height="173" viewBox="0 0 335 173" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, zIndex: 3, opacity: phase === 'card-rotate' ? 0 : 1, transition: 'opacity 0.3s ease-out' }}>
                  <defs>
                    <linearGradient id="rightGradient" x1="100%" y1="0%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#0a0a0a" />
                      <stop offset="100%" stopColor="#1a1a1a" />
                    </linearGradient>
                  </defs>
                  <path d="M322.132 0.904175H334.483V172.222C334.483 172.654 334.017 173 333.465 173H315.836L179.515 90.1594C176.806 88.5168 176.806 85.4044 179.515 83.7618L310.938 3.89551C314.112 1.95893 318.062 0.921483 322.132 0.921483V0.904175Z" fill="url(#rightGradient)" stroke="rgba(0,0,0,0.5)" strokeWidth="1"/>
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
                    transition: 'transform 0.75s cubic-bezier(0.445, 0.05, 0.55, 0.95), z-index 0s, opacity 0.3s ease-out',
                    zIndex: phase === 'initial' || phase === 'start' ? 5 : -10,
                    opacity: phase === 'card-rotate' ? 0 : 1,
                    pointerEvents: 'none',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* 뚜껑 외부 (검정) */}
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
                      height: '100%'
                    }}
                  >
                    <defs>
                      <linearGradient id="topGradient" x1="50%" y1="100%" x2="50%" y2="0%">
                        <stop offset="0%" stopColor="#0a0a0a" />
                        <stop offset="50%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#2a2a2a" />
                      </linearGradient>
                    </defs>
                    <path d="M0.897426 7.47704C1.25968 10.4096 2.93296 13.0489 5.486 14.7222L154.425 120.673C161.981 125.659 172.02 125.659 179.593 120.673L328.532 14.7394C331.085 13.0489 332.758 10.4096 333.121 7.49429L333.88 1.31869C333.949 0.749427 333.483 0.231918 332.862 0.231918H167L1.15618 0.231918C0.552421 0.231918 0.069413 0.732176 0.138414 1.31869L0.897426 7.49429V7.47704Z" fill="url(#topGradient)" stroke="rgba(0,0,0,0.5)" strokeWidth="1"/>
                  </svg>

                  {/* 뚜껑 내부 (내지 - 열렸을 때만 보임, 삼각형 모양) */}
                  <div style={{
                    position: 'absolute',
                    width: '90%',
                    height: '100%',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%) rotateX(180deg) scaleY(-1)',
                    zIndex: 1,
                    backfaceVisibility: 'hidden'
                  }}>
                    <svg width="100%" height="100%" viewBox="0 0 300 125" preserveAspectRatio="none">
                      <defs>
                        <pattern id="damaskPatternTop" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
                          <rect width="40" height="40" fill="#F5EFE7"/>
                          <path d="M20 5 Q25 10 20 15 Q15 10 20 5 M20 25 Q25 30 20 35 Q15 30 20 25 M5 20 Q10 25 5 30 Q0 25 5 20 M35 20 Q40 25 35 30 Q30 25 35 20" fill="none" stroke="#E8DCC8" strokeWidth="0.5" opacity="0.6"/>
                        </pattern>
                      </defs>
                      {/* 뚜껑 삼각형 모양 - 뚜껑 외부 path와 동일한 형태 */}
                      <path d="M0 10L4 15L150 125L150 125L150 125L296 15L300 10L299 3L298 0H2L1 3L0 10Z" fill="url(#damaskPatternTop)" opacity="0.95"/>
                    </svg>
                  </div>
                </div>

                {/* 첫 카드 애니메이션 (봉투에서 나오는 효과) - 항상 표시 */}
                <div
                  id="envelopeCard"
                  className={styles.scene}
                  style={{
                    visibility: 'inherit',
                    width: 'min(500px, 60vw)', // PC: 최대 500px, 모바일: 60vw
                    height: 'min(775px, calc(60vw * 1.55))', // 비율 유지
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    zIndex: 1,
                    transform: phase === 'initial' || phase === 'start' || phase === 'flap-open'
                      ? 'translateX(-50%) translateY(-50%) translateZ(-0.1px) rotate(-90deg) scale(0.95)'
                      : phase === 'card-slide'
                      ? 'translateX(-50%) translateY(-80%) translateZ(10px) rotate(-90deg) scale(1)'
                      : 'translateX(-50%) translateY(-50%) translateZ(0px) rotate(0deg) scale(1)',
                    transition: 'transform 0.8s ease-out, opacity 0.5s ease-out',
                    opacity: isSwipeEnabled ? 0 : 1, // Swiper 활성화되면 fadeout
                    pointerEvents: 'none',
                    cursor: 'default'
                  }}
                >
                  <div id="envelope-card-inner" className={styles.envelopeCardInner}>
                    <div className={styles.cardHeaderSmall}>
                      <div className={styles.headerDecoration}>{ALL_CARDS[0].decoration}</div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.cardTitle}>{ALL_CARDS[0].title}</h3>
                      <p className={styles.cardSubtitle}>{ALL_CARDS[0].subtitle}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>

        {/* Replay Button */}
        <button onClick={handleReplay} className={styles.replayBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
          </svg>
        </button>
      </div>
    </>
  )
}