import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../../../components/Calender";
import 'react-calendar/dist/Calendar.css';
import "./StudentHome.css";
import axios from "axios";


function StudentHome() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [code, setCode] = useState("");
  const [password, setPassword] = useState(""); 

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3002/student/joinExam', {
     examCode: code,
     examPassword: password
    }, { withCredentials: true })
    .then((res) => {
       const examId = res.data.exam.examId;
      navigate(`/student/ExamPage/${examId}`);

    })
    .catch((err) => {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error); 
      } else {
        alert("An error occurred");
      }
    });

    
  };

  return (
    <div className="student-home">
      <div className="row">
        <div className="card-student profile">
          <div className="header">
            <div className="professor-avatar">{"\uD83D\uDC68\u200D\uD83C\uDFEB"}</div>
            <div className="details">
              <h2>Welcome, Student {"\uD83D\uDC4B"}</h2>
              <p>Email ID: sudeshGosaavi@gmal.com</p>
            </div>
          </div>
        </div>

       
        <div className="card-student time-card">
          <div className="time-box">
            <h4>Join Exam</h4>
           
            <p >{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="exam-join-box">
        
            <form onSubmit={handleSubmit} className="exam-join-form-student">
              <input type="text" placeholder="Enter Exam Code" value={code} onChange={(e) => setCode(e.target.value)} required />
              <input type="text" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="btn student-exam-join">Join</button>
            </form>
          </div>
        </div>
      </div>

    
      <div className="row down-row-student">
        <div className="left-column">
          <div className="card-student activities">
            <h4>📅 Recent Activities</h4>
            <ul>
              <li>You joined 2 exams last week</li>
              <li>New test available: Physics</li>
              <li>Scored 50 in Math</li>
            </ul>
          </div>

          <div className="stats-student">
            <div className="card-student student-marks">
              
              <table className="marks-table">
                <thead>
                  <tr>
                    <th>Past Tests</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Math</td>
                    <td>50</td>
                  </tr>
                  <tr>
                    <td>Physics</td>
                    <td>45</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card-student total-submissions-student">
              <h4> Total Submissions</h4>
              <p>2</p>
            </div>
          </div>
        </div>

        <div className="card-student calendar">
          <Calendar />
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
