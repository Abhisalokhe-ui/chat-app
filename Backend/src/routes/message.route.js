import express from "express"
const router=express.Router()
import { validUser } from "../middlewares/auth.middleware.js"
import { getUsersForSidebar,getMessages,sendMessage } from "../controllers/message.controller.js";


router.get("/users",validUser,getUsersForSidebar)
router.get("/:id",validUser,getMessages)
router.post("/send/:id",validUser,sendMessage)

export default router;