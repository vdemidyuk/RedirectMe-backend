const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 12);
};

const isValidUrl = (url) => {
  const r = /([^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/i;
  return r.test(url);
};

const isValidAppUrl = (appUrl) => {
  const r = /^([a-z0-9]+):[^ "]+$/i;
  return r.test(appUrl);
};

const isValidCode = (code) => {
  const r = /^[a-z0-9]{10}$/i;
  return r.test(code);
};

const isValidLink = (link) => {
  if (isValidUrl(link) || isValidAppUrl(link) || isValidCode(link)) {
    return true;
  }
  return false;
};

module.exports = {
  isValidUrl,
  isValidAppUrl,
  isValidCode,
  isValidLink,
  generateShortCode,
};
