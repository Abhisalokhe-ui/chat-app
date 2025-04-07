import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    debugger
    try {
        const loggedInUserId = req.user._id;
        console.log(loggedInUserId)
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // it excludes current id and all users password

        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessages=async (req,res)=>{
    try {
        const {id:userToChatId}  =req.params   //userToChatId
        const myId=req.user._id

        const messages=await Message.find({
            $or:[
                {senderId:myId , receiverId:userToChatId},
                {senderId:userToChatId , receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages =>",error)
        res.status(500).json({message:"Internal server error"})
    }   
} 

export const sendMessage=async (req,res)=>{
    try {
        const text=req.body.text
        const image=req.body.image
        const {id:receiverId} =req.params
        const senderId =req.user._id

        let imageUrl
        if(image){
            // upload base64 img to cloudinary 

            const uploadedResponse=await cloudinary.uploader.upload(image)
            imageUrl=uploadedResponse.secure_url
        }


        const newMessage=await Message({
            text,
            image:imageUrl,
            senderId,
            receiverId
        })

        await newMessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in send message controller =>",error)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }
}