const express = require('express');
const validate = require('../../middlewares/validate');
const linkValidation = require('../../validations/link.validation');
const linkController = require('../../controllers/link.controller');

const router = express.Router();

router.post('/create', validate(linkValidation.createLink), linkController.createLink);
router.post('/process', validate(linkValidation.processLink), linkController.processLink);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Links
 *   description: Links management and retrieval
 */

/**
 * @swagger
 * path:
 *  /link/create:
 *    post:
 *      summary: Create a link
 *      description:
 *      tags: [Links]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - link
 *              properties:
 *                link:
 *                  type: string
 *                  maxLength: 2048
 *              example:
 *                link: http://google.com
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Link'
 *
 */

/**
 * @swagger
 * path:
 *  /link/process:
 *    post:
 *      summary: Get link info and process redirecting
 *      description:
 *      tags: [Links]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - link
 *              properties:
 *                link:
 *                  type: string
 *                  maxLength: 2048
 *              example:
 *                link: http://google.com
 *      responses:
 *        "201":
 *          description: Ok
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/Link'
 */
