import {
  getCompaniesService,
  getCompanyByIdService,
  getCompanyInvestmentsService,
} from "../services/company.service.js";

export const getCompaniesController = async (req, res) => {
  try {
    const companies = await getCompaniesService(req.query);
    res.status(200).json({ data: companies.data, meta: companies.meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompanyByIdController = async (req, res) => {
  try {
    const companyId = Number(req.params.companyId);
    const company = await getCompanyByIdService(companyId);
    res.status(200).json({ data: company.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCompanyInvestmentsController = async (req, res) => {
  try {
    const companyId = Number(req.params.companyId);
    const companyInvestments = await getCompanyInvestmentsService(
      companyId,
      req.query,
    );
    res
      .status(200)
      .json({ data: companyInvestments.data, meta: companyInvestments.meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
