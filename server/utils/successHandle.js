const successHandle = (res, message, data) => {
  res.status(200).json({
    code: "000",
    message,
    data,
  });
};

export default successHandle;
