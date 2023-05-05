import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { resErrorDev, resErrorProd } from "./utils/resError.js";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

import * as swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";
const swaggerFile = JSON.parse(
  await readFile(new URL("./docs/swagger.json", import.meta.url))
);

// 程式出現重大錯誤
process.on("uncaughtException", (err) => {
  // 記錄錯誤，等到服務都處理完後，停掉該 process
  console.error("Uncaught Exception!");
  console.error(err);
  process.exit(1);
});

import indexRouter from "./routes/index.js";
import eventsRouter from "./routes/events.js";

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", indexRouter);
app.use("/api/v1/lottery", eventsRouter);
app.use("/api/v1/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(errorHandle(res, 404));
  res.status(404).json({
    status: "false",
    message: "Page Not Found",
  });
});

// error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    resErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.isAxiosError == true) {
      err.message = "axios 連線錯誤";
      err.isOperational = true;
      return resErrorProd(err, res);
    } else if (
      err instanceof Prisma.PrismaClientValidationError ||
      err instanceof Prisma.PrismaClientKnownRequestError
    ) {
      err.statusCode = 400;
      err.isOperational = true;
      err.message;
      return resErrorProd(err, res);
    } else if (err.name === "MulterError") {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        err.message = "上傳檔案數量錯誤";
        err.statusCode = 400;
        err.isOperational = true;
        return resErrorProd(err, res);
      }
      err.statusCode = 400;
      err.isOperational = true;
      err.message = "上傳檔案錯誤";
      return resErrorProd(err, res);
    } else if (err.name === "TokenExpiredError") {
      err.statusCode = 401;
      err.isOperational = true;
      err.message = "Token 已過期，請重新登入";
    } else if (
      err instanceof SyntaxError &&
      err.status === 400 &&
      "body" in err
    ) {
      err.statusCode = 400;
      err.isOperational = true;
      err.message = "資料格式錯誤";
    }
    resErrorProd(err, res);
  }
});

// 未捕捉到的 promise rejection (catch)
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", reason);
});

export default app;
