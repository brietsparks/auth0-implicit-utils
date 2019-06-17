import auth0 from 'auth0-js';
import randomString from './random';
import extractDataFromUrlHash from './extract';
import reauthenticate from './reauthenticate';
import TokenReader from './token-reader';
import { storage as defaultStorage } from './storage';
import { DEFAULT_THRESHOLD, DEFAULT_INTERVAL } from './constants';

export default function ({
  domain,
  clientId,
  audience,
  loginCallbackUrl,
  logoutRedirectUrl,
  webAuthOpts = {},

  threshold = DEFAULT_THRESHOLD,
  interval = DEFAULT_INTERVAL,

  storage = defaultStorage
} = {}) {
  const makeClient = ({ state, nonce } = {}) => {
    state = state || randomString();
    nonce = nonce || randomString();

    return new auth0.WebAuth({
      domain,
      clientID: clientId,
      redirectUri: loginCallbackUrl,
      audience,
      nonce,
      state,
      responseType: 'token id_token',
      prompt: 'none',
      ...webAuthOpts
    });
  };

  function authenticate({ isLoginCallback, isRequired, location: currentLocation } = {}) {
    // when authentication is required, we need the call location (e.g. path or url)
    if (!isLoginCallback && isRequired && !currentLocation) {
      throw new Error('authentication location not specified');
    }

    return new Promise((resolve, reject) => {
      try {
        // if this is called to process the login callback
        if (isLoginCallback) {
          const client = makeClient();

          // then we extract the token and userId from the url
          return extractDataFromUrlHash.call(client)
            .then(({ token, userId }) => {
              // store the token
              storage.storeToken(token);

              // and return the userId and original login location
              const loggedInFrom = storage.retrieveLoginLocation();
              storage.removeLoginLocation();
              resolve({ userId, redirectTo: loggedInFrom });
            })
            .catch(error => reject(error));
        }

        // for all other (non-login-callback) uses, look for
        // the token from the browser
        const token = storage.retrieveToken();
        const tokenReader = new TokenReader(token);

        // if token DNE or is invalid/malformed
        const isTokenValid = tokenReader.isTokenValid();
        if (!isTokenValid) {
          if (isRequired) {
            storage.storeLoginLocation(currentLocation);
            storage.removeToken();
            makeClient().authorize();
          }

          resolve(null);
        }

        // if token is expired
        const isTokenExpired = tokenReader.isTokenExpired();
        if (isTokenExpired && isRequired) {
          storage.storeLoginLocation(currentLocation);
          storage.removeToken();
          makeClient().authorize();
          resolve(null);
        }

        // if token is about to expire
        if (!isTokenExpired && tokenReader.isExpiringWithin(threshold)) {
          const client = makeClient();

          // fetch a token silently
          return reauthenticate.call(client)
            .then(({ token, userId }) => {
              // store the new token and queue a future authentication check
              storage.storeToken(token);
              setTimeout(() => authenticate(), interval);
              resolve(userId);
            })
            .catch(error => reject(error))
        }

        // if we reach this point, that means the
        // token is valid and not expiring soon
        // ...

        // queue a future authentication check
        setTimeout(() => authenticate(), interval);

        resolve(tokenReader.getUser());
      } catch (error) {
        reject(error);
      }
    });
  }

  function promptLogin(location) {
    storage.storeLoginLocation(location);
    makeClient().authorize();
  }

  function logout() {
    storage.removeToken();
    makeClient().logout({
      returnTo: logoutRedirectUrl,
      clientID: clientId
    });
  }

  return { authenticate, promptLogin, logout }
}
