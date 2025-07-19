import dotenv from "dotenv";
dotenv.config(); 
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS; 
console.log("Sending email...",EMAIL_USER,EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:EMAIL_USER,
    pass:EMAIL_PASS
  }
});

export const sendMarksEmail = async (examName, professorName, studentEmail, studentName, score, totalMarks) => {
  console.log("Sending email...",EMAIL_USER,EMAIL_PASS);
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmail,
      subject: "Your Exam Results",
      html: `
        <h2>Hello ${studentName},</h2>
        <p>Your exam results of <strong>${examName}</strong> conducted by <strong>Professor ${professorName}</strong> are as follows:</p>
        <p><strong>Score:</strong> ${score}/${totalMarks}</p>
        <p>Thank you.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};



