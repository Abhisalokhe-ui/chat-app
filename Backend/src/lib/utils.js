
import jwt from "jsonwebtoken"

import dotenv from "dotenv"
dotenv.config()
const jwt_secret=process.env.JWT_SECRET

export const generateToken=(userId,res)=>{

    const token=jwt.sign({
        userId
    },jwt_secret,{expiresIn:"7d"})

    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,  // MS
        httpOnly:true,   // prevents XSS attacks cross-site scripting attacks
        sameSite:"strict", // CSRF attacks cross-site request forgery attacks
        secure:process.env.NODE_ENV !== "development"
    })
    return token

}




