'use client'

import { useEffect, useState } from 'react'
import { WeddingCard } from '@/components/cards/WeddingCard'
import { DynamicLayoutRenderer } from '@/components/DynamicLayoutRenderer'

/**
 * SDUI 검증 페이지
 *
 * 왼쪽: 하드코딩 컴포넌트 (WeddingCard.tsx)
 * 오른쪽: 순수 SDUI (DynamicLayoutRenderer - JSON만 보고 렌더링)
 */
export default function SDUITestPage() {
  const [templateData, setTemplateData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/templates/wedding-card-001.json')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Loaded template data:', data)
        setTemplateData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('❌ Failed to load template:', err)
        setLoading(false)
      })
  }, [])

  if (loading || !templateData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>템플릿 로딩 중...</p>
      </div>
    )
  }

  // 하드코딩 컴포넌트용 데이터
  const hardcodedData = {
    groom: templateData.data.wedding.groom,
    bride: templateData.data.wedding.bride,
    date: templateData.data.wedding.date,
    venue: templateData.data.wedding.venue,
    photo: templateData.data.wedding.photo,
    backgroundImage: templateData.data.wedding.backgroundImage,
    decorationImage: templateData.data.wedding.decorationImage
  }

  const hardcodedLayout = templateData.layout

  // 순수 SDUI용 데이터 (wedding 객체 펼치기)
  const pureSDUIData = {
    ...templateData.data.wedding
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '16px',
          color: '#333',
          textAlign: 'center'
        }}>
          🔬 SDUI 검증 테스트
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '8px',
          fontSize: '16px'
        }}>
          <strong>왼쪽:</strong> 하드코딩 컴포넌트 (WeddingCard.tsx) | <strong>오른쪽:</strong> 순수 SDUI (DynamicLayoutRenderer)
        </p>

        <p style={{
          textAlign: 'center',
          color: '#10b981',
          marginBottom: '40px',
          fontSize: '14px',
          fontWeight: 600
        }}>
          ✅ 둘이 동일하면 JSON → SDUI 렌더링 성공!
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* 왼쪽: 하드코딩 컴포넌트 */}
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#333',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '24px' }}>🔧</span>
              하드코딩 컴포넌트
            </h2>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '3px solid #3b82f6',
              padding: '20px'
            }}>
              <div style={{
                width: '335px',
                height: '515px',
                margin: '0 auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <WeddingCard
                  data={hardcodedData}
                  layout={hardcodedLayout}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#3b82f6'
              }}>
                📋 전달된 Props:
              </h3>
              <pre style={{
                fontSize: '10px',
                color: '#666',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {JSON.stringify({ data: hardcodedData, hasLayout: !!hardcodedLayout }, null, 2)}
              </pre>
            </div>
          </div>

          {/* 오른쪽: 순수 SDUI */}
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#333',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '24px' }}>✨</span>
              순수 SDUI (JSON 기반)
            </h2>
            <div style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              border: '3px solid #10b981',
              padding: '20px'
            }}>
              <div style={{
                width: '335px',
                height: '515px',
                margin: '0 auto',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <DynamicLayoutRenderer
                  layout={templateData.layout}
                  data={pureSDUIData}
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '8px',
                color: '#10b981'
              }}>
                📝 JSON Layout 구조:
              </h3>
              <pre style={{
                fontSize: '10px',
                color: '#666',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                maxHeight: '200px',
                overflow: 'auto'
              }}>
                {JSON.stringify(templateData.layout, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* 검증 체크리스트 */}
        <div style={{
          padding: '24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#333'
          }}>
            ✅ 검증 체크리스트
          </h2>
          <ul style={{
            color: '#666',
            lineHeight: '2',
            margin: 0,
            paddingLeft: '24px'
          }}>
            <li><strong>배경 이미지</strong>가 동일한가?</li>
            <li><strong>사진 위치와 크기</strong>가 동일한가?</li>
            <li><strong>신랑/신부 이름</strong> 위치와 폰트가 동일한가?</li>
            <li><strong>날짜/장소 텍스트</strong>가 동일한가?</li>
            <li><strong>장식 이미지</strong> 위치가 동일한가?</li>
            <li><strong>전체 레이아웃</strong>이 픽셀 단위로 일치하는가?</li>
          </ul>
        </div>

        {/* 브라우저 콘솔 안내 */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '2px solid #fbbf24'
        }}>
          <p style={{
            margin: 0,
            color: '#92400e',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <strong>💡 팁:</strong> 브라우저 개발자 도구 (F12) → Console 탭에서 렌더링 로그를 확인하세요!
            <br />
            🎨 DynamicLayoutRenderer가 각 요소를 어떻게 처리하는지 상세 로그가 출력됩니다.
          </p>
        </div>
      </div>
    </main>
  )
}
