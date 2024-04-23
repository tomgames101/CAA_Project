const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const USERS_DIR = path.join(__dirname, 'users');
if (!fs.existsSync(USERS_DIR)) {
    fs.mkdirSync(USERS_DIR);
}

const loadUserData = (username) => {
    const userFilePath = path.join(USERS_DIR, `${username}.json`);
    if (fs.existsSync(userFilePath)) {
        return JSON.parse(fs.readFileSync(userFilePath));
    }
    return null;
};

const saveUserData = (username, data) => {
    const userFilePath = path.join(USERS_DIR, `${username}.json`);
    fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2));
};

const authenticate = (req, res, next) => {
    const { username, password } = req.body;
    const user = loadUserData(username);

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;
    next();
};
const authenticateQuery= (req, res, next) => {
    const { username, password } = req.query;
    console.log(username, password);
    const user = loadUserData(username);
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
    req.user = user;
    next();
};


const { v4: uuidv4 } = require('uuid');

app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    const userFilePath = path.join(USERS_DIR, `${username}.json`);

    if (fs.existsSync(userFilePath)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: uuidv4(),
        username,
        password,
        tasks: [],
        collaborators: [],
        createdAt: new Date().toISOString()
    };

    saveUserData(username, newUser);

    res.status(201).json({ message: 'User created successfully', id: newUser.id });
});



app.post('/api/tasks', authenticate, (req, res) => {
    const { title, description, date, startTime, endTime } = req.body;
    const user = req.user;

    const newTask = {
        id: user.tasks.length + 1,
        title,
        description,
        date,
        startTime,
        endTime,
        createdAt: new Date().toISOString() 
    };
    user.tasks.push(newTask);

    saveUserData(user.username, user);

    res.status(201).json(newTask);
});


app.put('/api/tasks', authenticate, (req, res) => {
    const { taskId, title, description, date, startTime, endTime } = req.body;
    const user = req.user;
    const taskIndex = user.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    user.tasks[taskIndex] = { ...user.tasks[taskIndex], title, description, date, startTime, endTime };
    saveUserData(user.username, user);

    res.status(200).json({ message: 'Task updated successfully', task: user.tasks[taskIndex] });
});

app.delete('/api/tasks', authenticate, (req, res) => {
    const { taskId, username, password} = req.body;
    const user = req.user;
    const taskIndex = user.tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }

    user.tasks.splice(taskIndex, 1);
    saveUserData(user.username, user);

    res.status(200).json({ message: 'Task deleted successfully' });
});

app.get('/api/tasks', (req, res) => {
    const allTasks = [];
    fs.readdirSync(USERS_DIR).forEach(file => {
        const userData = loadUserData(file.split('.')[0]);
        if (userData && userData.tasks) {
            // Ajoutez le username à chaque tâche
            userData.tasks.forEach(task => {
                task.username = userData.username;
            });
            allTasks.push(...userData.tasks);
        }
    });

    res.status(200).json(allTasks);
});


app.put('/api/users/collaborators', authenticate, (req, res) => {
    const { collaboratorUsername, mode } = req.body;
    const user = req.user;

    if (!Array.isArray(user.collaborators)) {
        user.collaborators = [];
    }

    const collaboratorIndex = user.collaborators.findIndex(collab => collab.username === collaboratorUsername);

    if (collaboratorIndex !== -1) {
        user.collaborators[collaboratorIndex].mode = mode;
    } else {
        user.collaborators.push({ username: collaboratorUsername, mode });
    }

    saveUserData(user.username, user);

    res.status(200).json({ message: 'Collaborator updated successfully' });
});

app.delete('/api/users/collaborators/:username', authenticate, (req, res) => {
    const { username } = req.params;
    const user = req.user;

    const collaboratorIndex = user.collaborators.findIndex(collab => collab.username === username);

    if (collaboratorIndex !== -1) {
        user.collaborators.splice(collaboratorIndex, 1);
        saveUserData(user.username, user);
        res.status(200).json({ message: 'Collaborator deleted successfully' });
    } else {
        res.status(404).json({ message: 'Collaborator not found' });
    }
});
app.get('/api/users/info/:username', (req, res) => {
    const { username } = req.params;
    const user = loadUserData(username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const userInfo = {
        username: user.username,
        createdAt: user.createdAt
    };

    res.status(200).json(userInfo);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
