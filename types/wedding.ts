export interface WeddingData {
  groom: string
  bride: string
  date: string
  venue: string
  photo: string
  backgroundImage?: string  // wedding-card-001용
  decorationImage?: string  // wedding-card-001용
  cardBackground?: string   // wedding-card-002용
  decoration?: string       // wedding-card-002용 decoration.svg
  dateDivider?: string      // wedding-card-002용 date-divider.svg
}

// Mock 데이터 (Figma assets 사용)
export const MOCK_WEDDING_DATA: WeddingData = {
  groom: "이 준 서",
  bride: "김 은 재",
  date: "2038년 10월 12일 토요일 오후 2시",
  venue: "메종 드 프리미어 그랜드홀",
  photo: "/assets/common/photo.png",
  // wedding-card-002용 (배경 이미지 없이 backgroundColor만 사용)
  decoration: "/assets/wedding-card-002/decoration.svg",
  dateDivider: "/assets/wedding-card-002/date-divider.svg"
}
