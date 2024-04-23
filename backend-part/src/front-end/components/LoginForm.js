// Dans src/components/LoginForm.js
import React, { useState } from 'react';
import '../styles/LoginForm.css';

function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:3001/api/users/info/${username}`);
        if (!response.ok) {
            setError('User does not exist. Please sign up.');
        } else {
            onLoginSuccess(username, password);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
            </form>
        </div>
    );
}

export default LoginForm;
