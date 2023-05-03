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

  updateInventory: async (req, res, next) => {
    validator.existValidate(req.params.discount_id, "discount_id", next);
    console.log(req.body.increase);
    validator.existValidate(req.body.increase, "increase", next);
    validator.booleanValidate(req.body.increase, "increase", next);

    const result = await eventsModel.updateInventory(
      req.params.discount_id,
      req.body.increase
    );

    successHandle(res, "更新成功", {
      discount_id: result.discount_id,
      event_id: result.event_id,
      discount_name: result.discount_name,
      inventory: result.inventory,
    });
  },
};

export default eventsController;
