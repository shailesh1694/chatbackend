
import nodemailer from "nodemailer";

export const sendEmail = async(email, otp,callback) => {

    try {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOption = {
            from: "soulfeedbackservice@noreplay.info",
            to: `${email}`,
            subject: `Verify code`,
            html: `<p> Your verify code is ${otp} !  to verify Yourself !</p/> `,
        }
        const sendInfo = await transport.sendMail(mailOption);
        return sendInfo
    } catch (error) {
        callback(error)
    }
}