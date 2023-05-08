import { Router } from "express";
import handleErrorAsync from "../utils/handleErrorAsync.js";
import adminController from "../controllers/adminController.js";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = Router();

// Set storage engine of multer
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = "./uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    const filetypes = /xlsx|xls|XLSX|XLS/;

    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (extname) {
      return cb(null, true);
    }
    cb(new Error("The file must be an Excel file!"));
  },
});

const { getLottery, updateLottery, getRecord, createLottery } = adminController;

router.get("/record", handleErrorAsync(getRecord));
router.get("/lottery", handleErrorAsync(getLottery));
router.post(
  "/lottery",
  upload.single("excel_file"),
  handleErrorAsync(createLottery)
);
router.put(
  "/lottery/:event_id",
  upload.single("excel_file"),
  handleErrorAsync(updateLottery)
);

export default router;
