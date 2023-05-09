import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import eventsController from "../controllers/eventsController.js";
import isAuth from "../middleware/isAuth.js";

const { getEventDetail, updateInventory, createInfo, updateInfo, getMemberPrize, startDraw } = eventsController;

router.get("/event", isAuth, handleErrorAsync(getEventDetail));
router.put("/inventory/:discount_id", isAuth, handleErrorAsync(updateInventory));
router.post("/info", isAuth, handleErrorAsync(createInfo));
router.get("/member", isAuth, handleErrorAsync(getMemberPrize))
router.put("/receive/:lottery_id", isAuth, handleErrorAsync(updateInfo));
router.post("/draw", isAuth, handleErrorAsync(startDraw))

export default router;
