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

  await prisma.favorite.updateMany({
    where: {
      userId,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.update({
      where: {
        userId_companyId: { userId, companyId },
      },
      data: {
        isActive: true,
        lastSelectedAt: new Date(),
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        companyId,
        isActive: true,
      },
    });
  }

  return company;
};

export const getFavoritesService = async (userId) => {
  const companyIds = await prisma.favorite.findMany({
    where: {
      userId,
      isActive: true,
    },
    select: {
      companyId: true,
    },
  });

  return companyIds.map((company) => company.companyId);
};

export const deleteFavoriteService = async (userId, companyId) => {
  await prisma.favorite.update({
    where: {
      userId_companyId: { userId, companyId },
    },
    data: {
      isActive: false,
    },
  });
};

export const getLastFavoriteService = async (userId) => {
  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where: { userId, isActive: false },
      orderBy: { lastSelectedAt: "desc" },
      include: { company: true },
      take: 5,
    }),

    prisma.favorite.count({
      where: { userId, isActive: false },
    }),
  ]);

  const data = favorites.map((fav) => {
    return {
      logo: fav.company.logo,
      name: fav.company.name,
      category: fav.company.categoryName,
    };
  });

  return { data, total };
};
