import React, { useState } from 'react';

function EditTask({ task, onUpdateTask, onClose, user }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [date, setDate] = useState(task.date);
    const [startTime, setStartTime] = useState(task.startTime);
    const [endTime, setEndTime] = useState(task.endTime);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedTask = {
            taskId: task.id,
            username: user.username,
            password: user.password,
            title,
            description,
            date,
            startTime,
            endTime
        };

        try {
            const response = await fetch(`http://localhost:3001/api/tasks`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask)
            });

            if (response.ok) {
                const updatedTaskData = await response.json();
                onUpdateTask(updatedTaskData.task);  // S'assurer que la réponse inclut les données de la tâche mise à jour
                onClose();
                alert('Task Updated Successfully!');
            } else {
                console.error('Failed to update the task');
            }
        } catch (error) {
            console.error('Error updating the task:', error);
        }
    };

    return (
        <div>
            <h3>Edit Task</h3>
            <form onSubmit={handleSubmit}>
                <label>Title:</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required />
                <label>Date:</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <label>Start Time:</label>
                <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                <label>End Time:</label>
                <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                <button type="submit">Update Task</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default EditTask;
