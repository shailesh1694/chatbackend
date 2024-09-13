import express from "express";
import { validate } from "../utils/validate.js";
import { createChatOrgetChat ,getAllChats } from "../controller/chat.controller.js";
import { mongoIdValidator } from "../validator/user.validators.js";
import { userAuthorization } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(userAuthorization)
router.route("/").get(getAllChats)
router.route("/create/:receiverId")
    .post(mongoIdValidator("receiverId"), validate, createChatOrgetChat)
export default router