import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken  } from "../lib/utils.js"
import  cloudinary  from "../lib/cloudinary.js"



export const signup = async (req, res) => {
    const email=req.body.email
    const fullName=req.body.fullName
    const password=req.body.password
    console.log("sign in function=========")
    // const {email,fullName,password}=req.body


    try{
        //  we can use zod library for this password validation
        if(!email || !password || !fullName){
            return res.status(400).json({
                message:"All fields must be Provided !!!"
            })
        }
        if(password < 6){
            return res.status(400).json({
                message:"Password must have at least 6 characters"
            })
        }
        const user=await User.findOne({
            email:email
        })
        if(user){
           return res.json("user is already exist")
        }

        const hashedPassword=await bcrypt.hash(password,5)     // adding a salt in password 
        console.log("hashedPassword===="+hashedPassword)
        const newUser=new User({
            email:email,
            password:hashedPassword,
            fullName:fullName
        })

        console.log("newUSer======",newUser)
        if(newUser){
            const token=generateToken(newUser._id,res)
            await newUser.save()
            
            return res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
                message:"you are signed in",
                token
            })
        }

        else{
            return res.status(400).json({
                message:"Invalid user data"
            })
        }

     

     
    }
    catch(err){
        console.log("User sign up controller error => "+err)
        return res.status(500).json({message:"All fields must be Provided !!!"})
    }
 

    return res.json({
        
    })
    // res.send("signup route")
}



export const login=async(req,res)=>{

    const email=req.body.email
    const password=req.body.password
    // const fullName=req.body.fullName

    try{
        const user=await User.findOne({
            email
        })

        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" });
        }

    
        const hashedPassword=await bcrypt.compare(password,user.password)
        if (!hashedPassword) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }


        // if(!user || !hashedPassword){
        //     res.status(404).json({
        //         message:"Invalid Credentials"
        //     })
        // }
        

        const token = generateToken(user._id, res)
        res.json({
            id:user._id,
            fullName:user.fullName,
            profilePic:user.profilePic,
            message:"login successful",
            token
        })
    }
    catch(err){
        console.log("Error in login Controller =>",err)
        res.status(500).json({
            message:"Internal Server Error"
        })
    }

    
}


export const logout=(req,res)=>{

    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            message:"Logged Out Successfully"
        })
    }
    catch(err){
        console.log("Error in LogOut => ",err)
        res.status(500).json({
            message:"Failed to logout"
        })
    }
}



export const updateProfile=async(req,res)=>{


        try {
            const profilePic=req.body.profilePic
            const user=req.user._id
    
            if(!profilePic){
                    return res.status(400).json({
                        message:"profile picture is required"
                    })
            }
            console.log("Uploading image to Cloudinary..."); 
            const uploadResponse=await cloudinary.uploader.upload(profilePic)
            console.log("upload response ----", uploadResponse)
    
            const updatedUser= await User.findByIdAndUpdate(user,{profilePic:uploadResponse.secure_url},{new:true})
                                                                // By default, findByIdAndUpdate returns the document before it was updated.
                                                                // Adding { new: true } ensures that it returns the updated document instead.
            res.json(updatedUser)
        } catch (error) {
            console.log("update profile picture controller error =>",error)
            res.status(500).json({ message: "Internal Server Error" });
        }
       
        
    }
    




export const checkAuth= (req,res)=>{

    try {
        res.json(req.user)
    } catch (error) {
        console.log("error in check controller=> ",error)
        res.status(400).json({
            message:"Internal Server Error"
        })
    }
}