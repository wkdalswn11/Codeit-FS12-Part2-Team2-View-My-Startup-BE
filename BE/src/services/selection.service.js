import { PrismaClient } from "@prisma/client";
import { companyDetailSelect, mapCompanyDetail } from "../utils/companySummary";
import { companySortOrder } from "../utils/sort";

const prisma = new PrismaClient();

export const resetSelectionsService = async (userId, query) => {
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

export const getSelectionsService = async (userId) => {
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
