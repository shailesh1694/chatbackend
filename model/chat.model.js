import mongoose, { Schema } from "mongoose";

const chatScheama = new Schema({
    admin: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message"
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
}, { timestamps: true })



export const ChatModel = mongoose.model("Chat", chatScheama)



