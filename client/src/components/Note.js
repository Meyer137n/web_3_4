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
        console.error("Error fetching note:", error);
        alert("Failed to load note.");
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
      alert("Note saved successfully.");
      setNote(response.data.text);
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note.");
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
