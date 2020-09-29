const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const banHammerSchema = mongoose.Schema(
  {
    str: {
      type: String,
      required: true,
      index: true,
      maxlength: 2048,
    },
    isIp: {
      type: Boolean,
      default: false,
      required: false,
    },
    isWildcard: {
      type: Boolean,
      default: false,
      required: false,
    },
    isExact: {
      type: Boolean,
      default: false,
      required: false,
    },
    // due: {
    //   type: Date,
    //   required: false,
    //   default: () => new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    // },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
banHammerSchema.plugin(toJSON);
banHammerSchema.plugin(paginate);

/**
 * @typedef banHammer
 */
const banHammer = mongoose.model('BanHammer', banHammerSchema);

module.exports = banHammer;
