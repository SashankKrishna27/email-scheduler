export const errorHandler = (error, _req, _res, _next) => {
  console.log(error?.message, error?.statusCode);
  if (_res.headersSent) {
    return _next(error);
  }
  _res.status(error?.statusCode || 500).json({
    message: error?.message || "An unknown error",
  });
};
