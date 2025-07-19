import mongoose from "mongoose";
import { Schema } from "mongoose";
import { model } from "mongoose";


const responseSchema = new Schema({
  exam: { type: Schema.Types.ObjectId,
            ref: "Exam",
            required: true },

  student: { type: Schema.Types.ObjectId,
            
            ref: "User",
            required: true },

  answers: [
    {
      questionId: String,
      selectedAnswer: String
    }
  ],
  score:{
    type: Number
  },

  attemptedAt: { type: Date, default: Date.now }
});


const ExamResponses = mongoose.model("ExamResponses", responseSchema);
export default ExamResponses;
