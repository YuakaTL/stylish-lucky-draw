const successHandle = (res, message, event_data) => {
  res.status(200).json({
    code: "000",
    message,
    event_data,
  });
};

export default successHandle;
