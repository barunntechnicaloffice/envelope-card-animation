'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  thumbnail: string
  category: string
}

const TEMPLATES: Template[] = [
  {
    id: 'wedding-card-001',
    name: '웨딩 청첩장 템플릿 001',
    thumbnail: '/assets/wedding-card-001/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-002',
    name: '웨딩 청첩장 템플릿 002',
    thumbnail: '/assets/wedding-card-002/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-003',
    name: '웨딩 청첩장 템플릿 003',
    thumbnail: '/assets/wedding-card-003/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-004',
    name: '웨딩 청첩장 템플릿 004',
    thumbnail: '/assets/wedding-card-004/photo.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-005',
    name: '웨딩 청첩장 템플릿 005 (Floral Frame)',
    thumbnail: '/assets/wedding-card-005/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-006',
    name: '웨딩 청첩장 템플릿 006 (Botanical)',
    thumbnail: '/assets/wedding-card-006/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-007',
    name: '웨딩 청첩장 템플릿 007 (Navy Lunaria)',
    thumbnail: '/assets/wedding-card-007/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-008',
    name: '웨딩 청첩장 템플릿 008 (Romantic Garden)',
    thumbnail: '/assets/wedding-card-008/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-009',
    name: '웨딩 청첩장 템플릿 009 (Minimal Photo)',
    thumbnail: '/assets/wedding-card-009/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-010',
    name: '웨딩 청첩장 템플릿 010 (Classic Elegance)',
    thumbnail: '/assets/wedding-card-010/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-011',
    name: '웨딩 청첩장 템플릿 011 (Floral Elegance)',
    thumbnail: '/assets/wedding-card-011/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-012',
    name: '노란 봄 스케치',
    thumbnail: '/assets/wedding-card-012/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-013',
    name: '밤하늘의 황금가지',
    thumbnail: '/assets/wedding-card-013/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-014',
    name: '봄에 싹트는 꽃',
    thumbnail: '/assets/wedding-card-014/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-015',
    name: '고운 날의 인연',
    thumbnail: '/assets/wedding-card-015/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-016',
    name: '순백의 숲 약속',
    thumbnail: '/assets/wedding-card-016/card-bg.png',
    category: 'wedding'
  },
  {
    id: 'wedding-card-017',
    name: '베이지빛 온기',
    thumbnail: '/assets/wedding-card-017/card-bg.png',
    category: 'wedding'
  }
]

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredTemplates = selectedCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory)

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '32px',
          color: '#333'
        }}>
          템플릿 선택
        </h1>

        {/* 카테고리 필터 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: selectedCategory === 'all' ? '2px solid #60c0ba' : '1px solid #ddd',
              backgroundColor: selectedCategory === 'all' ? '#60c0ba' : '#fff',
              color: selectedCategory === 'all' ? '#fff' : '#333',
              fontWeight: selectedCategory === 'all' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            전체
          </button>
          <button
            onClick={() => setSelectedCategory('wedding')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: selectedCategory === 'wedding' ? '2px solid #60c0ba' : '1px solid #ddd',
              backgroundColor: selectedCategory === 'wedding' ? '#60c0ba' : '#fff',
              color: selectedCategory === 'wedding' ? '#fff' : '#333',
              fontWeight: selectedCategory === 'wedding' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            웨딩
          </button>
        </div>

        {/* 템플릿 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {filteredTemplates.map(template => (
            <Link
              key={template.id}
              href={`/templates/${template.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {/* 썸네일 */}
                <div style={{
                  width: '100%',
                  aspectRatio: '335 / 515',
                  backgroundColor: '#f0f0f0',
                  position: 'relative'
                }}>
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* 정보 */}
                <div style={{
                  padding: '16px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    {template.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: 0
                  }}>
                    {template.category === 'wedding' ? '웨딩' : template.category}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 홈으로 돌아가기 */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center'
        }}>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#60c0ba',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600
            }}
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  )
}
