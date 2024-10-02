import React, { useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./components/Login";
import QuestionCreator from "./components/QuestionCreator";
import QuizCreator from "./components/QuizCreator";
import QuizList from "./components/QuizList";
import QuizTaker from "./components/QuizTaker";
import Signup from "./components/Signup";
import { useAuth } from "./hooks/useAuth";
import authService from "./services/authService";

const App: React.FC = () => {
  const user = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(user !== null ? true : false);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Quiz App</h1>

            <div>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quizzes/:id" element={<QuizTaker />} />
          <Route path="/create-quiz" element={<QuizCreator />} />
          <Route
            path="/quizzes/:quizId/questions"
            element={<QuestionCreator />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
