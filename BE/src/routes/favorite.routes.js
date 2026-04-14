import express from "express";
import {
  addFavoriteController,
  deleteFavoriteController,
  getFavoritesController,
} from "../controllers/favorite.controller.js";

const router = express.Router();
router.post("/", addFavoriteController);
router.get("/", getFavoritesController);
router.delete("/:companyId", deleteFavoriteController);

export default router;
