import { Router } from "express";
import { check } from "express-validator";
import {
  getMessagesController,
  postSendMessageController,
  updateMessageStatus,
} from "../controllers/message";
import { messageExists, userExists } from "../helpers/db.validators";
import validateFields from "../middlewares/validate-fields";
import validateJWT from "../middlewares/validate-jwt";
import validateMessageContent, {
  validateMessageStatus,
} from "../middlewares/validate-message";

const router = Router();

// Used to create a message
router.post(
  "/send",
  [
    validateJWT,
    validateMessageContent,
    check("receptorId").isMongoId(),
    check("receptorId").custom(userExists),
    validateFields,
  ],
  postSendMessageController
);

// Used to update the status of a message
router.put(
  "/update/:id",
  [
    validateJWT,
    check("id", "Invalid id").isMongoId(),
    check("id").custom(messageExists),
    validateMessageStatus,
    validateFields,
  ],
  updateMessageStatus
);
//Get all the messages where emitter = user of token
// and receptor = :id
router.get(
  "/get/:id",
  [
    validateJWT,
    check("id", "Invalid id").isMongoId(),
    check("id").custom(userExists),
  ],
  getMessagesController
);

export default router;
