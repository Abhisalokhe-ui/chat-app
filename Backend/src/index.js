import cors from "cors"


import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { app, server } from "./lib/socket.js";


import path from "path"


import  {connectDB}  from "./lib/db.js";
import cookieParser from "cookie-parser";

import dotenv from "dotenv"

dotenv.config()
const Port=process.env.PORT

const __dirname=path.resolve()

app.use(express.json())
app.use(cookieParser())




app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend.dist")))
    app.get("*", (req,res)=>{
        res.sendFile.path(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}



server.listen(Port,()=>{
    console.log("App is listening on port " + Port)
    connectDB()
})