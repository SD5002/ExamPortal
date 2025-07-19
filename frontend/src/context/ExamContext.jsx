import { createContext, useContext, useRef } from "react";

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const examIdRef = useRef(null);
  const examStartedRef = useRef(false);
  const examSubmittedRef = useRef(false);

  return (
    <ExamContext.Provider value={{ examIdRef, examStartedRef, examSubmittedRef }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
