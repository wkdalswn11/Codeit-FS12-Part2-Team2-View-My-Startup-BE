import {
  addFavoriteService,
  deleteFavoriteService,
  getFavoritesService,
  getLastFavoriteService,
} from "../services/favorite.service.js";

export const addFavoriteController = async (req, res) => {
  try {
    const companyId = Number(req.body.companyId);
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const favorites = await addFavoriteService(userId, companyId);
    res.status(201).json({ message: favorites.message });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
export const getFavoritesController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const favorites = await getFavoritesService(userId);
    res.status(200).json({ data: favorites.data });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
export const deleteFavoriteController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const companyId = Number(req.params.companyId);
    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    await deleteFavoriteService(userId, companyId);
    res.status(200).json({ message: "기업이 선택 해제 되었습니다." });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
export const getLastFavoriteController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    const result = await getLastFavoriteService(userId);
    res.status(200).json({ data: result.data, total: result.total });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
