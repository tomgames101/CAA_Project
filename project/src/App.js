// src/App.js
import React, { useState } from 'react';
import LoginForm from './front-end/components/LoginForm';
import SignUpForm from './front-end/components/SignUpForm';
import TasksView from './front-end/components/TaskView';
import CollaboratorsView from './front-end/components/CollaboratorsView'; // Make sure this file exists
import "./front-end/styles/App.css";

function App() {
    const [user, setUser] = useState(null);
    const [showSignUp, setShowSignUp] = useState(false);
    const [view, setView] = useState('tasks'); //  manage the current view
    const [collaborators, setCollaborators] = useState([]);

    const handleLoginSuccess = (username, password) => {
        console.log("Login Success:", username);
        setUser({ username, password, tasks: [] });
    };

    const handleSignUpSuccess = (username, password) => {
        console.log("SignUp Success:", username);
        setUser({ username, password, tasks: [] });
        setShowSignUp(false);
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
                <div className="main-container">
                    <div className="sidebar">
                        <button onClick={() => setView('tasks')}>Tasks</button>
                        <button onClick={() => setView('collaborators')}>Collaborators</button>
                    </div>
                    <div className="content">
                        {view === 'tasks' ? (
                            <TasksView user={user} />
                        ) : (
                            <CollaboratorsView user={user} collaborators={collaborators} setCollaborators={setCollaborators} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
