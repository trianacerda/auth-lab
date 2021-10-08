const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');
const UserServices = require('../lib/services/usersService');

describe('auth-lab routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const userT = { email: 'tri@ana.com', password: 'rainman' };
  const userJ = { email: 'jon@athan.com', password: 'brotherRAM' };

  it('should sign up a new user with a POST ', async () => {
    const res = await request(app).post('/api/v1/auth/sign-up').send(userT);

    expect(res.body).toEqual({
      id: expect.any(String),
      email: 'tri@ana.com',
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
      email: 'jon@athan.com',
    });
  });

  // it('should get /me as the current logged in user', async (req, res, next) => {
  //   await UserServices.createUser(userT);
  //   const agent = request.agent(app);
  //    await agent
  //     .get('/api/v1/auth/me')
  //     .then((res) => {
  //       expect(res.body).toEqual({
  //         id: expect.any(String),
  //         userID: user.id,
  //       });
  //     });
  // });

  afterAll(() => {
    pool.end();
  });
});
