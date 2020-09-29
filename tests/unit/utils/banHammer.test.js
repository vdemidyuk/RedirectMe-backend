const faker = require('faker');
const { isIp, isWildcard } = require('../../../src/utils/banHammer');

describe('banHammer util', () => {
  const notValidIps = ['256.0.0.1', '192.0.0.', '192.0.0'];

  const validIps = [faker.internet.ip(), faker.internet.ipv6()];

  it('isIp() should not pass invalid ip address', () => {
    notValidIps.forEach((v) => {
      expect(isIp(v)).toBe(false);
    });
  });

  it('isIp() should pass valid ip address', () => {
    validIps.forEach((v) => {
      expect(isIp(v)).toBe(true);
    });
  });

  it('isWildcard() should pass valid wilcard', () => {
    expect(isWildcard('blah*')).toBe(true);
    expect(isWildcard('https://google*')).toBe(true);
    expect(isWildcard('skype:*')).toBe(true);
  });

  it('isWildcard() should not pass invalid wilcard', () => {
    expect(isWildcard('blah*blah')).toBe(false);
    expect(isWildcard('https://google*.com')).toBe(false);
    expect(isWildcard('skype:*name?call')).toBe(false);
  });
});
