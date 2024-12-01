import React, { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      alert("Регистрация прошла успешно!");
    } catch (error) {
      alert("Регистрация не удалась. Возможно пользователь уже существует.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h2>Регистрация</h2>
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
        }}
      >
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            marginBottom: "10px",
            padding: "10px",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          зарегистрироваться
        </button>
      </form>
    </div>
  );
}

export default Register;
