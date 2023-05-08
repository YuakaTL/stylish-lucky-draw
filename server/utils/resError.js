const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    // status: err.status,
    code: err.customCode,
    message: err.message,
    // error: err,
    // stack: err.stack,
  });
};

const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      code: err.customCode,
      message: err.message,
    });
  } else {
    console.error("出現重大錯誤", err);
    res.status(200).json({
      // status: "error",
      code: "999",
      message: "系統未知錯誤",
      // message: err.message,
    });
  }
};

export { resErrorDev, resErrorProd };
