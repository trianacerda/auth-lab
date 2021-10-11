const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserServices = require('../lib/services/usersService');

describe('auth-lab routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const userT = {
    email: 'tri@ana.com',
    password: 'rainman',
    title: 'USER',
  };
  const userJ = {
    email: 'jon@athan.com',
    password: 'brotherRAM',
    title: 'USER',
  };

  it('should sign up a new user with a POST ', async () => {
    const res = await request(app).post('/api/v1/auth/sign-up').send(userT);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: userT.email,
      role: 'USER',
    });
  });

  it('should throw a 400 err if email exists', async () => {
    await UserServices.createUser(userJ);
    const res = await request(app).post('/api/v1/auth/sign-up').send(userJ);

    expect(res.status).toBe(400);
  });

  it('logs in a user via POST', async () => {
    await UserServices.createUser(userJ);

    const res = await request(app).post('/api/v1/auth/login').send(userJ);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: userJ,
      role: 'USER',
    });
  });

  it('should throw a 401 err if wrong info/invalid JWT', async () => {
    await UserServices.createUser(userJ);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'jon@athan.com', password: 'sistaRAM' });

    expect(res.status).toBe(401);
  });

  it('should get /me as the current logged in user', async () => {
    await UserServices.createUser(userT);
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send(userT);

    const res = await agent.get('/api/v1/auth/me');
    expect(res.body).toEqual({
      id: expect.any(String),
      email: userT.email,
      role: 'USER',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('should get /me as the current logged in user', async () => {
    await UserServices.createUser(userT);
    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send(userT);

    const res = await agent.get('/api/v1/auth/me');
    expect(res.body).toEqual({
      id: expect.any(String),
      email: userT.email,
      role: 'USER',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('should be a route that is only for ADMIN access', async () => {
    await UserServices.create(userT);
    const adminUser = await UserServices.create({
      email: 'boss@admin.com',
      password: 'bossy',
      role: 'ADMIN',
    });

    const agent = request.agent(app);
    await agent.post('/api/v1/auth/login').send(adminUser);

    await agent
      .patch('/api/v1/auth/dashboard')
      .send({ ...userT, role: 'ADMIN' });
    const res = await agent.admin('/api/v1/auth/');

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      status: 200,
      message: 'Role successfully changed!',
    });
  });

  afterAll(() => {
    pool.end();
  });
});
