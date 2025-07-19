import express from "express";
const router = express.Router();
import { uploadExam , getExams,getExam,getAnalysis,getStats} from "../controllers/ProfController.js";
import authenticate from "../middlewares/authentication.js";


router.route("/uploadExam")
        .post(authenticate,uploadExam);
router.route("/getExams")
        .get(authenticate,getExams)
router.route("/getExam/:examId")
        .get(authenticate,getExam)
router.route("/getAnalysis/:examId")
        .get(authenticate,getAnalysis);
router.route("/getStats")
        .get(authenticate,getStats);

export default router;

