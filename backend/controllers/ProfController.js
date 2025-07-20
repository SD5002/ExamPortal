import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import User from "../DB/models/userModel.js";
import Exam from "../DB/models/ExamModel.js";
import ExamResponses from "../DB/models/ExamResponses.js";


const DATE_FORMAT_OPTIONS = {
  timeZone: 'Asia/Kolkata',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};

export const uploadExam = wrapAsync(async (req, res, next) => {
  const { exam } = req.body;
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  if (user.role !== "professor") {
    return next(new ExpressError(403, "Only professors can upload exams"));
  }

  const exists = await Exam.findOne({ code: exam.code });
  if (exists) {
    return next(new ExpressError(400, "Exam code already exists"));
  }

  exam.professor = _id;

  const newExam = new Exam(exam);
  await newExam.save();

  user.exams.push(newExam._id);
  await user.save({ validateBeforeSave: false });

  const now = new Date();
  const istDateTime = new Intl.DateTimeFormat('en-IN', DATE_FORMAT_OPTIONS).format(now);

  user.history.push({ message: "Exam named " + exam.title + " with code : " + exam.code + " and password :" + exam.password + " was uploaded successfully at " + istDateTime + "."});

  await user.save({ validateBeforeSave: false });

  res.status(201).json({ message: "Exam uploaded successfully", examId: newExam._id });
});

export const getExams = wrapAsync(async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user) {
    return next(new ExpressError(404, "User not found"));
  }

  if (user.role !== "professor") {
    return next(new ExpressError(403, "Only professors can get exams"));
  }

  const exams = await Exam.find({ professor: _id });
  res.status(200).json({
    message: "Exams fetched successfully",
    exams: exams.map((exam) => ({
      title: exam.title,
      id: exam._id,
      code: exam.code,
      password: exam.password,
      description: exam.description,
      totalMarks: exam.totalMarks,
      createdAt: exam.createdAt,
      questions: exam.questions,
    })),
  });
});

export const getExam = wrapAsync(async (req, res, next) => {
  const { examId } = req.params;
  const exam = await Exam.findById(examId);

  if (!exam) return next(new ExpressError(404, "Invalid exam id"));
  res.status(200).json({ exam: exam });
});

export const getAnalysis = wrapAsync(async (req, res, next) => {
  const { examId } = req.params;

  const exam = await Exam.findById(examId);
  if (!exam) {
    return next(new ExpressError(404, "Exam not found"));
  }

  const responses = await ExamResponses.find({ exam: examId }).populate("student", "name email");

  const scores = responses.map((r) => r.score);
  const total = scores.length;

  let mean = 0;
  let median = 0;

  if (total > 0) {
    const sum = scores.reduce((a, b) => a + b, 0);
    mean = (sum / total).toFixed(2);

    const sortedScores = [...scores].sort((a, b) => a - b);
    median =
      total % 2 === 0
        ? ((sortedScores[total / 2 - 1] + sortedScores[total / 2]) / 2).toFixed(2)
        : sortedScores[Math.floor(total / 2)];
  }

  const sortedResponses = [...responses].sort((a, b) => b.score - a.score);
  const rankedResults = [];
  let currentRank = 1;
  let prevScore = null;

  for (let i = 0; i < sortedResponses.length; i++) {
    const r = sortedResponses[i];

    if (r.score !== prevScore) {
      currentRank = i + 1;
    }

    rankedResults.push({
      name: r.student.name,
      email: r.student.email,
      score: r.score,
      rank: currentRank
    });

    prevScore = r.score;
  }

  res.status(200).json({
    exam: {
      title: exam.title,
      code: exam.code,
      totalMarks: exam.totalMarks,
    },
    analysis: {
      mean,
      median,
      submissions: total,
      results: rankedResults,
    },
  });
});

export const getStats = wrapAsync(async (req, res, next) => {
      const userId = req.user;
      const user = await User.findById(userId);

      if (!user) return next(new ExpressError(404, "User not found"));
      if (user.role !== "professor") return next(new ExpressError(403, "Only professors can get stats"));

      if (!user.exams || user.exams.length === 0) {
        return res.status(200).json({
          totalExams: 0,
          totalSubmissions: 0,
          emailId: user.email,
          latestExam: null,
          recentActivities: user.history
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
        });
      }

      let totalExams = user.exams.length;
      let totalSubmissions = 0;
      const latestExam = await Exam.findOne({ professor: userId }).sort({ createdAt: -1 });//-1 for newest one

      const exams = user.exams;
      for (const examId of exams) {
        totalSubmissions += await ExamResponses.find({ exam: examId }).countDocuments();
      }


      

      const istTime = new Intl.DateTimeFormat('en-IN', DATE_FORMAT_OPTIONS).format(new Date(latestExam.createdAt));

      res.status(200).json({
        totalExams,
        totalSubmissions,
        latestExam: {
          title: latestExam.title,
          code: latestExam.code,
          password: latestExam.password,
          createdAt: istTime
        },
        recentActivities: user.history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                      .slice(0, 3),
        emailId: user.email
         
      });
    });