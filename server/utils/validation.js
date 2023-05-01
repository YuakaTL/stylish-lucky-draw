import appError from "./appError.js";
import validator from "validator";

const customValidator = {
  numberValidate: (param, text, next) => {
    if (parseInt(param) <= 0) {
      throw next(appError(400, `${text} 錯誤（不能輸入 0 or 負數）`, next));
    }

    const pagingRegex = /^[0-9]+$/;
    if (!pagingRegex.test(param) && param !== undefined) {
      throw next(appError(400, `${text} 錯誤（不能輸入非數字）`, next));
    }
  },

  createUserIsValidate: (req, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw next(appError(400, "缺少欄位", next));
    }

    if (!validator.isEmail(email)) {
      throw next(appError(400, "Email 格式不符", next));
    }

    if (
      RegExp(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-={}[\]:;'<>,.?\/]).*$/
      ).test(password) === false
    ) {
      throw next(
        appError(400, "密碼需符合大、小寫英文、數字、特殊符號（四選三）", next)
      );
    }
  },

  signInIsValidate: (req, next) => {
    const { provider, email, password } = req.body;
    if (!provider || !email || !password) {
      throw next(appError(400, "缺少欄位", next));
    }

    if (!validator.isEmail(email)) {
      throw next(appError(400, "Email 格式不符", next));
    }
  },
};

export default customValidator;
