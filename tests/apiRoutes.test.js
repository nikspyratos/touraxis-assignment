const request = require('supertest');
const express = require('express');
const router = require('../apiRoutes');
const { User, Task } = require('../models');
const { generateToken } = require('../auth');

const app = express();
app.use(express.json());
app.use('/', router);

let authToken;
let userId;
let taskId;

beforeAll(async () => {
  const user = await User.create({
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User'
  });
  userId = user.id;
  authToken = generateToken({ username: user.username });
});

describe('Authentication', () => {
  test('POST /api/login - success', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'testuser' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('POST /api/login - failure', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Users', () => {
  test('POST /api/users - create user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        username: 'newuser',
        first_name: 'New',
        last_name: 'User'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('newuser');
  });

  test('GET /api/users - get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/users/:id - get user by id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  test('PUT /api/users/:id - update user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        first_name: 'Updated',
        last_name: 'Name'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('first_name', 'Updated');
    expect(res.body).toHaveProperty('last_name', 'Name');
  });
});

describe('Tasks', () => {
  test('POST /api/users/:user_id/tasks - create task', async () => {
    const res = await request(app)
      .post(`/api/users/${userId}/tasks`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Task',
        description: 'This is a test task',
        date_time: '2023-06-01T10:00:00Z'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Task');
    taskId = res.body.id;
  });

  test('GET /api/users/:user_id/tasks - get all tasks for user', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}/tasks`)
      .set('Authorization', `Bearer ${authToken}`);
      console.log(res.body)

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/users/:user_id/tasks/:task_id - get task by id', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', taskId);
  });

  test('PUT /api/users/:user_id/tasks/:task_id - update task', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Updated Task',
        description: 'This task has been updated',
        date_time: '2023-06-02T11:00:00Z'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Task');
  });

  test('DELETE /api/users/:user_id/tasks/:task_id - delete task', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(204);
  });
});

afterAll(async () => {
  // Clean up: delete the test user and associated tasks
  await Task.destroy({ where: { user_id: userId } });
  await User.destroy({ where: { id: userId } });
});