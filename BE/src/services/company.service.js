import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompaniesService = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const keyword = query.keyword || "";
  const ids = query.ids
    ? query.ids.split(",").map((id) => Number(id.trim()))
    : [];

  const offset = (page - 1) * limit;

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

  const meta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return { data, meta };
};

export const getCompanyByIdService = async (companyId) => {
  const [company, totalInvestment] = await Promise.all([
    prisma.company.findUnique({
      where: { id: companyId },
    }),
    prisma.investment.aggregate({
      where: { companyId },
      _sum: { amount: true },
    }),
  ]);

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
      totalInvestment: totalInvestment._sum.amount ?? 0,
    },
  };
};
