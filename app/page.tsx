'use client'

import { useState } from 'react'
import EnvelopeCard from '@/components/EnvelopeCard'

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <main style={{
      minHeight: '100vh',
      backgroundImage: 'url(/assets/figma/bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#fefbf6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0'
    }}>
      <div style={{ width: '100%', maxWidth: '672px' }}>
        <EnvelopeCard isAnimating={isAnimating} onAnimationStart={() => setIsAnimating(true)} />
      </div>
    </main>
  )
}