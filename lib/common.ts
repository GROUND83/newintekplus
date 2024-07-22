export const lessonType = [
  { label: "집합교육", value: "집합교육" },
  { label: "S-OJT", value: "S-OJT" },
] as const;
export const eduPlaceData = [
  { label: "사내", value: "사내" },
  { label: "사외", value: "사외" },
  { label: "샐프러닝", value: "샐프러닝" },
] as const;

export const evaluationMethod = [
  { label: "학습자반응", value: "학습자반응" },
  { label: "학업성취도", value: "학업성취도" },
  { label: "현업적용도", value: "현업적용도" },
  { label: "경영기여도", value: "경영기여도" },
] as const;
export const lessonTime = [
  { label: "1시간", value: "1" },
  { label: "2시간", value: "2" },
  { label: "3시간", value: "3" },
  { label: "4시간", value: "4" },
  { label: "5시간", value: "5" },
  { label: "6시간", value: "6" },
  { label: "7시간", value: "7" },
  { label: "8시간", value: "8" },
  { label: "9시간", value: "9" },
  { label: "10시간", value: "10" },
] as const;
export const lessonContentType = [
  "도서자료",
  "링크자료",
  "내부자료",
  "외부자료",
] as const;
export const jobGroupType = [
  "전체",
  "일반직군",
  "제조직군",
  "개발직군",
] as const;
export const competencyType = [
  "전체",
  "공통 역량",
  "직무 역량",
  "리더십 역량",
] as const;
export const jobPositionType = [
  "전체",
  "사원/연구원",
  "대리/선임",
  "과.차장/책임",
  "부장/수석",
  "임원",
] as const;
export const sendToType = [
  { label: "전체", value: "all" },
  { label: "리더", value: "teacher" },
  { label: "참여자", value: "student" },
] as const;
