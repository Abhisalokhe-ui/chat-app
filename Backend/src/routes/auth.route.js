import express from "express"
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js"
import { validUser } from "../middlewares/auth.middleware.js"
const router=express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout",logout)


router.put("/updater-profile", validUser,updateProfile)

router.get("/checks", validUser,checkAuth)


export default router;