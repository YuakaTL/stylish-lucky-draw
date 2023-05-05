import { adminModel } from "../models/adminModel.js";
import successHandle from "../utils/successHandle.js";
import appError from "../utils/appError.js";
import validator from "../utils/validation.js";

const adminController = {
  getLottery: async (req, res, next) => {
    const { paging, amount } = req.query;
    
    if(paging) {
        validator.numberValidate(paging, "paging", next);
    }
    if(amount) {
        validator.numberValidate(amount, "amount", next);
        if (amount !== undefined && parseInt(amount) !== 10 && parseInt(amount) !== 50 && parseInt(amount) !== 999) {
            throw next(appError(200, "輸入值不符合規定", 100, next));
        }
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

    if (result.length > pageSize && pageSize < 999) {
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