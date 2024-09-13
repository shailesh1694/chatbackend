import { Router } from "express";
import { userRegisterValidator ,userOtpVerify ,userloginvalidator} from "../validator/user.validators.js";
import { validate } from "../utils/validate.js";
import { signUp, verifyotp ,loginUser,getUser ,signOutUser} from "../controller/user.controller.js"
import { userAuthorization } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/sign-up")
    .post(userRegisterValidator(), validate, signUp)
router.route("/sign-in")
    .post(userloginvalidator(), validate, loginUser)

router.route("/verify").post(
    userOtpVerify(),
    validate,
    verifyotp
)

router.route("/")
.get(userAuthorization,getUser)
router.route("/sign-out")
.get(userAuthorization,signOutUser)


export default router;