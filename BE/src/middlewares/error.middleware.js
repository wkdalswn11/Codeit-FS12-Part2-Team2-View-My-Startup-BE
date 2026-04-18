export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "서버 에러",
  });
};
