import {
  addCompanyInvestmentService,
  getCompaniesService,
  getCompanyByIdService,
  getCompanyInvestmentsService,
} from "../services/company.service.js";

export const getCompaniesController = async (req, res, next) => {
  try {
    const companies = await getCompaniesService(req.query);
    res.status(200).json({ data: companies.data, meta: companies.meta });
  } catch (error) {
    next(error);
  }
};

export const getCompanyByIdController = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);
    const company = await getCompanyByIdService(companyId);
    res.status(200).json({ data: company.data });
  } catch (error) {
    next(error);
  }
};

export const getCompanyInvestmentsController = async (req, res, next) => {
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
    next(error);
  }
};

export const addCompanyInvestmentController = async (req, res, next) => {
  try {
    const companyId = Number(req.params.companyId);

    if (Number.isNaN(companyId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const investment = await addCompanyInvestmentService(companyId, req.body);
    res.status(201).json({ message: investment.message });
  } catch (error) {
    next(error);
  }
};
