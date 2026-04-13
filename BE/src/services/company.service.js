import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompaniesService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const sort = query.sort || "revenue_desc";
  const keyword = query.keyword || "";

  const offset = (page - 1) * limit;

  const where = {
    name: {
      contains: keyword,
      mode: "insensitive",
    },
  };

  const orderBy = {
    revenue_desc: { revenue: "desc" },
    revenue_asc: { revenue: "asc" },
    employeeCount_desc: { employeeCount: "desc" },
    employeeCount_asc: { employeeCount: "asc" },
    totalInvestment_desc: { totalInvestment: "desc" },
    totalInvestment_asc: { totalInvestment: "asc" },
  };

  const sortOrder = orderBy[sort];

  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy: sortOrder,
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
      name: company.name,
      category: company.category,
      description: company.description,
      revenue: company.revenue,
      employeeCount: company.employeeCount,
      totalInvestment: company.baseInvestment,
      rank: offset + index + 1,
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
