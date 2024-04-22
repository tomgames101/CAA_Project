// src/components/TasksView.js
import React from 'react';
import "../styles/TaskView.css";

function TasksView({ user }) {
    return (
        <div>
            <h2>{user.username}'s Tasks</h2>
            <ul>
                {user.tasks.map((task, index) => (
                    <li key={index}>{task.title}</li> // Ajustez en fonction de votre structure de données
                ))}
            </ul>
        </div>
    );
}

export default TasksView;
