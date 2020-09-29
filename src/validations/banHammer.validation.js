const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createBanHammer = {
  body: Joi.object().keys({
    str: Joi.string().required().max(2048),
  }),
};

const getBanHammer = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const deleteBanHammer = {
  params: Joi.object().keys({
    banHammerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBanHammer,
  getBanHammer,
  deleteBanHammer,
};
