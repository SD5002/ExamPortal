import express from "express";
const router = express.Router();
import { getReports, joinExam ,startExam,submitExam,getResponses} from "../controllers/StudentController.js";
import authenticate from "../middlewares/authentication.js";

router.route("/joinExam")
        .post(authenticate,joinExam);
router.route("/startExam/:examId")
        .get(authenticate,startExam);
router.route("/submitExam/:examId")
        .post(authenticate,submitExam);
router.route("/getReports")
        .get(authenticate,getReports);
router.route("/getResponse/:examId")
        .get(authenticate,getResponses);

export default router;

