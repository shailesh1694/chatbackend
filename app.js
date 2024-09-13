import express from "express";
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import { initialiSocket } from "./socket/socket.js";
import cookieParser from "cookie-parser";
import globalErrorhandle from "./utils/globalErrorhandle.js";
import morgan from "morgan";


const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer, { cors: { origin: "http://localhost:3000", credentials: true } })

app.set("io", io)
app.use(cors({ origin: "http://localhost:3000" , credentials: true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("combined"))
// server export for socket initializer
import userRoute from "./routes/user.routes.js"
import chatRoute from "./routes/chat.routes.js"
import messageRoute from "./routes/message.routes.js"

app.use("/api/v1/user", userRoute)
app.use("/api/v1/chat", chatRoute)
app.use("/api/v1/message", messageRoute)


initialiSocket(io)
app.use(globalErrorhandle)
export { httpServer }