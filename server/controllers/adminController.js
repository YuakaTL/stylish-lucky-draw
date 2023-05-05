import { adminModel } from "../models/adminModel.js";
import successHandle from "../utils/successHandle.js";
import validator from "../utils/validation.js";

const adminController = {
  createLottery: async (req, res, next) => {
    const { event_name, event_start_time, event_end_time } = req.body;

    validator.existValidate(event_name, "event_name", next);
    validator.existValidate(event_start_time, "event_start_time", next);
    validator.existValidate(event_end_time, "event_end_time", next);

    // handle time format

    // handle excel
    const filePath = req.files.excel_file[0].path;
    const file = reader.readFile(filePath);
    const sheets = file.SheetNames;
    let data = [];

    for (let i = 0; i < sheets.length; i++) {
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]]);
      temp.forEach((res) => {
        data.push(res);
      });
    }

    console.log(data);

    let event_data;
    for (const item of data) {
      // Error handle for discount_value
      // Error handle for threshold
      // Error handle for inventory

      event_data = {
        discount_name: item.discount_name,
        discount_value: item.discount_value,
        threshold: item.threshold,
        inventory: item.inventory,
      };
    }

    const now = new Date();
    let create_time,
      last_update_time = now.toISOString();
    console.log(create_time);

    const result = await adminModel.createLottery(
      event_name,
      event_start_time,
      event_end_time,
      create_time,
      last_update_time,
      event_data
    );

    console.log(result);

    const lottery_data = {
      event_id: result.result_info.lottery_id,
      event_name: result.result_info.member_id,
      event_start_time: result.result_discount.event_id,
      event_end_time: result.result_discount.discount_value,
      is_visible: result.result_info.coupon,
      status: result.result_info.is_receive,
      event_data: result.result_info.is_used,
      create_at: result.result_info.create_time,
      update_at: "",
    };

    successHandle(res, "新增成功", lottery_data);
  },

  getLottery: async (req, res, next) => {
    const { paging, amount } = req.query;

    if(paging) {
        validator.numberValidate(paging, "paging", next);
    }
    if(amount) {
        validator.numberValidate(amount, "amount", next);
    }

    const page = paging? parseInt(paging) : 1;
    const pageSize = amount? parseInt(amount) : 10;
    
    const result = await adminModel.getLottery(page, pageSize);    

    const lottery = result.map((item) => ({
        event_id: item.event_id,
        event_name: item.event_name,
        event_start_time: item.start_time,
        event_end_time: item.end_time,
        is_visible: item.is_visible,
        status: item.status,
        total_inventory: item.Discount.map((discount) => discount.inventory).reduce((a, b) => a + b),
    }));

    if (result.length > pageSize) {
        const data = {
            lottery: lottery.slice(0, pageSize),
            next_paging: page + 1,
        }
        successHandle(res, "取得成功", data);
    }
    else {
        const data = {
            lottery: lottery,
        }
        successHandle(res, "取得成功", data);
    }
  }
};

export default adminController;