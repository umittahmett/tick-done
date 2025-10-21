export function errorHandler(err, req, res, next) {
  err.status = err.status || 500
  err.message = err.message || "Internal Server Error"

  if (process.env.NODE_ENV === "development") {
    res.status(err.status).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    })
  } else {
    res.status(err.status).json({
      success: false,
      message: err.isOperational ? err.message : "Something went wrong",
    })
  }
}
