import appError from "./appError.js";
import validator from "validator";

const Validator = {
  numberValidate: (param, text, next) => {
    if (parseInt(param) <= 0) {
      throw next(appError(200, `輸入值不符合規定`, "100", next));
    }

    const pagingRegex = /^[0-9]+$/;
    if (!pagingRegex.test(param) && param !== undefined) {
      throw next(appError(200, `輸入值不符合規定`, "100", next));
    }
  },

  couponValidate: (param, text, next) => {
    const couponRegex = /^[a-zA-Z\d]{10}$/
    if(!couponRegex.test(param) && param !== undefined){
      throw next(appError(200, `輸入值不符合規定`, "100", next));
    }
  },

  existValidate: (param, text, next) => {
    if (!param) {
      throw next(appError(200, `未帶必要欄位`, "001", next));
    }
  },

  existDiscountValidate: (param, text, next) => {
    if (!param) {
      throw next(appError(200, `此會員沒有可用的折價卷`, "006", next));
    }
  },

  // createUserIsValidate: (req, next) => {
  //   const { name, email, password } = req.body;
  //   if (!name || !email || !password) {
  //     throw next(appError(200, "缺少欄位", next));
  //   }

  //   if (!validator.isEmail(email)) {
  //     throw next(appError(200, "Email 格式不符", next));
  //   }

  //   if (
  //     RegExp(
  //       /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-={}[\]:;'<>,.?\/]).*$/
  //     ).test(password) === false
  //   ) {
  //     throw next(
  //       appError(200, "密碼需符合大、小寫英文、數字、特殊符號（四選三）", next)
  //     );
  //   }
  // },

  // signInIsValidate: (req, next) => {
  //   const { provider, email, password } = req.body;
  //   if (!provider || !email || !password) {
  //     throw next(appError(200, "缺少欄位", next));
  //   }

  //   if (!validator.isEmail(email)) {
  //     throw next(appError(200, "Email 格式不符", next));
  //   }
  // },
};

export default Validator;
