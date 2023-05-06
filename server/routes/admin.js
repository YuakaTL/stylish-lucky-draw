import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import adminController from "../controllers/adminController.js";
import isAuth from "../middleware/isAuth.js";

const { getRecord } = adminController;

router.get("/record", handleErrorAsync(getRecord));

export default router;
