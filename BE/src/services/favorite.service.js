import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addFavoriteService = async (userId, companyId) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });
  if (!company) {
    const error = new Error("존재하지 않는 기업입니다");
    error.status = 404;
    throw error;
  }
  try {
    await prisma.favorite.create({
      data: {
        userId,
        companyId,
      },
    });
    return company;
  } catch (error) {
    if (error.code === "P2002") {
      const err = new Error("이미 선택된 기업입니다");
      err.status = 400;
      throw err;
    }
    throw error;
  }
};

export const getFavoritesService = async (userId) => {
  const companyIds = await prisma.favorite.findMany({
    where: {
      userId,
    },
    select: {
      companyId: true,
    },
  });

  return companyIds.map((company) => company.companyId);
};

export const deleteFavoriteService = async (userId, companyId) => {};
