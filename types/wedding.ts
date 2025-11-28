export interface WeddingData {
  groom: string
  bride: string
  date: string
  venue: string
  photo: string
  backgroundImage?: string  // wedding-card-001, 005용 card-bg.png
  decorationImage?: string  // wedding-card-001용
  decoration?: string       // wedding-card-002, 003, 004, 005, 028, 029용 decoration.svg/png
  dateDivider?: string      // wedding-card-002용 date-divider.svg
  decorationFrame?: string  // wedding-card-005용 decoration-frame.svg
  decorationTop?: string    // wedding-card-027용 decoration-top.png
  decorationLeft?: string   // wedding-card-027용 decoration-left.png
  decorationRight?: string  // wedding-card-027용 decoration-right.png

  // wedding-card-002 전용 필드
  cardBackground?: string   // 카드 배경 이미지
  dday?: string             // D-day 표시 (예: "D-100")
  dateMonth?: string        // 월 (예: "10")
  dateDay?: string          // 일 (예: "12")
  dateEnglish?: string      // 영문 날짜 (예: "OCTOBER 12, 2038")
  dateKorean?: string       // 한글 날짜 (예: "2038년 10월 12일 토요일 오후 2시")
  groomLabel?: string       // 신랑 라벨 (예: "GROOM")
  brideLabel?: string       // 신부 라벨 (예: "BRIDE")

  // wedding-card-003 전용 필드
  title?: string            // 타이틀 (예: "WEDDING INVITATION")

  // wedding-card-004 전용 필드
  separator?: string        // 구분자 (예: "&")
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
