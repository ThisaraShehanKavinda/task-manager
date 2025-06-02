const request = require('supertest');
const app = require('../server');

describe('Task Endpoints', () => {
  let token;
  let uniqueEmail;

  beforeEach(async () => {
    uniqueEmail = `test${Date.now()}@example.com`;
    
    // Register and login
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: '123456'
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: '123456'
      });

    token = loginRes.body.token;
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Test Description'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Test Task');
  });
});