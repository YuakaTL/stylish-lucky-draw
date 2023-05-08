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

const getRandom = (x) => {
  return Math.floor(Math.random() * x);
};

const eventsController = {
  startDraw: async (req, res, next) => {
    const { member_id, event_id } = req.body;
    const TOKEN = req.headers.authorization;
    validator.existValidate(member_id, "member_id", next);
    validator.existValidate(event_id, "event_id", next);

    axios
      .get(
        `http://member-api.appworks.local/api/v1/admin/members/${member_id}`,
        { httpsAgent: agent }
      )
      .then(async (response) => {
        // 檢查是否加入三個月
        const register_at = new Date(response.data.data.register_at);
        const now = new Date();
        if (now.getTime() - register_at.getTime() > 1000 * 60 * 60 * 24 * 90)
          throw next(appError(200, `使用者註冊未滿三個月`, "102", next));
        else {
          // 拿取會員近一個月消費金額

          // 用GET /event 拿取獎品列表，使用最低threshold檢查是否符合抽獎資格，若庫存為0也回傳不能抽獎
          axios
            .get(
              `http://localhost:5000/api/v1/lottery/event?event_id=${event_id}`,
              {
                httpsAgent: agent,
                headers: {
                  Authorization: `${TOKEN}`,
                },
              }
            )
            .then(async (response) => {
              const discount_list = response.data.data;
              var discount = null;
              let discount_inventory = 0;
              // 抽獎 -> 檢查是否符合獎品資格（剩餘數量、threshold）-> 一直抽直到符合資格
              while (discount_inventory == 0 /* OR 不符合 threshold 資格 */) {
                discount = discount_list[getRandom(discount_list.length)];

                discount_inventory = discount.inventory;
                // discount_threshold = discount.threshold
              }
              // 用 PUT /inventory 將庫存-1
              console.log(discount.discount_id);
              axios
                .put(
                  `http://localhost:5000/api/v1/lottery/inventory/${discount.discount_id}`,
                  {
                    increase: false /*這邊過不了booleanValidate，但設成true可以*/,
                  },
                  {
                    headers: {
                      Authorization: `${TOKEN}`,
                    },
                  }
                )
                .then((response) => {
                  console.log(response.data);
                });

              // response 為抽到的獎項
            });
        }
      });
  },
  getEventDetail: async (req, res, next) => {
    validator.existValidate(req.query.event_id, "event_id", next);
    validator.numberValidate(req.query.event_id, "event_id", next);
    const result = await eventsModel.getEventDetail(req.query.event_id);

    console.log(result);

    const event_data = result.map((event) => ({
      discount_id: event.discount_id,
      discount_name: event.discount_name,
      discount_value: event.discount_value,
      threshold: event.threshold,
      inventory: event.inventory,
    }));

    successHandle(res, "取得成功", event_data);
  },
  getMemberPrize: async (req, res, next) => {
    validator.existValidate(req.query.member_id, "member_id", next);
    validator.numberValidate(req.query.member_id, "member_id", next);
    const member_result = await eventsModel.getMemberPrize(req.query.member_id);

    if (member_result.length === 0) {
      throw next(appError(200, `此會員沒有可用的折價卷`, "006", next));
    }

    const prize_data = member_result.map((prize) => ({
      discount_name: prize.discount.discount_name,
      discount_value: prize.discount.discount_value,
    }));

    successHandle(res, "取得成功", prize_data);
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
