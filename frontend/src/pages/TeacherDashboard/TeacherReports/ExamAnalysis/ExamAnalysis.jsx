import{ useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";
import { useParams } from "react-router-dom";
import "./ExamAnalysis.css";
import axiosInstance from "../../../../api/axiosInstance";

const ExamAnalysis = () => {
  const { examId } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [examInfo, setExamInfo] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/professor/getAnalysis/${examId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setAnalysis(res.data.analysis);
        setExamInfo(res.data.exam);
      })
      .catch(() => alert("Failed to load analysis."));
  }, [examId]);

  const convertToArrayAndSort = (freqMap) => {
        const dataArray = [];

       
        for (let score in freqMap) {
          
          dataArray.push({
            score: parseInt(score), 
            count: freqMap[score]
          });
        }

       
        dataArray.sort((a, b) => a.score - b.score);

        return dataArray;
      };


  const generateScoreFrequencies = () => {
    if (!analysis) return [];

    const scores = analysis.results.map((r) => r.score);
    const freqMap = {};

    scores.forEach((score) => {
      freqMap[score] = (freqMap[score] || 0) + 1;
    });

    return convertToArrayAndSort(freqMap);
  };

  if (!analysis || !examInfo) return <div>Loading...</div>;

  return (
    <div className="analysis-container">
      <h2 className="main-title">{examInfo.title} - Analysis</h2>

      <div className="exam-info">
        <p><strong>Code:</strong> {examInfo.code}</p>
        <p><strong>Total Marks:</strong> {examInfo.totalMarks}</p>
        <p><strong>Average:</strong> {analysis.mean}</p>
        <p><strong>Median:</strong> {analysis.median}</p>
        <p><strong>Total Submissions:</strong> {analysis.submissions}</p>
      </div>

      <h3 className="chart-title">Marks Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={generateScoreFrequencies()} width="10%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="score" label={{ value: "Marks", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#ee1e78ff" barSize={20}/>
        </BarChart>
      </ResponsiveContainer>

      <h3 className="table-title">Student Results</h3>
      <table className="results-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {analysis.results.map((r, i) => (
            <tr key={i}>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExamAnalysis;
