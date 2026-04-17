export const mapCompanySummary = (item) => {
  return {
    id: item.company.id,
    logo: item.company.logo,
    name: item.company.name,
    category: item.company.categoryName,
  };
};

export const mapCompanyDetail = (item) => {
  return {
    id: item.company.id,
    logo: item.company.logo,
    name: item.company.name,
    category: item.company.categoryName,
    description: item.company.description,
    revenue: item.company.revenue,
    employeeCount: item.company.employeeCount,
    baseInvestment: item.company.baseInvestment,
  };
};

export const companySummarySelect = {
  company: {
    select: {
      id: true,
      logo: true,
      name: true,
      categoryName: true,
    },
  },
};
export const companyDetailSelect = {
  company: {
    select: {
      id: true,
      logo: true,
      name: true,
      categoryName: true,
      description: true,
      revenue: true,
      employeeCount: true,
      baseInvestment: true,
    },
  },
};
