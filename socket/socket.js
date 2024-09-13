import cookie from "cookie"
import { ApiErrorClass } from "../utils/apiErrorClass.js"
import jwt from "jsonwebtoken"
import { ChatEventEnum } from "./constant.js"



const initialiSocket = (io) => {
    return io.on("connection", (socket) => {
        try {
            const token = cookie.parse(socket.handshake.headers.cookie || "")["token"]
            if (!token) throw new ApiErrorClass(401, "Unauthorized");

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            // console.log(decoded, "decoded")
            socket.join(decoded._id.toString());

            socket.emit(ChatEventEnum.CONNECTED_EVENT)

            socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (chatId) => {
                  console.log(`User joined the chat 🤝. chatId: `, chatId);
                socket.join(chatId)
            })

            socket.on(ChatEventEnum.TYPING_EVENT, (chatId) => {
                socket.in(chatId).emit(ChatEventEnum.TYPING_EVENT, chatId)
            })

            socket.on(ChatEventEnum.STOP_TYPING_EVENT, (chatId) => {
                socket.in(chatId).emit(ChatEventEnum.STOP_TYPING_EVENT, chatId)
            })

            console.log("User connected 🗼. userId: ", decoded._id.toString());

            socket.on(ChatEventEnum.DISCONNECT_EVENT, () => {
                socket.leave(decoded._id.toString());
                console.log("User disconnected 🚫. " + decoded._id.toString());
            });

        } catch (error) {
            socket.emit(ChatEventEnum.ERROR_EVENT, error.message || "something wrong")
        }
    })

}

const sendSocketEvent = (req, roomId, event, payload) => {
    req.app.get("io").to(roomId).emit(event, payload)
}

export { initialiSocket, sendSocketEvent }