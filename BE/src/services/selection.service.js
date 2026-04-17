import { PrismaClient } from "@prisma/client";
import { companyDetailSelect, mapCompanyDetail } from "../utils/companySummary";

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

  const data = selected ? [selected, ...comparesMapped] : comparesMapped;

  return { data };
};
