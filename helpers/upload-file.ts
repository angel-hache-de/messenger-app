import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 as uuid } from "uuid";

/**
 * Upload the filere ceived and store 'em in dist/uploads folder
 * @param file File to save
 * @param validExtensions Extensions valid for the file
 * @param folder subfolder where is gonna be saved
 * @returns file's route if is a valid file
 */
const uploadFileHelper = (
  file: UploadedFile,
  validExtensions: string[],
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cuttedName = file.name.split(".");
    const extension = cuttedName[cuttedName.length - 1];

    // Validate extension
    // const validExtensions = ["png", "jpg", "gif", "jpeg"];
    if (!validExtensions.includes(extension))
      return reject(`${extension} files are not allowed`);

    const newName = uuid() + "." + extension;
    // dirname llega hasta la carpeta controllers, pues este archivo está dentro,
    // de esa carpeta, por lo que subimos un nivel en el árbol.
    const uploadPath = path.join(__dirname, "../uploads/", folder, newName);

    file.mv(uploadPath, (err) => {
      if (err) {
        console.log(err);
        return reject("Something went wrong");
      }
      resolve(newName);
    });
  });
};

/**
 * Uploads many files by callung upliadFileHelper function
 * @param files File array to store
 * @param validExtensions Extensions allowed for the files
 * @param folder subfolder where files are gonna be saved.
 * @returns Array of the files' routes
 */
export const uploadFilesHelper = async (
  files: UploadedFile[],
  validExtensions: string[],
  folder: string
): Promise<string[]> => {
  const filesRoutes: string[] = [];

  try {
    await Promise.all(
      files.map(async (file) => {
        try {
          const route = await uploadFileHelper(file, validExtensions, folder);
          filesRoutes.push(route);
        } catch (error) {
          throw error;
        }
      })
    );
    return filesRoutes;
  } catch (error) {
    throw error;
  }
};

export default uploadFileHelper;
