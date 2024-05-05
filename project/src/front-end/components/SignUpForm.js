// Dans src/components/SignUpForm.js
import React, { useState } from 'react';
import '../styles/SignUpForm.css';

function SignUpForm({ onSignUpSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        // Vérification si l'username existe déjà
        const checkUserResponse = await fetch(`http://localhost:3001/api/users/info/${username}`);
        if (checkUserResponse.ok) {
            setError('User already exists');
        } else if (checkUserResponse.status === 404) {
            // Création d'un nouvel utilisateur
            const response = await fetch('http://localhost:3001/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                onSignUpSuccess();
            } else {
                setError('Failed to create user. Please try again.');
            }
        } else {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign Up</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
}

export default SignUpForm;
