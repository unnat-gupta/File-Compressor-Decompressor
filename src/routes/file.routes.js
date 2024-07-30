import Router from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  encodeFileController,
  decodeFileController,
} from "../controllers/file.controller.js";

const router = Router();

router
  .route("/compress-file")
  .post(upload.single("originalFile"), encodeFileController);

router
  .route("/decompress-file")
  .post(upload.single("compressedFile"), decodeFileController);

export default router;
