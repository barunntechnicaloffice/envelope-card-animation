'use client'

import { useState } from 'react'
import ServerDrivenUIRenderer from '@/lib/server-driven-ui/renderer'
import type { PageSchema } from '@/types/server-driven-ui/schema'

// 데모용 JSON 스키마
const DEMO_SCHEMA: PageSchema = {
  id: "demo-wedding-card",
  version: "1.0.0",
  name: "Server-Driven UI 데모",
  description: "JSONPath 기반 동적 바인딩 데모",
  data: {
    wedding: {
      groom: "이 준 서",
      bride: "김 은 재",
      date: "2038년 10월 12일 토요일 오후 2시",
      venue: "메종 드 프리미어 그랜드홀",
      photo: "/assets/figma/photo.png",
      backgroundImage: "/assets/figma/card-bg.png",
      decorationImage: "/assets/figma/decoration.png"
    }
  },
  components: [
    {
      id: "wedding-card-main",
      type: "wedding-card-template-001",
      data: {
        groom: "$.data.wedding.groom",
        bride: "$.data.wedding.bride",
        date: "$.data.wedding.date",
        venue: "$.data.wedding.venue",
        photo: "$.data.wedding.photo",
        backgroundImage: "$.data.wedding.backgroundImage",
        decorationImage: "$.data.wedding.decorationImage"
      },
      style: {
        width: "320px",
        height: "580px"
      }
    }
  ],
  globalStyles: {
    layout: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#fefbf6"
  }
}

export default function ServerDrivenDemoPage() {
  const [schema, setSchema] = useState<PageSchema>(DEMO_SCHEMA)
  const [jsonInput, setJsonInput] = useState(JSON.stringify(DEMO_SCHEMA, null, 2))
  const [showEditor, setShowEditor] = useState(false)

  const handleApplyJSON = () => {
    try {
      const newSchema = JSON.parse(jsonInput)
      setSchema(newSchema)
    } catch (error) {
      alert('JSON 파싱 오류: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleUpdateData = (field: string, value: string) => {
    const newSchema = { ...schema }
    const keys = field.split('.')
    let obj: any = newSchema.data

    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]]
    }
    obj[keys[keys.length - 1]] = value

    setSchema(newSchema)
    setJsonInput(JSON.stringify(newSchema, null, 2))
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 컨트롤 패널 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px',
        zIndex: 1000,
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
          Server-Driven UI 데모
        </h2>

        <button
          onClick={() => setShowEditor(!showEditor)}
          style={{
            padding: '8px 16px',
            backgroundColor: showEditor ? '#1976d2' : '#e0e0e0',
            color: showEditor ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showEditor ? 'JSON 편집기 닫기' : 'JSON 편집기 열기'}
        </button>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px' }}>신랑:</label>
          <input
            type="text"
            value={schema.data.wedding.groom}
            onChange={(e) => handleUpdateData('wedding.groom', e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px' }}>신부:</label>
          <input
            type="text"
            value={schema.data.wedding.bride}
            onChange={(e) => handleUpdateData('wedding.bride', e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* JSON 편집기 */}
      {showEditor && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '16px',
          width: '500px',
          maxHeight: 'calc(100vh - 100px)',
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          padding: '16px',
          zIndex: 999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>JSON 스키마 편집</h3>
            <button
              onClick={handleApplyJSON}
              style={{
                padding: '6px 12px',
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              적용
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            style={{
              width: '100%',
              height: '400px',
              backgroundColor: '#2d2d2d',
              color: '#d4d4d4',
              border: '1px solid #3e3e3e',
              borderRadius: '4px',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '13px',
              resize: 'vertical'
            }}
          />
          <div style={{ marginTop: '12px', color: '#aaa', fontSize: '12px' }}>
            💡 Tip: JSONPath 표현식으로 데이터를 바인딩합니다 (예: $.data.wedding.groom)
          </div>
        </div>
      )}

      {/* 렌더링 영역 */}
      <div style={{ paddingTop: '100px' }}>
        <ServerDrivenUIRenderer schema={schema} />
      </div>

      {/* 설명 패널 */}
      <div style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        maxWidth: '400px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
          📚 Server-Driven UI란?
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', lineHeight: '1.6' }}>
          <li>서버에서 JSON으로 UI 구조를 정의</li>
          <li>JSONPath로 동적 데이터 바인딩</li>
          <li>앱 업데이트 없이 UI 변경 가능</li>
          <li>A/B 테스트, 개인화 등에 활용</li>
        </ul>
      </div>
    </div>
  )
}
