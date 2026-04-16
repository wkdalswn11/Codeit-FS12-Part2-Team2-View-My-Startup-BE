import { PrismaClient } from "@prisma/client";
import { buildPaginationMeta, getPagination } from "../utils/pagination.js";

const prisma = new PrismaClient();

export const getCompaniesService = async (query) => {
  const keyword = query.keyword || "";
  const ids = query.ids
    ? query.ids.split(",").map((id) => Number(id.trim()))
    : [];

  const { page, limit, offset } = getPagination(query);

  let where = {};

  if (ids.length > 0) {
    where.id = { in: ids };
  } else if (keyword) {
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
    totalInvestment_desc: { totalInvestment: "desc" },
    totalInvestment_asc: { totalInvestment: "asc" },
  };

  const sort = sortOrder[query.sort] || sortOrder.revenue_desc;

  const isIdsQuery = ids.length > 0;
  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: sort,
      ...(isIdsQuery ? {} : { skip: offset, take: limit }),
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
      totalInvestment: company.baseInvestment,
      ...(isIdsQuery ? {} : { rank: offset + index + 1 }),
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
  const [investmentList, total] = await Promise.all([
    prisma.investment.findMany({
      where: { companyId },
      include: { user: true },
      orderBy: { amount: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.investment.count({
      where: { companyId },
    }),
  ]);

  const data = investmentList.map((inv, index) => {
    return {
      userName: inv.user?.name ?? null,
      amount: inv.amount,
      comment: inv.comment,
      rank: offset + index + 1,
    };
  });

  const meta = buildPaginationMeta(page, limit, total);

  return { data, meta };
};
