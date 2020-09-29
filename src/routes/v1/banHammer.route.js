const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const banHammerValidation = require('../../validations/banHammer.validation');
const banHammerController = require('../../controllers/banHammer.controller');

const router = express.Router();

router
  .route('/')
  .get(auth('manageBanHammer'), validate(banHammerValidation.getBanHammerList), banHammerController.getBanHammerList);

router
  .route('/create')
  .post(auth('manageBanHammer'), validate(banHammerValidation.createBanHammer), banHammerController.createBanHammer);

router
  .route('/:banHammerId')
  .delete(auth('manageBanHammer'), validate(banHammerValidation.deleteBanHammer), banHammerController.deleteBanHammer);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Ban Hammer service
 *   description: Ban it!
 */

/**
 * @swagger
 * path:
 *  /banHammer/{id}:
 *    delete:
 *      summary: Delete a ban
 *      description:
 *      tags: [banHammer]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *          description: ban id
 */

/**
 * @swagger
 * path:
 *  /banHammer:
 *    get:
 *      summary: Get list
 *      description:
 *      tags: [banHammer]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *            minimum: 1
 *          default: 10
 *          description: Maximum number of users
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *            minimum: 1
 *            default: 1
 *          description: Page number
 *
 */

/**
 * @swagger
 * path:
 *  /banHammer/create:
 *    post:
 *      summary: Create a Ban
 *      description:
 *      tags: [banHammer]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - str
 *              properties:
 *                str:
 *                  type: string
 *                  maxLength: 2048
 *              example:
 *                str: http://google.com
 *      responses:
 *        "201":
 *          description: Created
 *        "400":
 *          description: Ban already exists
 *        "401":
 *          description: Unauthorized
 *
 */
