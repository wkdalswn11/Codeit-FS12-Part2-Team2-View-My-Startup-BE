import getCompaniesService from "../services/company.service.js";

export const getCompaniesController = async (req, res) => {
  try {
    const companies = await getCompaniesService(req.query);
    res.status(200).json({ data: companies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
