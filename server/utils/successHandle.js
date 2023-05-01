const successHandle = (res, message, data) => {
  res.status(200).json({
    status: "success",
    message,
    data,
  });
};

export default successHandle;
