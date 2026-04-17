import { resetSelectionsService } from "../services/selection.service.js";

export const resetSelectionsController = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "유효한 ID가 아닙니다." });
    }
    await resetSelectionsService(userId);
    res.status(200).json({ message: "선택이 초기화되었습니다." });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};
