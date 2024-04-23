import React, { useState, useEffect } from 'react';
import AddTask from './AddTask';
import EditTask from './EditTask';
import "../styles/TaskView.css";

function TaskView({ user }) {
    const [tasks, setTasks] = useState([]);
    const [showAddTask, setShowAddTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        async function fetchTasks() {
            const response = await fetch(`http://localhost:3001/api/tasks`);
            if (response.ok) {
                const allTasks = await response.json();
                setTasks(allTasks.filter(task => task.username === user.username));
            } else {
                console.error('Failed to fetch tasks');
            }
        }

        fetchTasks();
    }, [user.username]);

    const handleAddNewTask = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
        setShowAddTask(false);
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(currentTasks => currentTasks.map(task =>
            task.id === updatedTask.id ? {...task, ...updatedTask} : task));
        handleCloseEdit();  // Close the edit form after update
    };

    const handleCloseEdit = () => {
        setEditingTask(null);  // Reset editing task
    };

    const handleDeleteTask = async (taskId) => {
        const response = await fetch('http://localhost:3001/api/tasks', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ taskId, username: user.username, password: user.password })
        });

        if (response.ok) {
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
            alert('Task deleted successfully');
        } else {
            const errorMsg = await response.json();
            alert('Failed to delete the task: ' + errorMsg.message);
        }
    };

    return (
        <div className="task-container">
            <h2>{user.username}'s Tasks</h2>
            <button onClick={() => setShowAddTask(!showAddTask)}>Add Task</button>
            {showAddTask && <AddTask user={user} onTaskAdded={handleAddNewTask} />}
            <ul className="task-list">
                {tasks.map(task => (
                    <li key={task.id}>
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>Date: {task.date}</p>
                        <p>Time: {task.startTime} - {task.endTime}</p>
                        <button onClick={() => handleDeleteTask(task.id)}>Delete Task</button>
                        <button onClick={() => setEditingTask(task)}>Edit</button>
                    </li>
                ))}
            </ul>
            {editingTask && (
                <EditTask
                    task={editingTask}
                    onUpdateTask={handleUpdateTask}
                    onClose={handleCloseEdit}
                    user={user}
                />
            )}
        </div>
    );
}

export default TaskView;
