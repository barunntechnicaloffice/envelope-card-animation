export interface WeddingData {
  groom: string
  bride: string
  date: string
  venue: string
  photo: string
  backgroundImage: string
  decorationImage: string
}

// Mock 데이터 (Figma assets 사용)
export const MOCK_WEDDING_DATA: WeddingData = {
  groom: "이 준 서",
  bride: "김 은 재",
  date: "2038년 10월 12일 토요일 오후 2시",
  venue: "메종 드 프리미어 그랜드홀",
  photo: "/assets/figma/photo.png",
  backgroundImage: "/assets/figma/card-bg.png",
  decorationImage: "/assets/figma/decoration.png"
}
