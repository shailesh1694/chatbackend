import express from "express";
import { validate } from "../utils/validate.js";
import { sendMessage ,getMessageByChatId} from "../controller/message.controller.js";
import { userAuthorization } from "../middleware/auth.middleware.js";
import { messageBodayValidator, mongoIdValidator } from "../validator/user.validators.js";

const router = express.Router();
router.use(userAuthorization)
router.route("/:chatId")
.post(mongoIdValidator("chatId"), messageBodayValidator(), validate, sendMessage)
.get(mongoIdValidator("chatId"), validate, getMessageByChatId)

export default router;
