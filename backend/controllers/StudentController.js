import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import User from "../DB/models/userModel.js";
import Exam from "../DB/models/ExamModel.js";
import ExamResponses from "../DB/models/ExamResponses.js";
import { sendMarksEmail } from "../utils/mailer.js";

export const joinExam = wrapAsync(async (req, res, next) => {
  const { examCode, examPassword } = req.body;
  const { _id } = req.user;

  const user = await User.findById(_id);
  if (!user) return next(new ExpressError(404, "User not found"));
  if (user.role !== "student")
    return next(new ExpressError(403, "Only students can join exams"));

  const exam = await Exam.findOne({ code: examCode, password: examPassword })
  if (!exam) return next(new ExpressError(404, "Invalid exam code or password"))

  
  const alreadyJoined = await ExamResponses.findOne({
    exam: exam._id,
    student: user._id,
  });

  if (alreadyJoined)
    return next(new ExpressError(400, "User already taken this exam."))

  
  const response = new ExamResponses({
    exam: exam._id,
    student: user._id,
    answers: exam.questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: null,
    })),
  });

  await response.save();

  res.status(200).json({
    message: "User joined the exam successfully",
    exam: {
      examId: exam._id,
    },
  });
});



export const startExam = wrapAsync(async (req, res, next) => {
  const { examId } = req.params;
  const { _id } = req.user;

  const user = await User.findById(_id);
  if (!user) return next(new ExpressError(404, "User not found"));
  if (user.role !== "student")
    return next(new ExpressError(403, "Only students can start exams"));

  
  const hasResponse = await ExamResponses.findOne({
    exam: examId,
    student: _id,
  });

  if (!hasResponse)
    return next(new ExpressError(400, "User has not joined this exam."));

  const exam = await Exam.findById(examId);
  if (!exam) return next(new ExpressError(404, "Invalid exam id"));

  res.status(200).json({
    message: "Exam started successfully",
    exam: {
      title: exam.title,
      examId: exam._id,
      description: exam.description,
      totalMarks: exam.totalMarks,
      questions: exam.questions,
    }
  });
});

export const submitExam = wrapAsync(async (req, res, next) => {
    const { examId } = req.params;
    const { _id } = req.user;

    const exam=await Exam.findById(examId);

    if(!exam) return next(new ExpressError(404, "Invalid exam id"));

    const user = await User.findById(_id);
    if (!user) return next(new ExpressError(404, "User not found"));

    if (user.role !== "student")
      return next(new ExpressError(403, "Only students can submit exams"));

    const hasResponse = await ExamResponses.findOne({
      exam: examId,
      student: _id,
    });

    if (!hasResponse)
      return next(new ExpressError(400, "User has not joined this exam."));

     const {responses}=req.body;
     console.log(Object.keys(responses).length,);
     
     if(Object.keys(responses).length!=exam.questions.length) return next(new ExpressError(400, "Invalid number of responses, Try to contact your professor."));

     const studentResponses=await ExamResponses.findOne({exam:examId,student:_id});

     studentResponses.responses=responses;

     await studentResponses.save();

     //Marks Calculations

    let marks=0;
    for (const [key, value] of Object.entries(responses)) {
   
      const question = exam.questions[key];
     
        if (value === question.correctAnswer) {
          marks += question.marks;
        } else if (value === "unattempted") {
          marks += question.unattemptedMarks;
        } else {
          marks += question.negativeMarks;
        }
      }
    
    console.log("Marks:",marks);

    const examWithProf = await Exam.findById(examId).populate("professor", "name");
    const profName = examWithProf.professor.name;
  
    

    sendMarksEmail(exam.title,profName,user.email,user.name,marks,exam.totalMarks);

    studentResponses.score=marks;
    await studentResponses.save();


     res.status(200).json({
       message: "Exam submitted successfully",
       exam: {
         title: exam.title,
         examId: exam._id,
         description: exam.description,
         totalMarks:exam.totalMarks,
         score:marks
       }
     });



})


export const getReports=wrapAsync(async(req,res,next)=>{
  
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user) return next(new ExpressError(404, "User not found"));
    if (user.role !== "student")
      return next(new ExpressError(403, "Only student can get reports"));

    const responses = await ExamResponses.find({ student: _id }).sort({ attemptedAt: -1 });


  const data = [];

  for (const response of responses) {
    const exam = await Exam.findById(response.exam).populate("professor", "name");
 

    if (!exam) continue; 
  

      data.push({
        examId: exam._id,
        title: exam.title,
        professor: exam.professor?.name, 
        date: response.attemptedAt,
        score: response.score,
        totalMarks: exam.totalMarks,
      });
  }
    console.log(data);
    res.status(200).json({
      message:"Reports sentn successfully",
      data
    })
})

export const getResponses=wrapAsync(async(req,res,next)=>{

  const { examId } = req.params;
  const { _id } = req.user;

  const user = await User.findById(_id);
  if (!user) return next(new ExpressError(404, "User not found"));
  if (user.role !== "student")
    return next(new ExpressError(403, "Only student can get responses"));

  const responses=await ExamResponses.findOne({exam:examId,student:_id});
  const exam=await Exam.findById(examId);

  if(!responses) return next(new ExpressError(404, "Responses not found"));

  res.status(200).json({
      responses: {
        exam,
        answers: responses.answers
      }
    });


})
  
  



























































































































































































































































































































































































































































































































































































































































































































































































































