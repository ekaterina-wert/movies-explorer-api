const { UNAUTHORIZED } = require('../utils/constants');

class TokenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = TokenError;
