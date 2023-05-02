const appError = (httpStatus, errMessage, customCode, next) => {
  const error = new Error(errMessage);
  error.customCode = customCode;
  error.statusCode = httpStatus;
  error.isOperational = true; // 可預期錯誤
  const status = `${httpStatus}`.startsWith("4") ? "fail" : "error";
  error.status = status;
  next(error);
};

export default appError;
