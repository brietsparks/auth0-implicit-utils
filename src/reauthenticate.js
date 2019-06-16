export default function reauthenticate(opts = {}) {
  return new Promise((resolve, reject) => {
    this.checkSession(opts, (error, result) => {
      if (error) {
        reject(error)
      }

      try {
        // todo check that the access token is not opaque
        const token = result.accessToken;
        const userId = result.idTokenPayload.sub;

        resolve({ token, userId });
      } catch (error) {
        reject(error);
      }

      reject(new Error('auth0.checkSession neither returned a valid result nor an error'));
    });
  })
}
