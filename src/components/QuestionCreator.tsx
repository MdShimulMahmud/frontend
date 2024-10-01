import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
}

const QuestionCreator: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [question, setQuestion] = useState<Question>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quizId}`
        );
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion({ ...question, text: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setQuestion({ ...question, correctAnswer: parseInt(e.target.value) });
  };

  const createQuestion = async () => {
    try {
      if (!question.text || question.options.some((option) => !option.trim())) {
        alert("Please fill in the question and all four options");
        return;
      }
      await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/questions`,
        question
      );
      navigate(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error creating question:", error);
    }
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Question to {quiz.title}</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <input
          type="text"
          value={question.text}
          onChange={handleQuestionTextChange}
          placeholder="Question Text"
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Options:</h2>
          {question.options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Correct Answer:
          </label>
          <select
            value={question.correctAnswer}
            onChange={handleCorrectAnswerChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border "
          >
            {question.options.map((option, index) => (
              <option key={index} value={index}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={createQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default QuestionCreator;
