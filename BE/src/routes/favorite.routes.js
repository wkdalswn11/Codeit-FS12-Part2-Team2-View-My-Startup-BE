import express from "express";
import {
  addFavoriteController,
  deleteFavoriteController,
  getFavoritesController,
  getLastFavoriteController,
} from "../controllers/favorite.controller.js";

const router = express.Router();
router.post("/", addFavoriteController);
router.get("/", getFavoritesController);
router.delete("/:companyId", deleteFavoriteController);
router.get("/last", getLastFavoriteController);

export default router;
