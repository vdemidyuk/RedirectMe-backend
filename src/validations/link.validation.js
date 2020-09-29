const Joi = require('@hapi/joi');
// const { password, objectId } = require('./custom.validation');
const { isValidLink } = require('../utils/link');

const createLink = {
  body: Joi.object().keys({
    link: Joi.string().custom((value, helper) => {
      if (!isValidLink(value)) {
        return helper.message('Invalid link');
      }
      return value;
    }),
  }),
};

const processLink = {
  body: Joi.object().keys({
    link: Joi.string().custom((value, helper) => {
      if (!isValidLink(value)) {
        return helper.message('Invalid link');
      }
      return value;
    }),
  }),
};

module.exports = {
  createLink,
  processLink,
};
