import { customAlphabet } from "nanoid";
import { eventsModel } from "../models/eventsModel.js";
import appError from "../utils/appError.js";
import successHandle from "../utils/successHandle.js";
import validator from "../utils/validation.js";

const eventsController = {
  getEventDetail: async (req, res, next) => {
    validator.existValidate(req.query.event_id, "event_id", next);
    validator.numberValidate(req.query.event_id, "event_id", next);
    const result = await eventsModel.getEventDetail(req.query.event_id);

    console.log(result);

    const event_data = result.map((event) => ({
      discount_name: event.discount_name,
      discount_value: event.discount_value,
      threshold: event.threshold,
      inventory: event.inventory,
    }));

    successHandle(res, "取得成功", event_data);
  },
  createInfo: async (req, res, next) => {
    const { member_id, discount_id } = req.body;
    validator.existValidate(member_id, "member_id", next);
    validator.existValidate(discount_id, "discount_id", next);
    validator.numberValidate(member_id, "member_id", next);
    validator.numberValidate(discount_id, "discount_id", next);

    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const generateRandomString = customAlphabet(alphabet, 10)
    const coupon = generateRandomString()

    validator.couponValidate(coupon, "coupon", next);

    const result = await eventsModel.createInfo(
      member_id,
      discount_id,
      coupon,
      next
    );

    console.log(result);

    const info_data = {
      lottery_id: result.result_1.lottery_id,
      member_id: result.result_1.member_id,
      event_id: result.result_2.event_id,
      discount_value: result.result_2.discount_value,
      coupon: result.result_1.coupon,
      is_receive: result.result_1.is_receive,
      is_used: result.result_1.is_used,
      create_time: result.result_1.create_time,
    };

    successHandle(res, "新增成功", info_data);
  },
};

export default eventsController;
