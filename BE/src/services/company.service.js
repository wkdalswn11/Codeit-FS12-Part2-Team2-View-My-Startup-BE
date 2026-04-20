import { PrismaClient } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

const prisma = new PrismaClient();

export const getCompaniesService = async (query) => {
  const keyword = query.keyword || "";
  const { page, limit, offset } = getPagination(query);

  let where = {};

  if (keyword) {
    where.name = {
      contains: keyword,
      mode: "insensitive",
    };
  }

  const sortOrder = {
    revenue_desc: { revenue: "desc" },
    revenue_asc: { revenue: "asc" },
    employeeCount_desc: { employeeCount: "desc" },
    employeeCount_asc: { employeeCount: "asc" },
    baseInvestment_desc: { baseInvestment: "desc" },
    baseInvestment_asc: { baseInvestment: "asc" },
    siteInvestment_desc: { siteInvestment: "desc" },
    siteInvestment_asc: { siteInvestment: "asc" },
    favoriteCount_desc: { favoriteCount: "desc" },
    favoriteCount_asc: { favoriteCount: "asc" },
    compareCount_desc: { compareCount: "desc" },
    compareCount_asc: { compareCount: "asc" },
  };

  const sort = sortOrder[query.sort] || sortOrder.revenue_desc;

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: sort,
      skip: offset,
      take: limit,
    }),

    prisma.company.count({
      where,
    }),
  ]);

  const data = companies.map((company, index) => {
    return {
      id: company.id,
      logo: company.logo,
      name: company.name,
      category: company.categoryName,
      description: company.description,
      revenue: company.revenue,
      employeeCount: company.employeeCount,
      baseInvestment: company.baseInvestment,
      siteInvestment: company.siteInvestment,
      favoriteCount: company.favoriteCount,
      compareCount: company.compareCount,
      rank: offset + index + 1,
    };
  });

  const meta = buildPaginationMeta(page, limit, total);

  return { data, meta };
};

export const getCompanyByIdService = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company) {
    const error = new Error("존재하지 않는 기업입니다");
    error.status = 404;
    throw error;
  }

  return {
    data: {
      id: company.id,
      logo: company.logo,
      name: company.name,
      category: company.categoryName,
      description: company.description,
      revenue: company.revenue,
      employeeCount: company.employeeCount,
      baseInvestment: company.baseInvestment,
      siteInvestment: company.siteInvestment,
    },
  };
};

export const getCompanyInvestmentsService = async (companyId, query) => {
  const { page, limit, offset } = getPagination(query);
  const keyword = query.keyword || "";

  let where = {
    companyId,
  };

  if (keyword) {
    where.user = {
      name: {
        contains: keyword,
        mode: "insensitive",
      },
    };
  }
  const [investmentList, total] = await Promise.all([
    prisma.investment.findMany({
      where,
      include: { user: true },
      orderBy: { amount: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.investment.count({
      where,
    }),
  ]);

  const data = investmentList.map((inv, index) => {
    return {
      id: inv.id,
      userName: inv.user?.name ?? null,
      amount: inv.amount,
      comment: inv.comment,
      rank: offset + index + 1,
    };
  });

  const meta = buildPaginationMeta(page, limit, total);

  return { data, meta };
};

export const addCompanyInvestmentService = async (companyId, body) => {
  const userId = Number(body.userId);
  const amount = Number(body.amount);

  if (Number.isNaN(userId)) {
    const error = new Error("유효한 userId가 아닙니다.");
    error.status = 400;
    throw error;
  }
  if (Number.isNaN(amount) || amount <= 0) {
    const error = new Error("유효한 투자 금액이 아닙니다.");
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("유저가 존재하지 않습니다.");
    error.status = 404;
    throw error;
  }

  const existing = await prisma.investment.findFirst({
    where: {
      userId,
      companyId,
    },
  });

  if (existing) {
    const error = new Error("이미 투자한 기업입니다.");
    error.status = 409;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.investment.create({
      data: {
        companyId,
        userId,
        amount,
        comment: body.comment,
      },
    });

    await tx.company.update({
      where: { id: companyId },
      data: {
        siteInvestment: { increment: amount },
      },
    });
  });

  return { message: "투자가 완료되었어요!" };
};
