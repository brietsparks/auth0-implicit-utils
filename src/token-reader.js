import decodeJwt from 'jwt-decode';

import { SECOND } from './constants';

export class TokenReader {
  constructor(token) {
    this.token = token;

    try {
      this.decoded = decodeJwt(token);
      this.valid = true;
    } catch (e) {
      this.decoded = {};
      this.valid = false;
    }
  }

  isTokenValid() {
    return this.valid;
  }

  getSubject() {
    if (!this.isTokenValid()) {
      throw new Error('invalid token');
    }

    return this.decoded.sub;
  };

  getUser() {
    return this.getSubject();
  }

  getExpirationTimestamp() {
    if (!this.isTokenValid()) {
      throw new Error('invalid token');
    }

    return this.decoded.exp * SECOND;
  };

  isExpiringWithin(seconds) {
    this.checkValid();

    const testUntil = seconds * 1000;
    const actualUntil = this.getExpirationTimestamp() - Date.now();

    return actualUntil <= testUntil;
  };

  getExpirationDateTime() {
    this.checkValid();

    return new Date(this.getExpirationTimestamp());
  };

  isTokenExpired() {
    this.checkValid();

    return this.getExpirationDateTime() < new Date();
  };

  checkValid() {
    if (!this.isTokenValid()) {
      throw new Error('invalid token');
    }
  }
}

export default TokenReader;
