const httpStatus = require('http-status');
const { isIp, isWildcard } = require('../utils/banHammer');
const { BanHammer } = require('../models');
const ApiError = require('../utils/ApiError');
// const { isValidAppUrl, isValidUrl } = require('../utils/link');

const getList = async (filter, options) => {
  const list = await BanHammer.paginate(filter, options);
  return list;
};

/**
 * Checks if link str is banned by wildcard like appName*
 * @param {*} str Wildcard string
 */
const _isWildcardBanned = async (str) => {
  const bannedList = await BanHammer.find({ isWildcard: true }).select('str');
  const bannedCheckList = [];

  bannedList.forEach((val) => {
    bannedCheckList.push(val.str.slice(0, -1));
  });

  bannedCheckList.forEach((val) => {
    if (str.indexOf(val) === 0) {
      //banned
      return true;
    }
  });
  // we are good
  return false;
};

const _isIpBanned = async (ip) => {
  const bannedIp = await BanHammer.find({ isIp: true, str: ip });
  if (bannedIp.length > 0) {
    return true;
  }
  return false;
};

const deleteBanHammer = async (banHammerId) => {
  const banHammer = await BanHammer.findById(banHammerId);
  if (!banHammer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ban not found');
  }
  await banHammer.remove();
  return banHammer;
};

const createBanHammer = async (banHammerBody) => {
  const bhBody = { ...banHammerBody };
  const { str } = bhBody;

  const findBan = await BanHammer.findOne({ str });

  if (findBan) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already banned.');
  }

  bhBody.isIp = isIp(str);
  bhBody.isWildcard = isWildcard(str);
  bhBody.isExact = !bhBody.isIp && !bhBody.isWildcard;

  const ban = await BanHammer.create(bhBody);

  return ban;
};

const isBanned = async (linkStr, remoteIp) => {
  const findExact = await BanHammer.findOne({ str: linkStr });
  const findIp = await _isIpBanned(remoteIp);
  const findWildcard = await _isWildcardBanned(linkStr);

  if (findIp || findExact || findWildcard) {
    return true;
  }

  return false;
};

module.exports = {
  isBanned,
  createBanHammer,
  getList,
  deleteBanHammer,
};
