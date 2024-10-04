import Router from "express"
import Controller from "./Controller.js"


export const router = new Router()

router.post("/register", Controller.registerUser)
router.post("/login", Controller.loginUser)
router.get("/messages/:room", Controller.getAllMessages )