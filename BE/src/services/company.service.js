import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompaniesService = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const keyword = query.keyword || "";

  const offset = (page - 1) * limit;

  const where = keyword
    ? {
        name: {
          contains: keyword,
          mode: "insensitive",
        },
      }
    : {};

  const sortOrder = {
    revenue_desc: { revenue: "desc" },
    revenue_asc: { revenue: "asc" },
    employeeCount_desc: { employeeCount: "desc" },
    employeeCount_asc: { employeeCount: "asc" },
    totalInvestment_desc: { totalInvestment: "desc" },
    totalInvestment_asc: { totalInvestment: "asc" },
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
