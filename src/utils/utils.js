const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getRequestIp = (req) => {
  return req.headers['x-real-ip'] || req.connection.remoteAddress;
};

module.exports = {
  escapeRegExp,
  getRequestIp,
};
