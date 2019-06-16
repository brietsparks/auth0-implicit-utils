export const LOGIN_LOCATION_KEY = 'login_location';
export const ACCESS_TOKEN_KEY = 'access_token';
export const NONCE_KEY = 'auth_nonce';
export const STATE_KEY = 'auth_state';

export const retrieveLoginLocation = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const storeLoginLocation = loginLocation => localStorage.setItem(LOGIN_LOCATION_KEY, loginLocation);
export const removeLoginLocation = () => localStorage.removeItem(LOGIN_LOCATION_KEY);

export const retrieveToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const storeToken = token => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

export const retrieveNonce = () => localStorage.getItem(NONCE_KEY);
export const storeNonce = nonce => localStorage.setItem(NONCE_KEY, nonce);
export const removeNonce = () => localStorage.removeItem(NONCE_KEY);

export const retrieveState = () => localStorage.getItem(STATE_KEY);
export const storeState = state => localStorage.setItem(STATE_KEY, state);
export const removeState = () => localStorage.removeItem(STATE_KEY);


export const storage = {
  retrieveLoginLocation,
  storeLoginLocation,
  removeLoginLocation,
  retrieveToken,
  storeToken,
  removeToken,
  retrieveNonce,
  storeNonce,
  removeNonce,
  retrieveState,
  storeState,
  removeState,
};
