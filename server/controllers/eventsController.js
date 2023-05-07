import { customAlphabet } from "nanoid";
import { eventsModel } from "../models/eventsModel.js";
import https from "https";
import axios from "axios";
import appError from "../utils/appError.js";
import successHandle from "../utils/successHandle.js";
import validator from "../utils/validation.js";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

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
  updateInventory: async (req, res, next) => {
    validator.existValidate(req.params.discount_id, "discount_id", next);
    validator.existValidate(req.body.increase, "increase", next);
    validator.booleanValidate(req.body.increase, "increase", next);

    const result = await eventsModel.updateInventory(
      req.params.discount_id,
      req.body.increase,
      next
    );

    successHandle(res, "更新成功", {
      discount_id: result.discount_id,
      event_id: result.event_id,
      discount_name: result.discount_name,
      inventory: result.inventory,
    });
  },
  updateInfo: async (req, res, next) => {
    const lottery_id = req.params.lottery_id;
    const is_receive = req.body.is_receive;
    validator.existValidate(lottery_id, "lottery_id", next);
    validator.existValidate(is_receive, "is_receive", next);
    validator.numberValidate(lottery_id, "lottery_id", next);
    validator.booleanValidate(is_receive, "is_receive", next);

    const result = await eventsModel.updateInfo(lottery_id, is_receive, next);

    if (result === "find no lottery_id")
      next(appError(200, `輸入值不符合規定`, "100", next));
    if (result === "Exceed 30 seconds")
      next(appError(200, `超過 30 秒未領取`, "005", next));
    else {
      successHandle(res, "更新成功", {
        lottery_id: result.result_info.lottery_id,
        member_id: result.result_info.member_id,
        event_id: result.result_discount.event_id,
        discount_value: result.result_discount.discount_value,
        coupon: result.result_info.coupon,
        is_receive: result.result_info.is_receive,
        is_used: result.result_info.is_used,
        create_time: result.result_info.create_time,
      });
    }
  },
  createInfo: async (req, res, next) => {
    const { member_id, discount_id } = req.body;
    validator.existValidate(member_id, "member_id", next);
    validator.existValidate(discount_id, "discount_id", next);
    validator.numberValidate(member_id, "member_id", next);
    validator.numberValidate(discount_id, "discount_id", next);

    const alphabet =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const generateRandomString = customAlphabet(alphabet, 10);
    const coupon = generateRandomString();

    axios
      .get(
        `http://member-api.appworks.local/api/v1/admin/members/${member_id}`,
        { httpsAgent: agent }
      )
      .then(async (response) => {
        const member_name = response.data.data.username;
        const result = await eventsModel.createInfo(
          member_id,
          member_name,
          discount_id,
          coupon,
          next
        );

        const info_data = {
          lottery_id: result.result_info.lottery_id,
          member_id: result.result_info.member_id,
          member_name: result.result_info.member_name,
          event_id: result.result_discount.event_id,
          discount_value: result.result_discount.discount_value,
          coupon: result.result_info.coupon,
          is_receive: result.result_info.is_receive,
          is_used: result.result_info.is_used,
          create_time: result.result_info.create_time,
        };

        successHandle(res, "新增成功", info_data);
      })
      .catch(() => {
        throw next(appError(200, `系統未知錯誤`, "999", next));
      });
  },
};

export default eventsController;
