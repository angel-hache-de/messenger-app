import { NextFunction, Request, Response } from "express";

/**
 * Validates that, when uploading a file, there is at least
 * one file to upload
 */
const validateFilesLength = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  // Verify that there is just one file in the request
  if (!req.files || !req.files.file || req.files!.file instanceof Array)
    return res.status(400).json({
      errors: [
        {
          msg: "1 Image is required",
        },
      ],
    });

  next();
};

export default validateFilesLength;
