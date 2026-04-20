import { addUserService, loginUserService } from "../services/auth.service.js";

export const addUserController = async (req, res) => {
  try {
    const user = await addUserService(req.body);

    res.status(201).json({
      data: user.data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};

export const loginUserControl = async (req, res) => {
  try {
    const user = await loginUserService(req.body);

    res.status(200).json({
      data: user.data,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message,
    });
  }
};
