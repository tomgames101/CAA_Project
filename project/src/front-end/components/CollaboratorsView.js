import React, { useState } from 'react';

function CollaboratorsView({ user }) {
    const [newCollaborator, setNewCollaborator] = useState('');
    const [mode, setMode] = useState('reader'); // Default access level set to 'reader'
    const [collaborators, setCollaborators] = useState(user.collaborators || []);

    const addCollaborator = async (collaboratorUsername, mode) => {
        try {
            const response = await fetch('http://localhost:3001/api/users/collaborators', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username, // Authenticated user's username
                    password: user.password, // Authenticated user's password
                    collaboratorUsername: collaboratorUsername,   // New collaborator's username
                    mode: mode                    // Mode to be assigned to the collaborator
                })
            });
            if (response.ok) {
                const { message } = await response.json();
                alert(message);
                setCollaborators(prevCollaborators => [
                    ...prevCollaborators,
                    { username: collaboratorUsername, mode }
                ]);
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to add collaborator');
            }
        } catch (error) {
            console.error('Error adding collaborator:', error);
            alert(error.message || 'An error occurred while adding the collaborator.');
        }
    };

    const deleteCollaborator = async (collaboratorUsername) => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/collaborators/${collaboratorUsername}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username, // Authenticated user's username
                    password: user.password  // Authenticated user's password
                })
            });
            if (response.ok) {
                const { message } = await response.json();
                alert(message);
                setCollaborators(prevCollaborators =>
                    prevCollaborators.filter(collab => collab.username !== collaboratorUsername)
                );
            } else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to delete collaborator');
            }
        } catch (error) {
            console.error('Error deleting collaborator:', error);
            alert(error.message || 'An error occurred while deleting the collaborator.');
        }
    };

    const handleAddCollaborator = () => {
        if (newCollaborator && mode) {
            addCollaborator(newCollaborator, mode);
            setNewCollaborator('');  // Clear input after attempting to add
        }
    };

    return (
        <div>
            <h2>Collaborators</h2>
            <input
                type="text"
                value={newCollaborator}
                onChange={(e) => setNewCollaborator(e.target.value)}
                placeholder="Add new collaborator"
            />
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="reader">Reader</option>
                <option value="collaborator">Collaborator</option>
            </select>
            <button onClick={handleAddCollaborator}>Add/Update Collaborator</button>
            <table style={{ marginTop: '20px', width: '100%', textAlign: 'left' }}>
                <thead>
                <tr>
                    <th>Collaborator</th>
                    <th>Mode</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {collaborators.map((collab, index) => (
                    <tr key={index}>
                        <td>{collab.username}</td>
                        <td>{collab.mode}</td>
                        <td>
                            <button onClick={() => deleteCollaborator(collab.username)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

}

export default CollaboratorsView;
