import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";

const ExamRouteGuard = ({ children }) => {
  const { examStartedRef, examIdRef, examSubmittedRef } = useExam();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const examStarted = examStartedRef.current;
    const examSubmitted = examSubmittedRef.current;
    const examId = examIdRef.current;

    const isExamPage = location.pathname === `/student/ExamPage/${examId}`;
    const isThankYouPage = location.pathname === `/student/thankyou`;

    if (examStarted && !examSubmitted && !isExamPage && !isThankYouPage) {
      navigate(`/student/ExamPage/${examId}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return children;
};

export default ExamRouteGuard;
