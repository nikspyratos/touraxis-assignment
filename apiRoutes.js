const express = require('express');
const router = express.Router();
const { User, Task} = require('./models');
const { generateToken, authMiddleware } = require('./auth');

router.get('/', async (req, res) => {
    res.send('Hello World!')
});

/**
* POST /api/login
* @summary Login and get JWT token
* @tags Authentication
* @param {object} request.body.required - Login credentials
* @param {string} request.body.username.required - Username
* @return {object} 200 - Login response
* @return {object} 400 - Bad request
*/
router.post('/api/login', async (req, res) => {
    const { username } = req.body;
    if (username) {
        const token = generateToken({ username });
        res.json({ token });
    } else {
        res.status(400).json({ error: 'Username is required' });
    }
});

/**
* POST /api/users
* @summary Create a new user
* @tags Users
* @security BearerAuth
* @param {object} request.body.required - User info
* @param {string} request.body.username.required - Username
* @param {string} request.body.first_name.required - First name
* @param {string} request.body.last_name.required - Last name
* @return {object} 201 - Created user
* @return {object} 400 - Bad request
*/
router.post('/api/users', authMiddleware, async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
* PUT /api/users/{id}
* @summary Update a user
* @tags Users
* @security BearerAuth
* @param {integer} id.path.required - User ID
* @param {object} request.body.required - Updated user info
* @param {string} request.body.first_name - First name
* @param {string} request.body.last_name - Last name
* @return {object} 200 - Updated user
* @return {object} 404 - User not found
*/
router.put('/api/users/:id', authMiddleware, async (req, res) => {
    try {
        const [updated] = await User.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedUser = await User.findByPk(req.params.id);
            res.json(updatedUser);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
* GET /api/users
* @summary Get all users
* @tags Users
* @security BearerAuth
* @return {array<object>} 200 - List of users
* @return {object} 500 - Server error
*/
router.get('/api/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
* GET /api/users/{id}
* @summary Get a user by ID
* @tags Users
* @security BearerAuth
* @param {integer} id.path.required - User ID
* @return {object} 200 - User found
* @return {object} 404 - User not found
*/
router.get('/api/users/:id', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
* POST /api/users/{user_id}/tasks
* @summary Create a new task for a user
* @tags Tasks
* @security BearerAuth
* @param {integer} user_id.path.required - User ID
* @param {object} request.body.required - Task info
* @param {string} request.body.name.required - Task name
* @param {string} request.body.status - Task status
* @param {string} request.body.description - Task description
* @param {string} request.body.date_time - Task date and time
* @param {string} request.body.next_execute_date_time - Task next date and time
* @return {object} 201 - Created task
* @return {object} 404 - User not found
*/
router.post('/api/users/:user_id/tasks', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const task = await Task.create({ ...req.body, user_id: user.id });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
* PUT /api/users/{user_id}/tasks/{task_id}
* @summary Update a task
* @tags Tasks
* @security BearerAuth
* @param {integer} user_id.path.required - User ID
* @param {integer} task_id.path.required - Task ID
* @param {object} request.body.required - Updated task info
* @param {string} request.body.status - Task status
* @param {string} request.body.name - Task name
* @param {string} request.body.description - Task description
* @param {string} request.body.date_time - Task date and time
* @return {object} 200 - Updated task
* @return {object} 404 - Task not found
*/
router.put('/api/users/:user_id/tasks/:task_id', authMiddleware, async (req, res) => {
    try {
        const [updated] = await Task.update(req.body, {
            where: { id: req.params.task_id, user_id: req.params.user_id }
        });
        if (updated) {
            const updatedTask = await Task.findOne({
                where: { id: req.params.task_id, user_id: req.params.user_id }
            });
            res.json(updatedTask);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
* DELETE /api/users/{user_id}/tasks/{task_id}
* @summary Delete a task
* @tags Tasks
* @security BearerAuth
* @param {integer} user_id.path.required - User ID
* @param {integer} task_id.path.required - Task ID
* @return {object} 204 - Task deleted
* @return {object} 404 - Task not found
*/
router.delete('/api/users/:user_id/tasks/:task_id', authMiddleware, async (req, res) => {
    try {
        const deleted = await Task.destroy({
            where: { id: req.params.task_id, user_id: req.params.user_id }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
* GET /api/users/{user_id}/tasks/{task_id}
* @summary Get a task by ID
* @tags Tasks
* @security BearerAuth
* @param {integer} user_id.path.required - User ID
* @param {integer} task_id.path.required - Task ID
* @return {object} 200 - Task found
* @return {object} 404 - Task not found
*/
router.get('/api/users/:user_id/tasks/:task_id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.task_id, user_id: req.params.user_id }
        });
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
* GET /api/users/{user_id}/tasks
* @summary Get all tasks for a user
* @tags Tasks
* @security BearerAuth
* @param {integer} user_id.path.required - User ID
* @return {array<object>} 200 - List of tasks
* @return {object} 404 - User not found
*/
router.get('/api/users/:user_id/tasks', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const tasks = await Task.findAll({
            where: { user_id: req.params.user_id }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;