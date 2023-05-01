import { Router } from "express";
const router = Router();
import handleErrorAsync from "../utils/handleErrorAsync.js";
import usersController from "../controllers/usersController.js";
import isAuth from "../middleware/isAuth.js";

const { singUp, signIn, getProfile } = usersController;

router.post("/signup", handleErrorAsync(singUp));

router.post("/signin", handleErrorAsync(signIn));

router.get("/profile", isAuth, handleErrorAsync(getProfile));

export default router;
