import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import QuizCreator from "./components/QuizCreator";
import QuizList from "./components/QuizList";
import QuizTaker from "./components/QuizTaker";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Quiz App</h1>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/:id" element={<QuizTaker />} />
          <Route path="/create-quiz" element={<QuizCreator />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
