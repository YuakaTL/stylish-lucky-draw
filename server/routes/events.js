import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import eventsController from "../controllers/eventsController.js";
import isAuth from "../middleware/isAuth.js";

const { getEventDetail } = eventsController;

router.get("/event", isAuth, handleErrorAsync(getEventDetail));

export default router;
