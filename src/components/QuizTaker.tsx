import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // This should refer to the index of the correct option
}

interface Quiz {
  id: number;
  title: string;
  questions: Question[];
}

const QuizTaker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${id}`
      );
      setQuiz(response.data);
    };
    fetchQuiz();
  }, [id]);

  const handleAnswer = (answerIndex: number) => {
    // Store the user's answer
    setAnswers((prev) => [...prev, answerIndex]);

    // Move to the next question or calculate the score if it's the last question
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    // Ensure the quiz and answers are not null before calculation
    if (!quiz || answers.length !== quiz.questions.length) return;

    // Calculate total score based on correct answers
    const totalScore = answers.reduce((acc, answer, index) => {
      return acc + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    // Calculate score as a percentage
    const percentageScore = (totalScore / quiz.questions.length) * 100;
    setScore(percentageScore); // Set the score to state
  };

  if (!quiz) return <div className="text-center mt-8">Loading...</div>;
  if (!quiz.questions.length)
    return (
      <div className="text-center mt-8">No questions found for this quiz.</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      {score === null ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {quiz.questions[currentQuestion].text}
          </h2>
          <div className="space-y-2">
            {quiz.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="w-full text-left p-2 rounded bg-gray-100 hover:bg-gray-200 transition duration-300"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="mt-4 text-gray-600">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">Your score: {score.toFixed(2)}%</p>
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
                                ? "bg-green-200 text-green-600" // User selected the correct option
                                : "bg-red-200 text-red-600" // User selected an incorrect option
                              : isCorrect
                              ? "bg-green-100 text-green-600" // The correct option
                              : "text-gray-800" // Other options
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
