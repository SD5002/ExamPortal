import express from "express";
const router = express.Router();
import { joinExam ,startExam,submitExam} from "../controllers/StudentController.js";
import authenticate from "../middlewares/authentication.js";

router.route("/joinExam")
        .post(authenticate,joinExam);
router.route("/startExam/:examId")
        .get(authenticate,startExam);
router.route("/submitExam/:examId")
        .post(authenticate,submitExam);
export default router;

