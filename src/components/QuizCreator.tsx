import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Quiz {
  id: number;
  title: string;
}

interface Question {
  text: string;
  options: string[];
  correctAnswer: number | null;
}

const QuizCreator: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: null,
  });

  const [existingQuizzes, setExistingQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await axios.get("http://localhost:5000/api/quizzes");
      setExistingQuizzes(response.data);
    };
    fetchQuizzes();
  }, []);

  const fetchQuizDetails = async (quizId: number) => {
    const response = await axios.get(
      `http://localhost:5000/api/quizzes/${quizId}`
    );
    const quizData = response.data;
    setTitle(quizData.title);
    setDescription(quizData.description);
    // Only load existing questions if you want to display them
    // setQuestions(quizData.questions);
  };

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuizDetails(selectedQuiz);
    } else {
      setTitle("");
      setDescription("");
      setQuestions([]);
    }
  }, [selectedQuiz]);

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "text") {
      setCurrentQuestion({ ...currentQuestion, text: value });
    } else if (name.startsWith("option")) {
      const index = parseInt(name.split("-")[1]);
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    } else if (name === "correctAnswer") {
      setCurrentQuestion({
        ...currentQuestion,
        correctAnswer: parseInt(value),
      });
    }
  };

  const addQuestion = () => {
    if (currentQuestion.text.trim() && currentQuestion.correctAnswer !== null) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: null,
      });
    } else {
      alert(
        "Please fill in all question fields and select the correct answer."
      );
    }
  };

  const createOrUpdateQuiz = async () => {
    try {
      if (selectedQuiz) {
        // Update existing quiz with new questions only
        await axios.put(`http://localhost:5000/api/quizzes/${selectedQuiz}`, {
          questions,
        });
      } else {
        // Create new quiz
        await axios.post("http://localhost:5000/api/quizzes", {
          title,
          description,
          questions,
        });
      }
      navigate("/");
    } catch (error) {
      console.error("Error creating or updating quiz:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create or Add to a Quiz</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <select
          value={selectedQuiz ?? ""}
          onChange={(e) => setSelectedQuiz(Number(e.target.value) || null)}
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="">Create New Quiz</option>
          {existingQuizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.title}
            </option>
          ))}
        </select>

        {!selectedQuiz && (
          <>
            <input
              type="text"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quiz Title"
              className="w-full p-2 mb-4 border rounded"
            />
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quiz Description"
              className="w-full p-2 mb-4 border rounded"
            />
          </>
        )}

        <div className="mb-4">
          <input
            required
            type="text"
            name="text"
            value={currentQuestion.text}
            onChange={handleQuestionChange}
            placeholder="Enter question"
            className="w-full p-2 mb-2 border rounded"
          />
          {currentQuestion.options.map((option, index) => (
            <input
              required
              key={index}
              type="text"
              name={`option-${index}`}
              value={option}
              onChange={handleQuestionChange}
              placeholder={`Option ${index + 1}`}
              className="w-full p-2 mb-2 border rounded"
            />
          ))}
          <select
            required
            name="correctAnswer"
            value={currentQuestion.correctAnswer ?? ""}
            onChange={handleQuestionChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="" disabled>
              Select correct answer
            </option>
            {currentQuestion.options.map((option, index) => (
              <option key={index} value={index}>
                {option || `Option ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={addQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 mr-2"
        >
          Add Question
        </button>
        <button
          onClick={createOrUpdateQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          {selectedQuiz ? "Update Quiz" : "Create Quiz"}
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Added Questions:</h2>
        {questions.map((q, index) => (
          <div key={index} className="bg-gray-100 p-4 mb-4 rounded">
            <p className="font-semibold">{q.text}</p>
            <ul className="list-disc list-inside">
              {q.options.map((option, optionIndex) => (
                <li
                  key={optionIndex}
                  className={
                    optionIndex === q.correctAnswer ? "text-green-600" : ""
                  }
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizCreator;
