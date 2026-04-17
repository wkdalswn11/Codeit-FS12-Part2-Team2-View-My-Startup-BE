import express from "express";
import {
  addFavoriteController,
  deleteFavoriteController,
  getFavoritesController,
  getLastFavoriteController,
} from "../controllers/favorite.controller.js";

const router = express.Router({ mergeParams: true });
router.post("/", addFavoriteController);
router.get("/last", getLastFavoriteController);
router.get("/", getFavoritesController);
router.delete("/:companyId", deleteFavoriteController);

export default router;
