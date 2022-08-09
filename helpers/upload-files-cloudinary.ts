import { v2 as cloudinary } from "cloudinary";
import { UploadedFile } from "express-fileupload";

cloudinary.config(process.env.CLOUDINARY_URL || "");

const VALID_EXTENSIONS_IMGS = ["png", "jpg", "jpeg"];

const saveFile = async (file: UploadedFile): Promise<string | null> => {
  try {
    const { secure_url } = await cloudinary.uploader.upload(file.tempFilePath);
    return secure_url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const validateImg = (file: UploadedFile): boolean => {
  const cuttedName = file.name.split(".");
  const extension = cuttedName[cuttedName.length - 1];

  return VALID_EXTENSIONS_IMGS.includes(extension);
};

export const uploadFiles = async (
  files: UploadedFile[] | UploadedFile
): Promise<string[]> => {
  let filesArray = [];
  const routes: string[] = [];

  if (files instanceof Array) filesArray = files;
  else filesArray[0] = files;

  const invalidImage = filesArray.some((file) => !validateImg(file));
  if (invalidImage)
    throw new Error("Check your images, valid formats: jpg, png and jpeg");

  await Promise.all(
    filesArray.map(async (file) => {
      const url = await saveFile(file);

      if (!url) throw new Error("Error uploading images");

      routes.push(url);
    })
  );

  return routes;
};
