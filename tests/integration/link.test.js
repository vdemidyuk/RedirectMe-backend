const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');

setupTestDB();

describe('Link routes', () => {
  describe('POST /v1/link/create', () => {
    test('should return 201 and successfully create new link entry', async () => {
      const link = faker.internet.url();

      const res = await request(app).post('/v1/link/create').send({ link }).expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty('link', link);
      expect(res.body.redirectCount).toBe(0);
      expect(res.body.happyRedirecting).toBe(true);
      expect(res.body.isBanned).toBe(false);
    });

    test('should return 400 for invalid new link entry', async () => {
      await request(app).post('/v1/link/create').send({ link: 'blah blah' }).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 for empty new link entry', async () => {
      await request(app).post('/v1/link/create').send({ link: '' }).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/link/process', () => {
    test('should return 201 and successfully process link entry', async () => {
      const link = faker.internet.url();

      const res = await request(app).post('/v1/link/process').send({ link }).expect(httpStatus.OK);

      expect(res.body).toHaveProperty('link', link);
      expect(res.body.redirectCount).toBe(1);
      expect(res.body.happyRedirecting).toBe(true);
      expect(res.body.isBanned).toBe(false);
    });

    test('should return 400 for invalid link entry', async () => {
      await request(app).post('/v1/link/process').send({ link: 'blah blah' }).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 for empty link entry', async () => {
      await request(app).post('/v1/link/process').send({ link: '' }).expect(httpStatus.BAD_REQUEST);
    });
  });
});
