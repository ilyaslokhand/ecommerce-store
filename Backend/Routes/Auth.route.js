import { loginUser, logoutUser, registerUser,refreshToken } from "../Controller/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/register",registerUser);
router.post("/logout",logoutUser);
router.post("/login",loginUser);
router.post("/refresh-token", refreshToken)



export default router;