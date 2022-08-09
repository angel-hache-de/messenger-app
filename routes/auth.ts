import { Router } from "express";
import { check } from "express-validator";
import {
  loginController,
  logoutController,
  signupController,
} from "../controllers/auth";
import { emailExists } from "../helpers/db.validators";
import validateFields from "../middlewares/validate-fields";
import validateFilesLength from "../middlewares/validate-file";
import validateJWT from "../middlewares/validate-jwt";

const router = Router();

router.post(
  "/signup",
  [
    check("userName", "Username is required").not().isEmpty(),
    check("password", "Password min length is 6").isLength({ min: 6 }),
    check("email", "Invalid email").isEmail(),
    check("email").custom(emailExists),
    validateFilesLength,
    validateFields,
  ],
  signupController
);

router.post(
  "/login",
  [
    check("password", "Password min length is 6").isLength({ min: 6 }),
    check("email", "Invalid email!").isEmail(),
    validateFields,
  ],
  loginController
);

router.post("/logout", [validateJWT], logoutController);

export default router;
