import React, { useState } from "react";
import "./App.css";

const initialColumns = {
  todo: {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "task1", content: "Task 1" },
      { id: "task2", content: "Task 2" },
      { id: "task3", content: "Task 3" },
    ],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    cards: [
      { id: "task4", content: "Task 4" },
      { id: "task5", content: "Task 5" },
    ],
  },
  done: {
    id: "done",
    title: "Done",
    cards: [{ id: "task6", content: "Task 6" }],
  },
};

function App() {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedCard, setDraggedCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Define separate state variables for new card content in each column
  const [newCardContentTodo, setNewCardContentTodo] = useState("");
  const [newCardContentInProgress, setNewCardContentInProgress] = useState("");
  const [newCardContentDone, setNewCardContentDone] = useState("");

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (columnId) => {
    if (draggedCard) {
      const updatedColumns = { ...columns };
      const sourceColumnId = Object.keys(updatedColumns).find(
        (key) => updatedColumns[key].cards.includes(draggedCard)
      );

      if (sourceColumnId !== columnId) {
        // Move the card to a different column
        updatedColumns[sourceColumnId].cards = updatedColumns[
          sourceColumnId
        ].cards.filter((card) => card.id !== draggedCard.id);

        updatedColumns[columnId].cards.push(draggedCard);
        setColumns(updatedColumns);
      }

      setDraggedCard(null);
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setEditedContent(card.content);
  };

  const handleSaveCard = () => {
    if (editingCard) {
      const updatedColumns = { ...columns };
      const cardToUpdate = updatedColumns[editingCard.columnId].cards.find(
        (card) => card.id === editingCard.id
      );

      if (cardToUpdate) {
        cardToUpdate.content = editedContent;
        setColumns(updatedColumns);
        setEditingCard(null);
      }
    }
  };

  const handleAddNewCard = (columnId) => {
    let newCardContent = "";
    if (columnId === "todo") {
      newCardContent = newCardContentTodo;
      setNewCardContentTodo("");
    } else if (columnId === "inProgress") {
      newCardContent = newCardContentInProgress;
      setNewCardContentInProgress("");
    } else if (columnId === "done") {
      newCardContent = newCardContentDone;
      setNewCardContentDone("");
    }

    if (newCardContent) {
      const newCard = { id: `task${Date.now()}`, content: newCardContent };
      const updatedColumns = { ...columns };
      updatedColumns[columnId].cards.push(newCard);
      setColumns(updatedColumns);
    }
  };

  const handleDeleteCard = (card) => {
    const updatedColumns = { ...columns };
    const column = updatedColumns[card.columnId];
    column.cards = column.cards.filter((c) => c.id !== card.id);
    setColumns(updatedColumns);
  };

  return (
    <div style={{ display: "flex" }}>
      {Object.values(columns).map((column) => (
        <div
          key={column.id}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={() => handleDrop(column.id)}
          style={{
            background: "#ccc",
            padding: "16px",
            width: "300px",
            margin: "8px",
            border: "1px solid #999",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3>{column.title}</h3>
          {column.cards.map((card) => (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, card)}
              style={{
                userSelect: "none",
                padding: "12px",
                margin: "8px",
                backgroundColor: "#000",
                color: "#fff",
                border: "1px solid #333",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {editingCard && editingCard.id === card.id ? (
                <div>
                  <input
                    type="text"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button onClick={handleSaveCard}>Save</button>
                </div>
              ) : (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleEditCard({ id: card.id, columnId: column.id })}
                >
                  {card.content}
                </div>
              )}
             <button onClick={() => handleDeleteCard({ id: card.id, columnId: column.id })}>Delete</button>
            </div>
          ))}
          <div>
            <input
              type="text"
              placeholder="Add a new card"
              value={
                column.id === "todo"
                  ? newCardContentTodo
                  : column.id === "inProgress"
                  ? newCardContentInProgress
                  : newCardContentDone
              }
              onChange={(e) => {
                if (column.id === "todo") {
                  setNewCardContentTodo(e.target.value);
                } else if (column.id === "inProgress") {
                  setNewCardContentInProgress(e.target.value);
                } else if (column.id === "done") {
                  setNewCardContentDone(e.target.value);
                }
              }}
            />
            <button onClick={() => handleAddNewCard(column.id)}>Add</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
