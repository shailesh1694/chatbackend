import { body, param } from "express-validator"

const userRegisterValidator = () => [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username is required !")
        .isLowercase()
        .withMessage("username must be lowercase")
        .isLength({ min: 3 })
        .withMessage("Username must be 3 character !"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required!"),
    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("mobile is required !")
        .isLength({ min: 10 })
        .withMessage("mobile must be 10 digit")
]

const userloginvalidator = () => [
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required!"),
    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("mobile is required !")
        .isLength({ min: 10 })
        .withMessage("mobile must be 10 digit")
]
const userOtpVerify = () => [
    body("mobile")
        .trim()
        .notEmpty()
            .withMessage("mobile is required !")
        .isLength({ min: 10 })
        .withMessage("mobile must be 10 digit"),
    body("otp")
        .trim()
        .notEmpty()
        .withMessage("otp is required !")
        .isLength({ min: 6 })
        .withMessage("otp must be 6 digit")
]

const mongoIdValidator = (idName)=>{
    return [param(idName).notEmpty().isMongoId().withMessage(`${idName} is invalid`)]
}

const messageBodayValidator = () => [
    body("message")
        .trim()
        .notEmpty()
        .withMessage("message is required !")
]

export {
    userRegisterValidator,
    userOtpVerify,
    userloginvalidator,
    mongoIdValidator,
    messageBodayValidator
}