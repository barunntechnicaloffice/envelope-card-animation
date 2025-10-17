export interface WeddingData {
  groom: string
  bride: string
  date: string
  venue: string
  photo: string
  backgroundImage?: string  // wedding-card-001용
  decorationImage?: string  // wedding-card-001용
  cardBackground?: string   // wedding-card-002용
  decoration?: string       // wedding-card-002용
}

// Mock 데이터 (Figma assets 사용)
export const MOCK_WEDDING_DATA: WeddingData = {
  groom: "이 준 서",
  bride: "김 은 재",
  date: "2038년 10월 12일 토요일 오후 2시",
  venue: "메종 드 프리미어 그랜드홀",
  photo: "/assets/wedding-card-001/photo.png",
  backgroundImage: "/assets/wedding-card-001/card-bg.png",
  decorationImage: "/assets/wedding-card-001/decoration.png"
}
