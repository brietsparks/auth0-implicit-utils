import random from './random';

test('random', () => {
  // this gives jest access to window.crypto
  const crypto = require('crypto');
  Object.defineProperty(global.self, 'crypto', {
    value: {
      getRandomValues: arr => crypto.randomBytes(arr.length),
    },
  });

  const val1 = random();
  const val2 = random();
  const val3 = random();
  expect(val1.length).toEqual(16);
  expect(val2.length).toEqual(16);
  expect(val3.length).toEqual(16);

  expect(val1).not.toEqual(val2);
  expect(val1).not.toEqual(val3);
  expect(val2).not.toEqual(val3);
});
