import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import eventsController from "../controllers/eventsController.js";
import isAuth from "../middleware/isAuth.js";

const { getEventDetail, updateInventory } = eventsController;

router.get("/event", isAuth, handleErrorAsync(getEventDetail));
router.put(
  "/inventory/:discount_id",
  isAuth,
  handleErrorAsync(updateInventory)
);

export default router;
