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

  // 折扣需介於 0-1 之間
  rangeValidate: (param, text, next) => {
    if (typeof param !== "number" || param < 0 || param > 1) {
      throw next(appError(200, `輸入值不符合規定`, "100", next));
    }
  },

  // 001 未帶必要欄位
  existValidate: (param, text, next) => {
    if (!param) {
      throw next(appError(200, `未帶必要欄位`, "001", next));
    }
  },

  // 002 結束時間需大於開始時間
  endStartValidate: (start, end, next) => {
    if (new Date(end) <= new Date(start)) {
      throw next(appError(200, `結束時間需大於開始時間`, "002", next));
    }
  },

  // 003 開始時間需大於設定當日
  nowStartValidate: (start, next) => {
    const now = new Date();
    if (new Date(start).getTime() < now.setHours(0, 0, 0, 0)) {
      throw next(appError(200, `開始時間需大於設定當日`, "003", next));
    }
  },

  // 004 活動開始前 10 分鐘後除隱藏外不可新增/修改任何欄位
  tenMinutesValidate: (start, next) => {
    const now = new Date();
    const tenMinutesBefore = new Date(
      new Date(start).getTime() - 10 * 60 * 1000
    );

    if (tenMinutesBefore <= now) {
      throw next(
        appError(
          200,
          `活動開始前 10 分鐘後除隱藏外不可新增/修改任何欄位`,
          "004",
          next
        )
      );
    }
  },

  // 006 此會員沒有可用的折價卷
  existDiscountValidate: (param, text, next) => {
    if (!param) {
      throw next(appError(200, `此會員沒有可用的折價卷`, "006", next));
    }
  },

  booleanValidate: (param, text, next) => {
    if (typeof param !== "boolean") {
      throw next(appError(200, `輸入值不符合規定`, "100", next));
    }
  },
};

export default Validator;
