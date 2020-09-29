// const httpStatus = require('http-status');
const { Link } = require('../models');
const banHammerService = require('./banHammer.service');
const redirectService = require('./redirect.service');
const { generateShortCode } = require('../utils/link');

const findByCode = async (code) => {
  return Link.findOne({ shortCode: code });
};

const findByUrl = async (url) => {
  return Link.findOne({ link: url });
};

const isBanned = async (link, requestIp) => {
  return banHammerService.isBanned(link.link, requestIp);
};

const createLink = async (linkBody, requestIp) => {
  let code = generateShortCode();
  let gotIt = false;

  while (!gotIt) {
    if (!(await findByCode(code))) {
      gotIt = true;
    } else {
      code = generateShortCode();
    }
  }

  const linkItem = { ...linkBody };
  linkItem.shortCode = code;
  linkItem.ip = requestIp;

  const link = await Link.create(linkItem);

  return link;
};

const processLink = async (link, requestIp, userAgent, doRedirectCount = false) => {
  const isLinkBanned = await isBanned(link, requestIp);

  let processedLink;

  if (!isLinkBanned && doRedirectCount) {
    processedLink = await (await redirectService.redirect(link, requestIp, userAgent)).toObject();
  } else {
    processedLink = link.toObject();
  }

  processedLink.isBanned = isLinkBanned;
  processedLink.happyRedirecting = !processedLink.isBanned;

  return processedLink;
};

module.exports = {
  createLink,
  processLink,
  findByCode,
  findByUrl,
  isBanned,
};
