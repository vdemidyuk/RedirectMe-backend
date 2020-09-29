const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const redirectSchema = mongoose.Schema(
  {
    link: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Link',
      required: true,
    },
    ip: {
      type: String,
      maxLength: 39,
    },
    userAgent: {
      type: String,
      maxLength: 2048,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
redirectSchema.plugin(toJSON);

/**
 * @typedef redirect
 */
const Redirect = mongoose.model('Redirect', redirectSchema);

module.exports = Redirect;
