import { adminModel } from "../models/adminModel.js";
import successHandle from "../utils/successHandle.js";
import validator from "../utils/validation.js";
import xlsx from "xlsx";

const adminController = {
  createLottery: async (req, res, next) => {
    const { event_name, event_start_time, event_end_time } = req.body;
    // exist check
    validator.existValidate(event_name, "event_name", next);
    validator.existValidate(event_start_time, "event_start_time", next);
    validator.existValidate(event_end_time, "event_end_time", next);

    // handle time format
    validator.endStartValidate(event_start_time, event_end_time, next);
    validator.nowStartValidate(event_start_time, next);
    validator.tenMinutesValidate(event_start_time, next);

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

    const result = await adminModel.createLottery(
      event_name,
      event_start_time,
      event_end_time,
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

    successHandle(res, "新增成功", lottery_data);
  },
};

export default adminController;
