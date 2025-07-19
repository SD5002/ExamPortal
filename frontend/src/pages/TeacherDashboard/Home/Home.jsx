import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
function Home() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
      totalExams: 0,
      totalSubmissions: 0,
      recentActivities: [],
      latestExam: null,
      emailId: null

    });

useEffect(() => {
    axios
      .get("http://localhost:3002/professor/getStats", { withCredentials: true })
      .then((res) => {
        setStats({
          totalExams: res.data.totalExams,
          totalSubmissions: res.data.totalSubmissions,
          recentActivities: res.data.recentActivities || [],
          latestExam: res.data.latestExam,
          emailId: res.data.emailId
        });
        console.log("Stats loaded:", res.data);
      })
      .catch((err) => {
        console.error("Failed to load stats:", err);
      });
}, []);


  const handleCreateExam = () => {
    navigate("/teacher-dashboard/set-exam");
  };



  return (
    <div className="dashboard-wrapper">
      <div className="top-section">
        <div className="welcome-box">
          <div className="professor-header">
            <div className="professor-avatar">{"\uD83D\uDC68\u200D\uD83C\uDFEB"}</div>
            <div className="professor-details">
              <h2>Welcome, Professor {"\uD83D\uDC4B"}</h2>
              <p>Email ID : {stats.emailId}</p>
              <p>
                You have created <strong>{stats.totalExams} exams</strong> with{" "}
                <strong>{stats.totalSubmissions} submissions</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="create-exam-box">
          <h3>Create New Exam</h3>
          <button onClick={handleCreateExam}>Create Exam</button>
        </div>
      </div>

      <div className="activity-box">
        <h3>{"\uD83D\uDCC5"} Recent Activity</h3>
        <ul>
          {stats.recentActivities.length === 0 && <p>Nothing here yet</p>}
          {stats.recentActivities.map((activity, index) => (
            <li key={index}>{activity.message }</li>
          ))}
        </ul>
      </div>

      <div className="stats-section">
        <div className="stats-box">
          <h3>{"\uD83D\uDCCA"} Quick Stats</h3>
          <div className="stats-cards">
            <div className="stat-card">
              <h4>{stats.totalExams}</h4>
              <p>Total Exams Created</p>
            </div>
            <div className="stat-card">
              <h4>{stats.totalSubmissions}</h4>
              <p>Total Submissions</p>
            </div>
            <div className="stat-card">
              <p className="latest-exam-quick-stats">Title:{stats.latestExam?.title}</p>
              <p className="latest-exam-quick-stats">{stats.latestExam?.createdAt}</p>
              <p className="latest-exam-quick-stats">code:{stats.latestExam?.code}</p>
              <p>Latest Exam</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
