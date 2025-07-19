import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./TeacherReports.css";

const TeacherReports = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3002/professor/getExams", { withCredentials: true })
      .then((res) => setExams(res.data.exams || []))
      .catch(() => setExams([]));
  }, []);

  return (  
    <div className="container">
      <h1 className="page-heading">&#128203; Exam Reports</h1>

      <div className="exam-list">
        {exams.length === 0 ? (
          <p className="no-exam-text">No exams found.</p>
        ) : (
          exams.map((exam, index) => (
            <div className="exam-box" key={exam.id}>
              <div className="top-row">
                <span className="exam-number">{index + 1}.</span>
                <div className="exam-detail">
                  <h2 className="exam-title">{exam.title}</h2>
                  <p className="exam-desc">{exam.description}</p>
                </div>
                <span className="exam-date">
                  {new Date(exam.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              </div>

              <div className="button-row">
                <button
                  className="btn normal-btn"
                  onClick={() => navigate(`/teacher-dashboard/reports/questionPaper/${exam.id}`)}
                >
                  View Question Paper
                </button>
                <button
                  className="btn blue-btn"
                  onClick={() => navigate(`/teacher-dashboard/reports/analysis/${exam.id}`)}
                >
                  See Analysis
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherReports;
