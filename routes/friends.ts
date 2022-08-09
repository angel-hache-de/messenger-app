import { Router } from "express";
import { getFriendsController } from "../controllers/friends";
import validateJWT from "../middlewares/validate-jwt";

const router = Router();

router.get("/", validateJWT, getFriendsController);

export default router;
