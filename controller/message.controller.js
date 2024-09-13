import { ChatModel } from "../model/chat.model.js";
import mongoose from "mongoose";
import { MessageModel } from "../model/message.model.js";
import { ChatEventEnum } from "../socket/constant.js";
import { sendSocketEvent } from "../socket/socket.js";
import { ApiErrorClass } from "../utils/apiErrorClass.js";
import { ApiResponseClass } from "../utils/ApiResponse.js";
import { asyncErrorHandle } from "../utils/asyncErrorHandle.js";

const messageCommonAggregate = () => {
    return [
        {
            $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                as: "sender",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            email: 1,
                            mobile: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                sender: { $first: "$sender" },
            },
        }
    ]
}

const sendMessage = asyncErrorHandle(async (req, res) => {
    const { chatId } = req.params
    const { message } = req.body;

    const findChatbyId = await ChatModel.findById(chatId);

    if (!findChatbyId) {
        throw new ApiErrorClass(404, "chat not found")
    }

    const createMessage = new MessageModel({ sender: req.user._id, message, chat: chatId })
    await createMessage.save()

    const findChatandUpdate = await ChatModel.findByIdAndUpdate(chatId, {
        $set: { lastMessage: createMessage._id }
    }, { new: true })

    const findnewMsg = await MessageModel.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(createMessage._id)
            }
        },
        ...messageCommonAggregate()
    ])
    const payload = findnewMsg[0]
    if (!payload) {
        throw new ApiErrorClass(500, "Internal Server Error")
    }

    findChatandUpdate.participants.forEach((participant) => {
        if (participant.toString() === req.user._id.toString()) return;
        sendSocketEvent(req, participant.toString(), ChatEventEnum.RECIVED_MESSAGE_EVENT, payload)
    })
    return res.status(200).json(new ApiResponseClass(200, payload, "message send successfully"))
})

const getMessageByChatId = asyncErrorHandle(async (req, res) => {
    const { chatId } = req.params
    const findMessage = await MessageModel.aggregate([
        {
            $match: {
                chat: new mongoose.Types.ObjectId(chatId)
            }
        },
        {
            $sort: { createdAt: -1 }
        }
        ,
        ...messageCommonAggregate()
    ])

    return res.status(200).json(new ApiResponseClass(200, findMessage, "get message by chat id successfull"))
})

export { sendMessage, getMessageByChatId }