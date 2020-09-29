const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { getRequestIp } = require('../utils/utils');
const catchAsync = require('../utils/catchAsync');
const { linkService } = require('../services');
const { authService } = require('../services');
const { isValidCode, isValidAppUrl, isValidUrl } = require('../utils/link');

const createLink = catchAsync(async (req, res) => {
  const requestIp = getRequestIp(req);
  const userAgent = req.get('user-agent');

  const link = await linkService.createLink(req.body, requestIp);

  if (link) {
    const processedLink = await linkService.processLink(link, requestIp, userAgent, false);
    res.status(httpStatus.CREATED).send(processedLink);
  }
});

/**
 * Process a link, means user want to redirect to some link.
 * Non-existent in system link would be created and "processed".
 */
const processLink = catchAsync(async (req, res) => {
  const linkStr = req.body.link;
  const requestIp = getRequestIp(req);
  const userAgent = req.get('user-agent');
  const user = await authService.getUserFromPassport(req, res);
  let link;

  if (isValidCode(linkStr)) {
    link = await linkService.findByCode(linkStr);
  } else {
    link = await linkService.findByUrl(linkStr);
  }

  if (!link && !isValidAppUrl(linkStr) && !isValidUrl(linkStr)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong link.');
  }

  if (!link && (isValidAppUrl(linkStr) || isValidUrl(linkStr))) {
    link = await linkService.createLink({ link: linkStr, ...user }, requestIp);
  }

  if (link) {
    const processedLink = await linkService.processLink(link, requestIp, userAgent, true);
    res.status(httpStatus.OK).send(processedLink);
  }
});

module.exports = {
  createLink,
  processLink,
};
