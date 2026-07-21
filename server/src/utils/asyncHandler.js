const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch((error) => {
    console.error(`[asyncHandler] ${req.method} ${req.originalUrl}`, error);
    next(error);
  });
};

module.exports = asyncHandler;
