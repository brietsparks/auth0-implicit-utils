export default function extractDataFromUrlHash() {
  return new Promise((resolve, reject) => {
    this.parseHash((error, parsed) => {
      if (parsed) {
        const { accessToken: token, idTokenPayload: { sub: userId } } = parsed;
        resolve({ token, userId });
      } else if (error) {
        reject(error);
      } else {
        reject(new Error('auth0.parseHash neither parsed the hash successfully nor returned an error'))
      }
    });
  });
}
