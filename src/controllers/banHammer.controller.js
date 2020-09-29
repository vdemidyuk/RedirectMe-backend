const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { banHammerService } = require('../services');

const createBanHammer = catchAsync(async (req, res) => {
  const banHammer = await banHammerService.createBanHammer(req.body);

  res.status(httpStatus.CREATED).send(banHammer);
});

const getBanHammerList = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const banHammers = await banHammerService.getList(filter, options);

  res.send(banHammers);
});

const deleteBanHammer = catchAsync(async (req, res) => {
  await banHammerService.deleteBanHammer(req.params.banHammerId);

  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBanHammer,
  getBanHammerList,
  deleteBanHammer,
};
