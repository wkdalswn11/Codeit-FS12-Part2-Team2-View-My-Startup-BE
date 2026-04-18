import { PrismaClient } from "@prisma/client";
import {
  companyDetailSelect,
  mapCompanyDetail,
} from "../utils/companySummary.js";
import { companySortOrder } from "../utils/sort.js";

const prisma = new PrismaClient();

export const resetSelectionsService = async (userId) => {
  await prisma.$transaction(async (tx) => {
    await tx.favorite.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    await tx.comparison.deleteMany({
      where: { userId },
    });
  });
};

export const getSelectionsService = async (userId, query) => {
  const [favorite, compares] = await Promise.all([
    prisma.favorite.findFirst({
      where: { userId, isActive: true },
      select: companyDetailSelect,
    }),
    prisma.comparison.findMany({
      where: { userId },
      select: companyDetailSelect,
    }),
  ]);

  const selected = favorite ? mapCompanyDetail(favorite) : null;
  const comparesMapped = compares.map(mapCompanyDetail);

  const combined = selected ? [selected, ...comparesMapped] : comparesMapped;

  if (!query.sort) {
    return { data: combined };
  }

  const sort = companySortOrder[query.sort];

  //Object.entries 객체를 반복 가능한 형태(배열)로 바꾸기 배열 안의 배열 형태이기 때문에 [0]으로 첫번째 배열을 꺼내줌
  const [key, direction] = Object.entries(sort)[0];

  const data = [...combined].sort((a, b) => {
    if (direction === "desc") {
      return b[key] - a[key];
    } else {
      return a[key] - b[key];
    }
  });

  return { data };
};

export const getMyCompanyRankingService = async (userId, query) => {
  const favorite = await prisma.favorite.findFirst({
    where: { userId, isActive: true },
    select: { companyId: true },
  });

  const sort = companySortOrder[query.sort] || companySortOrder.revenue_desc;

  const companies = await prisma.company.findMany({
    select: {
      id: true,
      logo: true,
      name: true,
      categoryName: true,
      description: true,
      revenue: true,
      employeeCount: true,
      baseInvestment: true,
    },
    orderBy: sort,
  });

  const selectedIndex = companies.findIndex(
    (company) => company.id === favorite.companyId,
  );

  if (selectedIndex === -1) {
    const error = new Error("선택한 기업의 순위를 찾을 수 없습니다.");
    error.status = 404;
    throw error;
  }

  let start = Math.max(selectedIndex - 2, 0); //0 아래로 내려가지 못하게
  let end = Math.min(selectedIndex + 3, companies.length); //나의 기업이 랭킹 끝에 있을때를 위한 제한

  if (end - start < 5) {
    if (start === 0) {
      end = Math.min(5, companies.length);
    } else if (end === companies.length) {
      start = Math.max(companies.length - 5, 0);
    }
  } //항상 5개 개수 제한

  const data = companies.slice(start, end).map((company, index) => {
    return {
      id: company.id,
      logo: company.logo,
      name: company.name,
      category: company.categoryName,
      description: company.description,
      revenue: company.revenue,
      employeeCount: company.employeeCount,
      baseInvestment: company.baseInvestment,
      rank: start + index + 1,
      isSelected: company.id === favorite.companyId,
    };
  });

  return { data };
};
