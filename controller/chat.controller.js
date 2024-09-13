import { asyncErrorHandle } from "../utils/asyncErrorHandle.js"
import { ApiResponseClass } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
import { ChatModel } from "../model/chat.model.js"
import { ApiErrorClass } from "../utils/apiErrorClass.js"
import { sendSocketEvent } from "../socket/socket.js"
import { ChatEventEnum } from "../socket/constant.js"


const chatCommongAggregate = () => [
    {
        $lookup: {
            from: "users",
            localField: "participants",
            foreignField: "_id",
            as: "participants",
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
        $lookup:{
            from: "messages",
            localField: "lastMessage",
            foreignField: "_id",
            as: "lastMessage",
            pipeline: [
                {
                    $project: {
                        _id: 1,
                        message: 1,
                        sender: 1
                    }
                }
            ]
        }
    },
    {
        $addFields: {
            lastMessage: { $first: "$lastMessage" },
        },
    }
]

const createChatOrgetChat = asyncErrorHandle(async (req, res) => {
    const { receiverId } = req.params

    if (receiverId === req.user._id) {
        throw new ApiErrorClass(422, "you can't creat chat with  yourself")
    }
    const findchat = await ChatModel.aggregate([
        {
            $match: {
                participants: { $all: [new mongoose.Types.ObjectId(receiverId), new mongoose.Types.ObjectId(req.user._id)] }
            }
        },
        ...chatCommongAggregate()
    ])

    if (findchat.length) {
        return res.status(200).json(new ApiResponseClass(200, findchat, "create chat successfull"))
    }

    const createChat = new ChatModel({
        admin: req.user._id,
        participants: [req.user._id, receiverId]
    })
    await createChat.save()

    const chat = await ChatModel.aggregate(
        [
            {
                $match: {
                    _id: (createChat._id)
                }
            },
            ...chatCommongAggregate()
        ]
    )
    const payload = chat[0]
    if (!payload) {
        throw new ApiErrorClass(500, "Internal Server Error")
    }

    payload.participants?.forEach(participant => {
        if (participant._id.toString() === req.user._id.toString()) return;

        sendSocketEvent(req, participant._id.toString(), ChatEventEnum.NEW_CHAT_EVENT, payload)
    });

    return res.status(200).json(new ApiResponseClass(200, payload, "create chat successfull"))
})

const getAllChats = asyncErrorHandle(async (req, res) => {

    const chats = await ChatModel.aggregate([
        {
            $match: {
                participants: { $in: [new mongoose.Types.ObjectId(req.user._id)] }
            }
        },
        ...chatCommongAggregate()
    ])

    return res.status(200).json(new ApiResponseClass(200, chats, "successfull"))
})

export { createChatOrgetChat, getAllChats }