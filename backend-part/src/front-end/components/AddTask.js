import React, { useState } from 'react';
import "../styles/TaskView.css";

function AddTask({ user, onTaskAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);  // Le message disparaît après 3 secondes
    }

    const handleAddTask = async (e) => {
        e.preventDefault();

        const taskDetails = {
            username: user.username, // Assurez-vous que les credentials sont gérés correctement
            password: user.password, // Cela ne devrait pas être nécessaire si vous avez un système d'authentification sécurisé
            title,
            description,
            date,
            startTime,
            endTime
        };

        try {
            const response = await fetch('http://localhost:3001/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskDetails),
            });

            if (response.ok) {
                const newTask = await response.json();
                onTaskAdded(newTask);  // Mise à jour de l'état des tâches dans le composant parent
                setTitle('');
                setDescription('');
                setDate('');
                setStartTime('');
                setEndTime('');
                showMessage('Task added successfully');  // Affiche un message de succès
            } else {
                showMessage('Failed to add the task');  // Affiche un message d'erreur
            }
        } catch (error) {
            console.error('Error adding the task:', error);
            showMessage('Error adding the task');  // Affiche un message d'erreur
        }
    };

    return (
        <div>
            {message && <div className="message">{message}</div>}
            <h2>{user.username}'s Tasks</h2>
            <h3>Add New Task</h3>
            <form onSubmit={handleAddTask}>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
}

export default AddTask;
