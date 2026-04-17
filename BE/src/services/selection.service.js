import { PrismaClient } from "@prisma/client";

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
