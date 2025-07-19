import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import StudentDashboard from './pages/StudentDashboard/StudentNavbar/StudentNavbar.jsx'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/TeacherDashboard/Home/Home';
import SetExam from './pages/TeacherDashboard/SetExam/SetExam.jsx';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import TeacherLayout from './pages/TeacherDashboard/TeacherLayout';
import StudentHome from './pages/StudentDashboard/StudentHome/StudentHome.jsx';
import StudentLayout from './pages/StudentDashboard/StudentLayout.jsx';
import ExamPage from './pages/StudentDashboard/ExamPage/ExamPage.jsx';
import { ExamProvider } from './context/ExamContext.jsx';
import ExamRouteGuard from './components/ExamRouteGaurd.jsx';
import ThankYouPage from './pages/StudentDashboard/ThankYouPage.jsx';
import TeacherReports from './pages/TeacherDashboard/TeacherReports/TeacherReports.jsx';
import ViewQuestionPaper from './pages/TeacherDashboard/TeacherReports/ViewQuestionPaper.jsx';
import ExamAnalysis from './pages/TeacherDashboard/TeacherReports/ExamAnalysis.jsx';
import MyAccountModal from './pages/TeacherDashboard/MyAccountPage/MyAccountPage.jsx';
import StudentReports from './pages/StudentDashboard/StudentReports/StudentReports.jsx';
import StudentQuestionPaper from './pages/StudentDashboard/StudentReports/StudentQuestionPaper/StudentQuestionPaper.jsx';



function App() {

  return (
    
    <ExamProvider>
     <AuthProvider>
      <Routes>
       
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

       
        <Route
          path="/student-dashboard/*"
          element={
           
              <ProtectedRoute allowedRoles={["student"]}>
                 <ExamRouteGuard>
                    <StudentLayout />
                 </ExamRouteGuard>
              </ProtectedRoute>

              
            
          }
          
        > 
          <Route path="" element={<StudentHome/>} />
          <Route path="reports" element={<StudentReports />} />
          <Route path="reports/responses/:examId" element={<StudentQuestionPaper />} />
        </Route>


        <Route
          path="/teacher-dashboard/*"
          element={
           
              <ProtectedRoute allowedRoles={["professor"]}>
                <TeacherLayout />
              </ProtectedRoute>  

          }
          
        >
          <Route path="" element={<Home />} />
          <Route path="set-exam" element={<SetExam />} />
          <Route path="reports" element={<TeacherReports />} />
          <Route path="reports/questionPaper/:examId" element={<ViewQuestionPaper />} />
          <Route path="reports/analysis/:examId" element={<ExamAnalysis />} />
          <Route path="account" element={<MyAccountModal />} />
          
        </Route>

          <Route
              path="/student/ExamPage/:examId"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ExamPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/thankyou"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <ThankYouPage/>
                </ProtectedRoute>
              }
            />


             </Routes>
      </AuthProvider>
    </ExamProvider>
    
  );
}

export default App;
