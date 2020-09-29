const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const linkSchema = mongoose.Schema(
  {
    link: {
      type: String,
      required: true,
      index: true,
      maxlength: 2048,
    },
    shortCode: {
      type: String,
      required: false,
      index: true,
      maxlength: 10,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false,
    },
    ip: {
      type: String,
      maxlength: 45,
      private: true,
    },
    isBanned: {
      type: Boolean,
      default: false,
      required: false,
    },
    redirectCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
linkSchema.plugin(toJSON);

/**
 * @typedef Link
 */
const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
