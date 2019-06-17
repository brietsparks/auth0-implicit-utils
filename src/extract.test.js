import extractDataFromUrlHash from './extract';

describe('extract', () => {
  test('on parse success', () => {
    const accessToken = 'abc123';
    const idTokenPayload = { sub: 'u1' };

    const client = {
      parseHash: cb => {
        setTimeout(cb(undefined, { accessToken, idTokenPayload }), 100);
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

  test('on parse error', () => {
    const client = {
      parseHash: cb => {
        setTimeout(cb(new Error('err!'), undefined), 100);
      }
    };

    extractDataFromUrlHash.call(client).catch(e => {
      expect(e.message).toEqual('err!');
    })
  });

  test('neither success nor error', () => {
    const client = {
      parseHash: cb => {
        setTimeout(cb(undefined, undefined), 100);
      }
    };

    extractDataFromUrlHash.call(client).catch(e => {
      expect(e.message).toEqual('auth0.parseHash neither parsed the hash successfully nor returned an error');
    })
  });
});
