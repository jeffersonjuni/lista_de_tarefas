import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import './Tarefas.css';

export default function Tarefas({ tarefas, concluidas, handleEdit, handleDelete, handleToggleConcluida }) {
  return (
    <ul className="tarefas">
      {tarefas.map((tarefa, index) => (
        <li key={index} className={concluidas[index] ? "concluida" : ""}>
          <label>
            <input
              type="checkbox"
              checked={concluidas[index]}
              onChange={() => handleToggleConcluida(index)}
            />
            <span style={{ marginLeft: "8px" }}>{tarefa}</span>
          </label>
          <span>
            <FaEdit className="edit" onClick={(e) => handleEdit(e, index)} />
            <FaTrash className="delete" onClick={(e) => handleDelete(e, index)} />
          </span>
        </li>
      ))}
    </ul>
  );
}
