// const httpStatus = require('http-status');
const { Link } = require('../models');
const { Redirect } = require('../models');
// const banHammerService = require('./banHammer.service');

const redirect = async (link, requestIp, userAgent) => {
  const linkEntry = await Link.findOne(link);

  await Redirect.create({
    link: linkEntry,
    ip: requestIp,
    userAgent,
  });

  linkEntry.redirectCount += 1;

  await linkEntry.save();
  return linkEntry;
};

module.exports = {
  redirect,
};
