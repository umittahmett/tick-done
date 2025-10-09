export function errorHandler(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  err.message = err.message || "Internal Server Error"

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    })
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: err.isOperational ? err.message : "Something went wrong",
    })
  }
}
