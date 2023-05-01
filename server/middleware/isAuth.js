import handleErrorAsync from "../utils/handleErrorAsync.js";
import jwt from "jsonwebtoken";
import appError from "../utils/appError.js";

const isAuth = handleErrorAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
          throw next(appError(401, "JWT Token 錯誤, 請重新登入", next));
        }
        resolve(decoded);
      });
    });
    req.user = decoded;
    next();
  }
  if (!token) {
    throw next(appError(401, "尚未登入", next));
  }
});

export default isAuth;
