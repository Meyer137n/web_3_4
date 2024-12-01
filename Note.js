import React, { useState, useEffect } from "react";
import axios from "axios";

function Note() {
  const [note, setNote] = useState("");
  const token = localStorage.getItem("token"); // Сохраняйте токен после авторизации

  // Загрузка заметки
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get("http://localhost:5000/note", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNote(response.data.text || "");
      } catch (error) {
        console.error("Ошибка пролучения записи:", error);
        alert("Не удалось загрузить запись.");
      }
    };

    fetchNote();
  }, [token]);

  // Обновление заметки
  const handleSave = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/note",
        { text: note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Запись успешно сохранена.");
      setNote(response.data.text);
    } catch (error) {
      console.error("Ошибка сохранения записи:", error);
      alert("Не удалось сохранить запись.");
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
      <h2>Ваши заметки:</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        style={{
          width: "300px",
          height: "150px",
          marginBottom: "10px",
          padding: "10px",
          boxSizing: "border-box",
        }}
      />
      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Сохранить
      </button>
    </div>
  );
}

export default Note;
