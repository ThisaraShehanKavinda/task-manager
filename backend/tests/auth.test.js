const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`, // Unique email
        password: '123456'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        password: '123456'
      });

    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: uniqueEmail,
        password: '123456'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});