'use client'

import { useState } from 'react'
import EnvelopeCard from '@/components/EnvelopeCard'

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false)

  const handleReplay = () => {
    setIsAnimating(false)
    setTimeout(() => setIsAnimating(true), 50)
  }

  return (
    <main style={{
      minHeight: '100vh',
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