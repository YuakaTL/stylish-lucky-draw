import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import adminController from "../controllers/adminController.js";
import isAuth from "../middleware/isAuth.js";


const { getRecord, getLottery } = adminController;

router.get("/record", handleErrorAsync(getRecord));
router.get("/lottery", handleErrorAsync(getLottery));

export default router;

