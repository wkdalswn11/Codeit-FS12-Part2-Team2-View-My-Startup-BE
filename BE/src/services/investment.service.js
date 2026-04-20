import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addFavoriteInvestmentService = async (userId, body) => {
  const favorite = await prisma.favorite.findFirst({
    where: {
      userId,
      isActive: true,
    },
    select: {
      companyId: true,
    },
  });

  if (!favorite) {
    const error = new Error("선택된 나의 기업이 없습니다.");
    error.status = 404;
    throw error;
  }

  const amount = Number(body.amount);

  if (Number.isNaN(amount) || amount <= 0) {
    const error = new Error("유효한 투자 금액이 아닙니다.");
    error.status = 400;
    throw error;
  }

  const existing = await prisma.investment.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId: favorite.companyId,
      },
    },
  });

  if (existing) {
    const error = new Error("이미 해당 기업에 투자했습니다.");
    error.status = 409;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.investment.create({
      data: {
        userId,
        companyId: favorite.companyId,
        amount,
        comment: body.comment,
      },
    });

    await tx.company.update({
      where: {
        id: favorite.companyId,
      },
      data: {
        siteInvestment: { increment: amount },
      },
    });
  });

  return { message: "투자가 완료되었어요!" };
};

export const updateInvestmentService = async (userId, investmentId, body) => {
  const existing = await prisma.investment.findFirst({
    where: { id: investmentId, userId },
  });

  if (!existing) {
    const error = new Error("투자 내역이 없습니다.");
    error.status = 404;
    throw error;
  }

  const amount = Number(body.amount);

  if (Number.isNaN(amount) || amount <= 0) {
    const error = new Error("유효한 투자 금액이 아닙니다.");
    error.status = 400;
    throw error;
  }

  const diff = amount - existing.amount;

  await prisma.$transaction(async (tx) => {
    await tx.investment.update({
      where: { id: investmentId },
      data: {
        amount,
        comment: body.comment,
      },
    });

    await tx.company.update({
      where: { id: existing.companyId },
      data: {
        siteInvestment: { increment: diff },
      },
    });
  });

  return { message: "투자 내역이 수정되었습니다." };
};

export const deleteInvestmentService = async (userId, investmentId) => {
  const existing = await prisma.investment.findFirst({
    where: { id: investmentId, userId },
  });

  if (!existing) {
    const error = new Error("투자 내역이 없습니다.");
    error.status = 404;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.investment.delete({
      where: {
        id: investmentId,
      },
    });

    await tx.company.update({
      where: {
        id: existing.companyId,
      },
      data: {
        siteInvestment: {
          decrement: existing.amount,
        },
      },
    });
  });
  return { message: "투자 내역이 삭제되었습니다." };
};
