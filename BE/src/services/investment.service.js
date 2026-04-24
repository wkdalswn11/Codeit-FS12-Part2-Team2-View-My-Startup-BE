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
  let amount;

  try {
    amount = BigInt(body.amount);
  } catch {
    throw new Error("유효한 투자 금액이 아닙니다.");
  }

  if (amount <= 0n) {
    throw new Error("유효한 투자 금액이 아닙니다.");
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

export const getInvestmentService = async (userId, companyId) => {
  const investment = await prisma.investment.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
    select: {
      amount: true,
      comment: true,
    },
  });

  if (!investment) {
    const error = new Error("투자 내역이 없습니다.");
    error.status = 404;
    throw error;
  }

  return {
    amount: investment.amount,
    comment: investment.comment,
  };
};

export const updateInvestmentService = async (userId, companyId, body) => {
  const existing = await prisma.investment.findUnique({
    where: {
      userId_companyId: { userId, companyId },
    },
  });

  if (!existing) {
    const error = new Error("투자 내역이 없습니다.");
    error.status = 404;
    throw error;
  }

  let amount;

  try {
    amount = BigInt(body.amount);
  } catch {
    throw new Error("유효한 투자 금액이 아닙니다.");
  }

  if (amount <= 0n) {
    throw new Error("유효한 투자 금액이 아닙니다.");
  }

  const diff = amount - existing.amount;

  await prisma.$transaction(async (tx) => {
    await tx.investment.update({
      where: {
        userId_companyId: { userId, companyId },
      },
      data: {
        amount,
        comment: body.comment,
      },
    });

    await tx.company.update({
      where: { id: companyId },
      data: {
        siteInvestment: { increment: diff },
      },
    });
  });

  return { message: "투자 내역이 수정되었습니다." };
};

export const deleteInvestmentService = async (userId, companyId) => {
  const existing = await prisma.investment.findUnique({
    where: {
      userId_companyId: {
        userId,
        companyId,
      },
    },
  });

  if (!existing) {
    const error = new Error("투자 내역이 없습니다.");
    error.status = 404;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.investment.delete({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    await tx.company.update({
      where: {
        id: companyId,
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
