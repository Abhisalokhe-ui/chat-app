import mongoose from "mongoose"


export const connectDB=async()=>{

    try{
        const conn=await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("Mongo db is connected "+ conn.connection.host)
    }catch(err){
        console.log("Mongo db connection error "+err)
    }
}


