const pool = require('../lib/utils/pool.js');
const setup = require('../data/setup.js');
const request = require('supertest');
const app = require('../lib/app.js');

describe('auth-lab routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  const userT = { email: 'tri@ana.com', password: 'rainman' };

  it('should sign up a new user with a POST ', async () => {
    return await request(app)
      .post('/api/vi/auth/signup')
      .send(userT)
      .then((res) => {
        expect(res.body).toEqual({ ...userT, id: expect.any(String) });
      });
  });

  afterAll(() => {
    pool.end();
  });
});
