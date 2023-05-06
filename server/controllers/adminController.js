import { adminModel } from "../models/adminModel.js";
import successHandle from "../utils/successHandle.js";
import appError from "../utils/appError.js";
import validator from "../utils/validation.js";

const adminController = {
  getRecord: async (req, res, next) => {
    var { id, paging, amount } = req.query;
    validator.numberValidate(id, "member_id", next);
    validator.numberValidate(paging, "paging", next);
    if (amount !== undefined && amount != 10 && amount != 50 && amount != 999)
      throw next(appError(200, `輸入值不符合規定`, "100", next));

    // if null => set to default
    if (paging === undefined) paging = 1;
    if (amount === undefined) amount = 10;

    const result = await adminModel.getRecord(id, paging, amount, next);

    const record = result.record.map((row) => ({
      discount_name: row.discount.discount_name,
      discount_value: row.discount.discount_value,
      member_id: row.member_id,
      member_name: row.member_name,
      event_id: row.discount.event_id,
      coupon: row.coupon,
      get_coupon_time: row.create_time,
    }));

    if (record.length == parseInt(amount) + 1)
      record.splice(record.length - 1, 1);
    if (result.next_paging === undefined)
      successHandle(res, "取得獲獎記錄", record);
    else
      successHandle(res, "取得獲獎記錄", {
        record,
        next_paging: result.next_paging,
      });
  },
};

export default adminController;
