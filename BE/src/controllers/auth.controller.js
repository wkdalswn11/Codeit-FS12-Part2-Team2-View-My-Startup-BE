import { addUserService, loginUserService } from "../services/auth.service.js";

export const addUserController = async (req, res, next) => {
  try {
    const user = await addUserService(req.body);

    res.status(201).json({
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserControl = async (req, res, next) => {
  try {
    const user = await loginUserService(req.body);

    res.status(200).json({
      data: user.data,
    });
  } catch (error) {
    next(error);
  }
};
