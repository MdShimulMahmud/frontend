import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../utils/axios";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

interface ScoreData {
  percentageScore: number;
  totalMarks: number;
  totalQuestions: number;
}

const QuizTaker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<ScoreData | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${id}`
      );
      setQuiz(response.data);
      setAnswers(new Array(response.data.questions.length).fill(-1));
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (answerIndex: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = answerIndex;
      return newAnswers;
    });
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const totalMarks = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const totalQuestions = quiz.questions.length;
    const percentageScore = (totalMarks / totalQuestions) * 100;

    const scoreData: ScoreData = {
      percentageScore,
      totalMarks,
      totalQuestions,
    };

    setScore(scoreData);

    try {
      const res = await instance.post(`/${id}/scores`, {
        ...scoreData,
      });
      console.log(res.data);
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  if (!quiz) return <div className="text-center mt-8">Loading...</div>;
  if (!quiz.questions.length)
    return (
      <div className="m-10">
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <div className="text-center mt-8">
          No questions found for this quiz.
        </div>
        <Link
          to={`/quizzes/${id}/questions`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Question
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>

      {score === null ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {quiz.questions[currentQuestion].text}
          </h2>
          <div className="space-y-4">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className="flex items-center space-x-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => handleAnswer(index)}
                  className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-2">
            Your score: {score.percentageScore.toFixed(2)}%
          </p>
          <p className="text-xl mb-4">
            Total marks: {score.totalMarks} out of {score.totalQuestions}
          </p>
          <div className="mt-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index];
              const correctAnswer = question.correctAnswer;
              return (
                <div key={question.id} className="mb-6 border p-4 rounded-md">
                  <h3 className="font-semibold">{question.text}</h3>
                  <div className="flex flex-col mt-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = userAnswer === optionIndex;
                      const isCorrect = correctAnswer === optionIndex;
                      return (
                        <p
                          key={optionIndex}
                          className={`p-2 rounded ${
                            isSelected
                              ? isCorrect
                                ? "bg-green-200 text-green-600"
                                : "bg-red-200 text-red-600"
                              : isCorrect
                              ? "bg-green-100 text-green-600"
                              : "text-gray-800"
                          }`}
                        >
                          {option}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Back to Quiz List
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizTaker;
