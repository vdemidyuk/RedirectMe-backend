const request = require('supertest');
const mongoose = require('mongoose');
// const faker = require('faker');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { userOne, admin, insertUsers } = require('../fixtures/user.fixture');
const { userOneAccessToken, adminAccessToken } = require('../fixtures/token.fixture');

setupTestDB();

describe('Ban hammer routes', () => {
  const newBanHammerWilcard = {
    str: 'wildcard*',
  };
  const newBanHammerIp = {
    str: '127.0.0.2',
  };
  const newBanHammerExact = {
    str: 'http://google.com',
  };

  const createWildcard = async () => {
    return request(app)
      .post('/v1/banHammer/create')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newBanHammerWilcard)
      .expect(httpStatus.CREATED);
  };

  const createExact = async () => {
    return request(app)
      .post('/v1/banHammer/create')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send(newBanHammerExact)
      .expect(httpStatus.CREATED);
  };

  describe('test ban functionality', () => {
    test('fuck', async () => {
      await insertUsers([admin]);

      await createExact();

      const res = await request(app)
        .post('/v1/link/create')
        .send({ link: newBanHammerExact.str })
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty('link', newBanHammerExact.str);
      expect(res.body.redirectCount).toBe(0);
      expect(res.body.isBanned).toBe(true);
      expect(res.body.happyRedirecting).toBe(false);
    });
  });

  describe('POST /v1/banHammer', () => {
    test('should return 403 error if logged in user is not admin', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/v1/banHammer/create')
        .set('Authorization', `Bearer ${userOneAccessToken}`)
        .send(newBanHammerWilcard)
        .expect(httpStatus.FORBIDDEN);
    });

    test('should return 201 and successfully create new wildcard ban entry', async () => {
      await insertUsers([admin]);

      const res = await createWildcard();

      expect(res.body).toHaveProperty('str', newBanHammerWilcard.str);
      expect(res.body).toEqual({
        id: expect.anything(),
        isIp: false,
        isExact: false,
        isWildcard: true,
        str: newBanHammerWilcard.str,
      });
    });

    test('should return 201 and successfully create new ip ban entry', async () => {
      await insertUsers([admin]);

      const res = await request(app)
        .post('/v1/banHammer/create')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBanHammerIp)
        .expect(httpStatus.CREATED);

      expect(res.body).toHaveProperty('str', newBanHammerIp.str);
      expect(res.body).toEqual({
        id: expect.anything(),
        isIp: true,
        isExact: false,
        isWildcard: false,
        str: newBanHammerIp.str,
      });
    });

    test('should return 201 and successfully create new exact ban entry', async () => {
      await insertUsers([admin]);

      const res = await createExact();

      expect(res.body).toHaveProperty('str', newBanHammerExact.str);
      expect(res.body).toEqual({
        id: expect.anything(),
        isIp: false,
        isExact: true,
        isWildcard: false,
        str: newBanHammerExact.str,
      });
    });

    test('should return 400 for ban entry that already exists', async () => {
      await insertUsers([admin]);

      const resCreate = await createExact();

      expect(resCreate.body).toHaveProperty('str', newBanHammerExact.str);

      await request(app)
        .post('/v1/banHammer/create')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newBanHammerExact)
        .expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /v1/banHammer', () => {
    test('should return 404 in attempt to delete ban entry that does not exist', async () => {
      await insertUsers([admin]);

      const uri = `/v1/banHammer/${mongoose.Types.ObjectId()}`;

      await request(app).delete(uri).set('Authorization', `Bearer ${adminAccessToken}`).send().expect(httpStatus.NOT_FOUND);
    });

    test('should return 204 for success ban delete', async () => {
      await insertUsers([admin]);

      const resCreate = await createExact();

      expect(resCreate.body).toHaveProperty('str', newBanHammerExact.str);
      expect(resCreate.body).toHaveProperty('id');

      await request(app)
        .delete(`/v1/banHammer/${resCreate.body.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.NO_CONTENT);
    });
  });

  describe('GET /v1/banHammer', () => {
    test('should return 200 for ban list', async () => {
      await insertUsers([admin]);

      const resCreateExact = await createExact();
      const resCreateWilcard = await createWildcard();

      expect(resCreateExact.body).toHaveProperty('id');
      expect(resCreateWilcard.body).toHaveProperty('id');

      const resList = await request(app)
        .get('/v1/banHammer')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(httpStatus.OK);

      // console.log('resList', resList.body)

      expect(resList.body.results.length).toBe(2);
    });
  });
});
