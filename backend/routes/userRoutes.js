import express from "express";
const router = express.Router();
import { register ,login, logout,verify} from "../controllers/userController.js";
import authenticate from "../middlewares/authentication.js";


router.route("/register")
        .post(register);
router.route("/login")
        .post(login);
router.route("/logout")
        .post(logout)
router.route("/verify")
        .get(authenticate,verify)

export default router;