import { asyncErrorHandle } from "../utils/asyncErrorHandle.js"
import { ApiResponseClass } from "../utils/ApiResponse.js"
import { UserModel } from "../model/user.model.js"
import { ApiErrorClass } from "../utils/apiErrorClass.js"
import { sendEmail } from "../helper/sendEmail.js"


const signUp = asyncErrorHandle(async (req, res) => {

    const { username, email, password, mobile } = req.body
    const findUser = await UserModel.findOne({ $or: [{ email }, { mobile }] });
    if (findUser && findUser.isVerified) {
        throw new ApiErrorClass(422, "user already exist with details")
    }

    const otp = Math.floor(100000 + Math.random() * 900000)

    const mailsendErro = (error) => {
        throw new ApiErrorClass(500, "Internal Server Error")
    }

    if (findUser && !findUser.isVerified) {
        if (findUser.mobile !== mobile) {
            throw new ApiErrorClass(422, "user already exist with this mobile number")
        }
        findUser.emailVerificationCode = otp;
        findUser.emailVerificationCodeExpiry = Date.now() + 60 * 60 * 1000
        await findUser.save();

    } else {
        const createUser = new UserModel({ username, email, password, mobile, emailVerificationCode: otp, emailVerificationCodeExpiry: Date.now() + 60 * 60 * 1000 })
        await createUser.save()
    }
    await sendEmail(email, otp, mailsendErro)

    return res.status(200).json(new ApiResponseClass(200, {}, "otp send successfully to registered email address"))
})

const verifyotp = asyncErrorHandle(async (req, res) => {
    const { otp, mobile } = req.body

    const findUser = await UserModel.findOne({ mobile })
    if (!findUser) {
        throw new ApiErrorClass(404, "user not found")
    }

    if (Date.now() > findUser.emailVerificationCodeExpiry) {
        throw new ApiErrorClass(400, "otp expired")
    }

    if (findUser.emailVerificationCode !== otp) {
        throw new ApiErrorClass(400, "invalid otp")
    }

    findUser.isVerified = true
    findUser.emailVerificationCode = null
    findUser.emailVerificationCodeExpiry = null
    await findUser.save();

    return res.status(200).json(new ApiResponseClass(200, {}, "otp verified successfully"))
})

const loginUser = asyncErrorHandle(async (req, res) => {
    const { mobile, password } = req.body

    const findUser = await UserModel.findOne({ mobile })

    if (!findUser) {
        throw new ApiErrorClass(404, "user not found")
    }
    if (!findUser.isVerified) {
        throw new ApiErrorClass(400, "user not verified")
    }
    const isPasswordMathch = await findUser.isPasswordCorrect(password)
    if (!isPasswordMathch) {
        throw new ApiErrorClass(400, "invalid credentials")
    }

    const generateAccessToken = findUser.generateAccessToken();
    findUser
    return res
        .status(200)
        .cookie("token", generateAccessToken, {
            httpOnly: true,
            secure: true,
            expires: new Date((Date.now() + 24 * 60 * 60 * 1000) + (60 * 60 * 1000)),
        })
        .json(new ApiResponseClass(200, { token: generateAccessToken }, "login successfully"))
})

const getUser = asyncErrorHandle(async (req, res) => {
    return res.
        status(200).
        json(new ApiResponseClass(200,
            {
                _id: req.user._id,
                mobile: req.user.mobile,
                email: req.user.email,
                username: req.user.username
            }, "get user details successfully"))
})
const signOutUser = asyncErrorHandle(async (req, res) => {
    return res
        .clearCookie('token', { secure: true, httpOnly: true })
        .status(200)
        .json(new ApiResponseClass(200, {}, "logout successfull"))
})

export { signUp, verifyotp, loginUser, getUser, signOutUser }