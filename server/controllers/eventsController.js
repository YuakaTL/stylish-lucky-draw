import { eventsModel } from "../models/eventsModel.js";
import appError from "../utils/appError.js";
import successHandle from "../utils/successHandle.js";
import validator from "../utils/validation.js";

const eventsController = {
  getEventDetail: async (req, res, next) => {
    validator.numberValidate(req.query.event_id, "event_id", next);
    const result = await eventsModel.getEventDetail(req.query.event_id);

    if (!result) {
      throw next(appError(400, "該活動不存在", next));
    }

    const event_data = [
      ...result,
    ];

    successHandle(res, "取得成功", event_data);
  },
};

export default eventsController;
