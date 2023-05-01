import { usersModel } from "../models/usersModel.js";
import appError from "../utils/appError.js";
import successHandle from "../utils/successHandle.js";
import validator from "../utils/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ms from "ms";

const generateJWToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const usersController = {
  singUp: async (req, res, next) => {
    validator.createUserIsValidate(req, next);
    let { name, email, password } = req.body;

    const result = await usersModel.singUp({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      provider: "native",
    });

    const resultData = {
      access_token: generateJWToken(result.id),
      access_expired: ms(process.env.JWT_EXPIRES_IN) / 1000,
      user: {
        id: result.id,
        provider: result.provider,
        name: result.name,
        email: result.email,
        picture: result.picture,
      },
    };

    successHandle(res, "新增使用者成功", resultData);
  },

  signIn: async (req, res, next) => {
    validator.signInIsValidate(req, next);
    let { provider, email, password } = req.body;

    if (provider === "native") {
      const result = await usersModel.signIn(email);

      if (!result) {
        throw next(appError(404, "使用者不存在", next));
      }

      if (!(await bcrypt.compare(password, result.password))) {
        throw next(appError(401, "密碼錯誤", next));
      }

      const resultData = {
        access_token: generateJWToken(result.id),
        access_expired: ms(process.env.JWT_EXPIRES_IN) / 1000,
        user: {
          id: result.id,
          provider: result.provider,
          name: result.name,
          email: result.email,
          ...(result.picture && { picture: result.picture }),
        },
      };

      successHandle(res, "登入成功", resultData);
    } else {
      throw next(appError(400, "第三方登入尚未開放", next));
    }
  },

  getProfile: async (req, res, next) => {
    const result = await usersModel.getProfile(req.user.id);

    if (!result) {
      throw next(appError(404, "使用者不存在", next));
    }

    const resultData = {
      user: {
        provider: result.provider,
        name: result.name,
        email: result.email,
        ...(result.picture && { picture: result.picture }),
      },
    };

    successHandle(res, "取得使用者資料成功", resultData);
  },
};

export default usersController;
