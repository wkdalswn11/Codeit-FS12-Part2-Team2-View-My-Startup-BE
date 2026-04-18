import { PrismaClient } from "@prisma/client";
import {
  companySummarySelect,
  mapCompanySummary,
} from "../utils/companySummary.js";

const prisma = new PrismaClient();

export const addComparesService = async (userId, companyId) => {
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

  const favorite = await prisma.favorite.findFirst({
    where: { userId, isActive: true },
  });

  if (favorite && favorite.companyId === companyId) {
    const error = new Error("나의 기업은 선택할 수 없습니다.");
    error.status = 400;
    throw error;
  }

  const existing = await prisma.comparison.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (existing) {
    const error = new Error("이미 선택한 비교 기업입니다.");
    error.status = 409;
    throw error;
  }

  const count = await prisma.comparison.count({
    where: { userId },
  });

  if (count >= 5) {
    const error = new Error("비교 기업은 최대 5개까지 선택 가능합니다.");
    error.status = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.comparison.create({ data: { userId, companyId } });
    await tx.company.update({
      where: {
        id: companyId,
      },
      data: {
        compareCount: { increment: 1 },
      },
    });
  });

  return { message: "비교 기업이 선택 되었습니다." };
};

export const getComparesService = async (userId) => {
  const compares = await prisma.comparison.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: companySummarySelect,
  });

  const data = compares.map(mapCompanySummary);

  return { data };
};

export const deleteCompareService = async (userId, companyId) => {
  const existing = await prisma.comparison.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!existing) {
    const error = new Error("선택한 비교 기업이 없습니다.");
    error.status = 404;
    throw error;
  }
  await prisma.comparison.delete({
    where: {
      userId_companyId: { userId, companyId },
    },
  });
};
