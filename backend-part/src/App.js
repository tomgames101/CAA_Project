// src/App.js
import React, { useState } from 'react';
import LoginForm from './front-end/components/LoginForm';
import SignUpForm from './front-end/components/SignUpForm';
import TasksView from './front-end/components/TaskView'; // Assurez-vous que ce composant existe
import "./front-end/styles/App.css"

function App() {
    const [user, setUser] = useState(null);

    const handleLoginSuccess = (username, password) => {
        console.log("Login Success:", username);
        setUser({ username, tasks: [] }); // Assurez-vous que tasks est un tableau
    };

    const [showSignUp, setShowSignUp] = useState(false);

    const handleSignUpSuccess = (username, password) => {
        console.log("SignUp Success:", username);
        setShowSignUp(false); // Retour à la page de connexion ou directement se connecter l'utilisateur
    };

    return (
        <div className="App">
            {!user ? (
                showSignUp ? (
                    <SignUpForm onSignUpSuccess={handleSignUpSuccess} />
                ) : (
                    <>
                        <LoginForm onLoginSuccess={handleLoginSuccess} />
                        <button onClick={() => setShowSignUp(true)}>Sign Up</button>
                    </>
                )
            ) : (
                <TasksView user={user} />
            )}
        </div>
    );
}

export default App;
