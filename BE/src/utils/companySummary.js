export const mapCompanySummary = (item) => {
  return {
    id: item.company.id,
    logo: item.company.logo,
    name: item.company.name,
    category: item.company.categoryName,
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
