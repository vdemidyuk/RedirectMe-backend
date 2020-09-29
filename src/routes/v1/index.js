const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const linkRoute = require('./link.route');
const banHammerRoute = require('./banHammer.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/docs', docsRoute);
router.use('/link', linkRoute);
router.use('/banHammer', banHammerRoute);

module.exports = router;
