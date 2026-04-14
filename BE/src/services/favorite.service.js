import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addFavoriteService = async (userId, companyId) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
  if (!company) {
    throw new Error("존재하지 않는 기업입니다");
  }
  await prisma.favorite.create({
    data: {
      userId,
      companyId,
    },
  });
};
