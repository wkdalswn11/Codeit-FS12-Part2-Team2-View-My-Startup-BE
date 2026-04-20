import {
  addFavoriteService,
  deleteFavoriteService,
  getFavoritesService,
  getLastFavoriteService,
} from "../services/favorite.service.js";

export const addFavoriteController = async (req, res, next) => {
  try {
    const companyId = Number(req.body.companyId);
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const favorites = await addFavoriteService(userId, companyId);
    res.status(201).json({ message: favorites.message });
  } catch (error) {
    next(error);
  }
};

export const getFavoritesController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const favorites = await getFavoritesService(userId);
    res.status(200).json({ data: favorites.data });
  } catch (error) {
    next(error);
  }
};

export const deleteFavoriteController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const companyId = Number(req.params.companyId);

    if (Number.isNaN(userId) || Number.isNaN(companyId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    await deleteFavoriteService(userId, companyId);
    res.status(200).json({ message: "기업이 선택 해제 되었습니다." });
  } catch (error) {
    next(error);
  }
};

export const getLastFavoriteController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (Number.isNaN(userId)) {
      const error = new Error("유효한 ID가 아닙니다.");
      error.status = 400;
      throw error;
    }

    const result = await getLastFavoriteService(userId);
    res.status(200).json({ data: result.data, total: result.total });
  } catch (error) {
    next(error);
  }
};
