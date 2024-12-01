import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Note from "./components/Note";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {isLogin ? <Login /> : <Register />}
              <button
                onClick={toggleForm}
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                {isLogin ? "Регистрация" : "Авторизация"}
              </button>
            </div>
          }
        />
        <Route path="/note" element={<Note />} />
      </Routes>
    </Router>
  );
}

export default App;
