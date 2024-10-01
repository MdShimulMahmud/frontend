import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuizCreator = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Create the quiz by sending data to the backend
  const createQuiz = async () => {
    // Frontend validation
    if (!title.trim() || !description.trim()) {
      return alert("Please provide a title and description.");
    }

    try {
      // Send data to the backend
      const response = await axios.post("http://localhost:5000/api/quizzes", {
        title,
        description,
      });

      const quizId = response.data.id;
      navigate(`/quizzes/${quizId}/questions`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("An error occurred while creating the quiz.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create a New Quiz</h1>

        <div className="space-y-4">
          {/* Quiz title input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Quiz Title"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Quiz description input */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quiz Description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />

          {/* Create quiz button */}
          <button
            onClick={createQuiz}
            className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition duration-300"
          >
            Create Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
