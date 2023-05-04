import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import eventsController from "../controllers/eventsController.js";
import isAuth from "../middleware/isAuth.js";


const { getEventDetail, updateInventory, createInfo, updateInfo } = eventsController;

router.get("/event", isAuth, handleErrorAsync(getEventDetail));
router.put("/inventory/:discount_id", isAuth, handleErrorAsync(updateInventory));
router.post("/info", isAuth, handleErrorAsync(createInfo));
router.put("/receive/:lottery_id", isAuth, handleErrorAsync(updateInfo));

export default router;
