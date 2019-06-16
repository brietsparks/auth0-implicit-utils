import extractDataFromUrlHash from './extract';

describe('extract', () => {
  test('parse', () => {
    const accessToken = 'abc123';
    const idTokenPayload = { sub: 'u1' };

    const client = {
      parseHash: cb => {
        setTimeout(cb(undefined, { accessToken, idTokenPayload }), 500);
      }
    };

    extractDataFromUrlHash.call(client).then(result => {
      const expected = {
        token: 'abc123',
        userId: 'u1'
      };
      expect(result).toEqual(expected);
    });
  });
});
