const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('auth-lab routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  jest.setTimeout(10000);

  const userT = { email: 'tri@ana.com', password: 'rainman' };

  it('should sign up a new user with a POST ', async () => {
    const res = await request(app).post('/api/v1/auth/sign-up').send(userT);

    expect(res.body).toEqual({ id: expect.any(String), email: 'tri@ana.com' });
  });

  afterAll(() => {
    pool.end();
  });
});
