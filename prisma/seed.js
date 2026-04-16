import { PrismaClient, InvestmentStatus } from "@prisma/client";

const prisma = new PrismaClient();

/////////////////////////////////////////////////
// 유저 데이터
/////////////////////////////////////////////////
const users = [
  { name: "김민준", email: "minjun.kim@example.com" },
  { name: "이서연", email: "seoyeon.lee@example.com" },
  { name: "박지훈", email: "jihoon.park@example.com" },
  { name: "최지우", email: "jiwoo.choi@example.com" },
  { name: "정도윤", email: "doyun.jung@example.com" },
  { name: "한예은", email: "yeeun.han@example.com" },
  { name: "오준서", email: "junseo.oh@example.com" },
  { name: "윤하은", email: "haeun.yoon@example.com" },
  { name: "서현우", email: "hyunwoo.seo@example.com" },
  { name: "강다은", email: "daeun.kang@example.com" },
];

/////////////////////////////////////////////////
// 유틸 함수
/////////////////////////////////////////////////
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pickRandomItems(array, count) {
  return shuffle(array).slice(0, count);
}

/////////////////////////////////////////////////
// 실행
/////////////////////////////////////////////////
async function main() {
  console.log("🌱 Seed 시작");

  // 회사는 이미 있으므로 삭제/생성하지 않음
  // 관계 테이블 + 유저만 초기화
  await prisma.comparison.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.user.deleteMany();

  //////////////////////////////////////////////////
  // User 생성
  //////////////////////////////////////////////////
  await prisma.user.createMany({
    data: users,
  });

  const createdUsers = await prisma.user.findMany({
    orderBy: { id: "asc" },
  });

  const companies = await prisma.company.findMany({
    orderBy: { id: "asc" },
  });

  if (companies.length === 0) {
    throw new Error(
      "Company 데이터가 없습니다. 먼저 company seed를 실행하세요.",
    );
  }

  //////////////////////////////////////////////////
  // Investment 생성 (총 10개 정도)
  //////////////////////////////////////////////////
  const investments = [];

  for (let i = 0; i < 10; i++) {
    const user = createdUsers[i % createdUsers.length];
    const company = companies[getRandomInt(0, companies.length - 1)];

    investments.push({
      userId: user.id,
      companyId: company.id,
      amount: getRandomInt(100000, 5000000),
      comment: `${user.name}님의 ${company.name} 투자입니다.`,
      status: [
        InvestmentStatus.PENDING,
        InvestmentStatus.APPROVED,
        InvestmentStatus.REJECTED,
      ][getRandomInt(0, 2)],
    });
  }

  await prisma.investment.createMany({
    data: investments,
  });

  //////////////////////////////////////////////////
  // Favorite 생성
  // 유저당 1개는 true, 나머지는 false
  // 최근 선택 순서는 lastSelectedAt으로 관리
  //////////////////////////////////////////////////
  const favorites = [];

  for (const user of createdUsers) {
    // 유저당 3~5개 기업 이력 생성
    const selectedCompanies = pickRandomItems(companies, getRandomInt(3, 5));

    // 현재 선택 기업 1개
    favorites.push({
      userId: user.id,
      companyId: selectedCompanies[0].id,
      isActive: true,
      lastSelectedAt: new Date(),
    });

    // 이전 선택 기업들
    for (let i = 1; i < selectedCompanies.length; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - i);

      favorites.push({
        userId: user.id,
        companyId: selectedCompanies[i].id,
        isActive: false,
        lastSelectedAt: pastDate,
      });
    }
  }

  await prisma.favorite.createMany({
    data: favorites,
    skipDuplicates: true,
  });

  //////////////////////////////////////////////////
  // Comparison 생성
  // 유저당 1~5개 기업 선택
  //////////////////////////////////////////////////
  const comparisons = [];

  for (const user of createdUsers) {
    const selectedCompanies = pickRandomItems(companies, getRandomInt(1, 5));

    for (const company of selectedCompanies) {
      comparisons.push({
        userId: user.id,
        companyId: company.id,
      });
    }
  }

  await prisma.comparison.createMany({
    data: comparisons,
    skipDuplicates: true,
  });

  console.log(`✅ User 생성 완료: ${createdUsers.length}명`);
  console.log(`✅ Investment 생성 완료: ${investments.length}개`);
  console.log(`✅ Favorite 생성 완료: ${favorites.length}개`);
  console.log(`✅ Comparison 생성 완료: ${comparisons.length}개`);
}

main()
  .catch((e) => {
    console.error("❌ 에러:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
