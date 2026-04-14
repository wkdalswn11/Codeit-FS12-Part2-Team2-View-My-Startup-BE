import {
  addFavoriteService,
  getFavoritesService,
} from "../services/favorite.service.js";

export const addFavoriteController = async (req, res) => {
  try {
    const companyId = Number(req.body.companyId);
    const userId = 1;
    const company = await addFavoriteService(userId, companyId);
    res.status(201).json({ message: "기업이 선택 되었습니다", data: company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getFavoritesController = async (req, res) => {
  try {
    const userId = 1;
    const companyIds = await getFavoritesService(userId);
    res.status(200).json({ data: companyIds });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
