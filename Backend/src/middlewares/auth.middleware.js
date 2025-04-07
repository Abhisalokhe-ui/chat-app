import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import dotenv from "dotenv"
dotenv.config()
const jwt_secret=process.env.JWT_SECRET

export const validUser=async(req,res,next)=>{

    
   try{
         const token = req.cookies.jwt || req.headers['authorization'];
    
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        console.log("token=",token)
        const decoded=jwt.verify(token,jwt_secret)
        console.log("decoded=",decoded)

        if(!decoded){
            return res.status(401).json({ message: 'Invalid token ' });
        }
        
        const user=await User.findById(decoded.userId).select("-password")    // it exclude password
        console.log("user=",user)

        if(!user){
            return res.status(404).json({ message: 'User not found' });

        }
        req.user=user     // passing req.user to another route
        next()
    }catch(err){
        console.log("Error in auth middleWare ",err)
        res.status(404).json({
            message:"Error in middleware"
        })
    }
}