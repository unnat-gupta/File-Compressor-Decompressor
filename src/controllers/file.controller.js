import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { Codec } from "../utils/Codec_Implementation.js";

const encodeFileController = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(404, "File not found");
  const uploadedFileSize = req.file.size;
  if (uploadedFileSize === 0) throw new ApiError(500, "The file is Empty");
  else if (uploadedFileSize <= 350)
    throw new ApiError(
      500,
      "The uploaded file is small is size! The compressed file may be larger than the original file"
    );
  const fileData = fs.readFileSync(req.file.path, "utf-8", (err, data) => {
    if (err && err.code !== "ENOENT")
      throw new ApiError(400, "Error while reading file.");
    if (err) throw new ApiError(400, err.message || "Something's Wrong");

    return data;
  });

  let codecObj = new Codec();
  let [encodedString, outputMsg] = codecObj.encode(fileData);

  let compressedFileName = req.file.originalname + "_compressed.txt";

  fs.writeFile(compressedFileName, encodedString, (err) => {
    if (err) throw new ApiError(500, "Cannot write compressed file");
  });

  fs.unlinkSync(req.file.path);
  return res
    .status(200)
    .json(
      new ApiResponse(200, { "file-name": compressedFileName }, "File is read")
    );
});

const decodeFileController = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(404, "File not found");
  let uploadedFileSize = req.file?.size;
  if (uploadedFileSize === 0) throw new ApiError(500, "The file is Empty");
  const fileData = fs.readFileSync(req.file.path, "utf-8", (err, data) => {
    if (err && err.code !== "ENOENT")
      throw new ApiError(400, "Error while reading file.");
    if (err) throw new ApiError(400, err.message || "Something's Wrong");

    return data;
  });

  let codecObj = new Codec();
  let [decodedString, outputMsg] = codecObj.decode(fileData);

  let decompressedFileName = req.file.originalname.split("_")[0];

  fs.writeFile(decompressedFileName, decodedString, (err) => {
    if (err) throw new ApiError(500, "Cannot write decompressed file");
  });

  fs.unlinkSync(req.file.path);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { "file-name": req.file.originalname },
        "File is read"
      )
    );
});

export { encodeFileController, decodeFileController };
