import TokenReader from './token-reader';

describe('@resumapp/auth0/token-reader', () => {
  describe('TokenReader', () => {
    describe('with valid token', () => {
      // header = { typ: "JWT", alg: "HS256" };
      // payload = { sub: "123", exp: 1557525699 };

      const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE1NTc1MjU2OTksImp0aSI6ImZjMWVkNDM3LTlkYjMtNDdiZS1iNmY2LWYwYmQ2ZDgyYTI4ZSIsImlhdCI6MTU1NzUyMjA5OX0.v1ImkAd8HmdMXxM2Gez9OlcxLY5paXzHWWIl483BQ5Q';
      it('gets subject', () => {
        const actual = (new TokenReader(token)).getSubject();
        const expected = '123';
        expect(actual).toEqual(expected);
      });

      it('gets exp unix timestamp in seconds', () => {
        const actual = (new TokenReader(token)).getExpirationTimestamp();
        const expected = 1557525699000; //seconds
        expect(actual).toEqual(expected);
      });

      it('gets expiration datetime', () => {
        const actual = (new TokenReader(token)).getExpirationDateTime();
        const expected = new Date(1557525699000); // milliseconds
        expect(actual).toEqual(expected);
      });

      // test('gets whether expiration occurs within a given amount of time', () => {
      // });

      test('isTokenValid false', () => {
        const actual = (new TokenReader(token)).isTokenValid();
        expect(actual).toEqual(true);
      });
    });

    describe('with invalid token', () => {
      const error = new Error('invalid token');

      test('getSubject throws', () => {
        const actual = () => (new TokenReader('')).getSubject();
        expect(actual).toThrow(error);
      });

      test('getExp throws', () => {
        const actual = () => (new TokenReader('')).getExpirationTimestamp();
        expect(actual).toThrow(error);
      });

      test('getExpiration throws', () => {
        const actual = () => (new TokenReader('')).getExpirationDateTime();
        expect(actual).toThrow(error);
      });

      test('isTokenExpired throws', () => {
        let actual;

        actual = () => (new TokenReader('')).isTokenExpired();
        expect(actual).toThrow(error);

        actual = () => (new TokenReader(undefined)).isTokenExpired();
        expect(actual).toThrow(error);
      });

      test('isTokenValid true', () => {
        const actual = (new TokenReader('')).isTokenValid();
        expect(actual).toEqual(false);
      });
    });
  });
});
