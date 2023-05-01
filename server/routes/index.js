import { Router } from "express";
const router = Router();

router.get("/", function (req, res, next) {
  res.status(200).json({
    status: "ok",
    date: new Date().toUTCString(),
  });
});

router.get("/healthcheck", function (req, res, next) {
  res.status(200).json({
    status: "ok",
  });
});

export default router;
