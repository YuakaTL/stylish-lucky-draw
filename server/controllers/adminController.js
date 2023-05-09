import { adminModel } from "../models/adminModel.js";
import successHandle from "../utils/successHandle.js";
import appError from "../utils/appError.js";
import validator from "../utils/validation.js";
import xlsx from "xlsx";

const adminController = {
  createLottery: async (req, res, next) => {
    const {
      event_name,
      event_start_time,
      event_end_time,
      event_data,
      is_visible,
    } = req.body;
    // exist check
    validator.existValidate(event_name, "event_name", next);
    validator.existValidate(event_start_time, "event_start_time", next);
    validator.existValidate(event_end_time, "event_end_time", next);
    validator.existValidate(event_data, "event_data", next);
    validator.existValidate(is_visible, "is_visible", next);

    // handle time format
    validator.endStartValidate(event_start_time, event_end_time, next);
    validator.nowStartValidate(event_start_time, next);
    validator.tenMinutesValidate(event_start_time, next);

    const result = await adminModel.createLottery(
      event_name,
      event_start_time,
      event_end_time,
      event_data,
      is_visible,
      next
    );
    console.log(result);
    // return
    const lottery_data = {
      event_id: result.event_id,
      event_name: result.event_name,
      event_start_time: result.event_start_time,
      event_end_time: result.event_end_time,
      is_visible: result.is_visible,
      status: result.status,
      event_data: result.event_data,
      create_at: result.create_time,
      update_at: result.last_update_time,
    };

    successHandle(res, "更新成功", lottery_data);
  },
  updateLottery: async (req, res, next) => {
    const { event_name, event_start_time, event_end_time, is_visible, status } =
      req.body;

    // exist check
    validator.existValidate(req.params.event_id, "event_id", next);
    validator.existValidate(event_name, "event_name", next);
    validator.existValidate(event_start_time, "event_start_time", next);
    validator.existValidate(event_end_time, "event_end_time", next);
    validator.existValidate(is_visible, "is_visible", next);
    validator.existValidate(status, "status", next);

    // handle time format
    validator.endStartValidate(event_start_time, event_end_time, next);
    validator.nowStartValidate(event_start_time, next);
    validator.tenMinutesValidate(event_start_time, next);

    // turn string into boolean
    const is_visible_bool = is_visible === "true";

    // handle excel data
    validator.existValidate(req.file, "req.file", next);
    const filePath = req.file.path;
    const file = xlsx.readFile(filePath);
    const sheets = file.SheetNames;
    let data = [];

    for (let i = 0; i < sheets.length; i++) {
      const temp = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }

    const result = await adminModel.updateLottery(
      req.params.event_id,
      event_name,
      event_start_time,
      event_end_time,
      is_visible_bool,
      status,
      data,
      next
    );

    // return
    const lottery_data = {
      event_id: result.event_id,
      event_name: result.event_name,
      event_start_time: result.event_start_time,
      event_end_time: result.event_end_time,
      is_visible: result.is_visible,
      status: result.status,
      event_data: result.event_data,
      create_at: result.create_time,
      update_at: result.last_update_time,
    };

    successHandle(res, "更新成功", lottery_data);
  },
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
  getLottery: async (req, res, next) => {
    const { paging, amount } = req.query;

    if (paging) {
      validator.numberValidate(paging, "paging", next);
    }
    if (amount) {
      validator.numberValidate(amount, "amount", next);
      if (
        amount !== undefined &&
        parseInt(amount) !== 10 &&
        parseInt(amount) !== 50 &&
        parseInt(amount) !== 999
      ) {
        throw next(appError(200, "輸入值不符合規定", 100, next));
      }
    }

    const page = paging ? parseInt(paging) : 1;
    const pageSize = amount ? parseInt(amount) : 10;

    const result = await adminModel.getLottery(page, pageSize);

    const lottery = result.map((item) => ({
      event_id: item.event_id,
      event_name: item.event_name,
      event_start_time: item.start_time,
      event_end_time: item.end_time,
      is_visible: item.is_visible,
      status: item.status,
      total_inventory: item.Discount.map(
        (discount) => discount.inventory
      ).reduce((a, b) => a + b),
    }));

    if (result.length > pageSize && pageSize < 999) {
      const data = {
        lottery: lottery.slice(0, pageSize),
        next_paging: page + 1,
      };
      successHandle(res, "取得成功", data);
    } else {
      const data = {
        lottery: lottery,
      };
      successHandle(res, "取得成功", data);
    }
  },
};

export default adminController;
