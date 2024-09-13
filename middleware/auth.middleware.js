import { UserModel } from "../model/user.model.js";
import { ApiErrorClass } from "../utils/apiErrorClass.js";
import { asyncErrorHandle } from "../utils/asyncErrorHandle.js";
import jwt from "jsonwebtoken"

const userAuthorization = asyncErrorHandle(async (req, res, next) => {
    const token = req.cookies.token || "";
    if (!token) {
        throw new ApiErrorClass(401, "Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next()
})

export {
    userAuthorization
}