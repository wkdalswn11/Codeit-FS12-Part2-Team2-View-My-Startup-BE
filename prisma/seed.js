import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/////////////////////////////////////////////////
// 카테고리
/////////////////////////////////////////////////
const categories = ["IT", "FINANCE", "HEALTHCARE", "EDUCATION", "ECOMMERCE"];

const companyNames = [
  "코드잇",
  "랩스",
  "네오테크",
  "알파소프트",
  "블루웨이브",
  "핀테크랩",
  "헬스브릿지",
  "에듀플러스",
  "스마트로직",
  "클라우드허브",
  "넥스트AI",
  "데이터링크",
  "이노베이션X",
  "그린에너지솔루션",
  "메디케어랩",
  "디지털코어",
  "테크플로우",
  "유니콘스타트업",
  "비전소프트",
  "오픈플랫폼",
  "브레인테크",
  "퀀텀시스템즈",
  "로보틱스랩",
  "에이아이웍스",
  "스페이스테크",
  "커머스허브",
  "플랫폼엑스",
  "에코테크놀로지",
  "인사이트랩",
  "퓨처소프트",
];

/////////////////////////////////////////////////
// 로고 (실제 도메인 → 깨짐 방지)
/////////////////////////////////////////////////
const logos = [
  "google.com",
  "amazon.com",
  "microsoft.com",
  "apple.com",
  "meta.com",
  "netflix.com",
];

/////////////////////////////////////////////////
// 데이터 생성
/////////////////////////////////////////////////
const companies = companyNames.map((name, i) => {
  return {
    name,
    businessNumber: `100-00-${10000 + i}`,
    address: "서울특별시 강남구",
    description: `${name}는 혁신적인 기술 기반 스타트업입니다.`,

    // 현실적인 랜덤값
    revenue: Math.floor(Math.random() * 90000000) + 10000000, // 최소 1천만
    employeeCount: Math.floor(Math.random() * 90) + 10, // 최소 10명

    categoryName: categories[Math.floor(Math.random() * categories.length)],

    // 로고
    logo: `https://logo.clearbit.com/${logos[i % logos.length]}`,

    // 기본 투자금
    baseInvestment: Math.floor(Math.random() * 10000000),
  };
});

/////////////////////////////////////////////////
// 실행
/////////////////////////////////////////////////
async function main() {
  console.log("🌱 Seed 시작");

  // 기존 데이터 삭제 (중복 방지)
  await prisma.company.deleteMany();

  // 데이터 생성
  await prisma.company.createMany({
    data: companies,
  });

  console.log("✅ 회사 30개 생성 완료");
}

main()
  .catch((e) => {
    console.error("❌ 에러:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
