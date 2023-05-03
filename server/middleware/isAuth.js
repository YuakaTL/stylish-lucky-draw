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
          throw next(appError(200, "access-token error", "101", next));
        }
        resolve(decoded);
      });
    });
    req.user = decoded;
    next();
  }
  if (!token) {
    throw next(appError(200, "access-token error", "101", next));
  }
});

export default isAuth;
