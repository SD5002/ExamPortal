import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ExamPage.css";
import { useExam } from "../../../context/ExamContext.jsx";
import axiosInstance from "../../../api/axiosInstance.js";

const ExamPage = () => {
  const { examId } = useParams();
  const [started, setStarted] = useState(false);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState("");
  const [responses, setResponses] = useState({});
  const [currentQ, setCurrentQ] = useState(0);

  const navigate = useNavigate();
  const { examStartedRef, examIdRef, examSubmittedRef } = useExam();

  useEffect(() => {
    examStartedRef.current = true;
    examIdRef.current = examId;
  }, []);

  useEffect(() => {
    if (examId) {
      examIdRef.current = examId;
    }
  }, [examId]);

  useEffect(() => {
    axiosInstance
      .get(`/student/startExam/${examId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const info = res.data.exam;
        setExam({
          title: info.title || "Exam Title",
          description: info.description || "No description",
          examId,
          questions: [],
        });
      })
      .catch((err) => {
        console.log(err);
        alert("Server Error");
      });
  }, [examId]);

  const handleStart = () => {
    axiosInstance
      .get(`/student/startExam/${examId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const questions = res.data.exam.questions;
        const initialResponses = {};
        questions.forEach((q) => {
          initialResponses[q._id] = "unattempted";
        });

        setResponses(initialResponses);
        setExam((prev) => ({
          ...prev,
          questions,
        }));
        setStarted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (value) => {
    const qId = exam.questions[currentQ]._id;
    setResponses((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedResponses = exam.questions.map((q) => ({
      questionId: q._id,
      selectedAnswer: responses[q._id] || "unattempted",
    }));

    

    axios
      .post(
        `http://localhost:3002/student/submitExam/${examId}`,
        { responses: formattedResponses },
        { withCredentials: true }
      )
      .then(() => {
        navigate("/student/thankyou");
        alert("Exam submitted!");
        examSubmittedRef.current = true;
      })
      .catch((err) => {
        console.log(err);
        alert("Error submitting exam.");
      });
  };

  const nextQuestion = () => {
    if (currentQ < exam.questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const prevQuestion = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const progressPercent = exam?.questions?.length
    ? ((currentQ + 1) / exam.questions.length) * 100
    : 0;

  if (error) {
    return <div className="error-box">ERROR: {error}</div>;
  }

  return (
    <div className="exam-wrapper">
      <div className="top-bar">
        <div className="exam-info">
          <h2>{exam?.title}</h2>
        </div>
        <div className="progress-container">
          <span>{Math.round(progressPercent)}%</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="mark-buttons">
          <button className="mark-btn" type="button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {!started ? (
        <div className="start-section">
          <h1>{exam?.title}</h1>
          <p>{exam?.description}</p>
          <button className="start-btn" onClick={handleStart}>
            Start Exam
          </button>
        </div>
      ) : (
        <form className="question-form">
          <div className="question-box">
            <h3>Question {currentQ + 1}</h3>

            <div className="marks-info">
              <span>
                Marks: <b>{exam.questions[currentQ].marks ?? "-"}</b>
              </span>
              <span> | </span>
              <span>
                Unattempted: <b>{exam.questions[currentQ].unattemptedMarks ?? "-"}</b>
              </span>
              <span> | </span>
              <span>
                Negative: <b>{exam.questions[currentQ].negativeMarks ?? "-"}</b>
              </span>
            </div>

            <p className="question-text">{exam.questions[currentQ].question}</p>
            <hr />

            {exam.questions[currentQ].type === "MCQ" ? (
              <>
                <div className="options">
                  {exam.questions[currentQ].options.map((opt, i) => {
                    const qId = exam.questions[currentQ]._id;
                    return (
                      <label
                        key={i}
                        className={`option-label ${
                          responses[qId] === opt ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qId}`}
                          value={opt}
                          checked={responses[qId] === opt}
                          onChange={() => handleChange(opt)}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => handleChange("unattempted")}
                >
                  Clear Answer
                </button>
              </>
            ) : (
              <input
                type="number"
                className="nat-input"
                placeholder="Enter your answer"
                value={
                  responses[exam.questions[currentQ]._id] === "unattempted"
                    ? ""
                    : responses[exam.questions[currentQ]._id]
                }
                onChange={(e) =>
                  handleChange(e.target.value || "unattempted")
                }
              />
            )}
          </div>

          <div className="navigation-buttons">
            <button
              type="button"
              className="nav-btn"
              onClick={prevQuestion}
              disabled={currentQ === 0}
            >
              ← Previous
            </button>
            {currentQ === exam.questions.length - 1 ? (
              <button type="button" className="submit-btn" onClick={handleSubmit}>
                Finish
              </button>
            ) : (
              <button type="button" className="nav-btn" onClick={nextQuestion}>
                Next →
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default ExamPage;
