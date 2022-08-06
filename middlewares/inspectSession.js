/*

This middleware blocks any request if user is not signed in
we are using a dummy user with username: "johndoe" and password:"password"
for the sake of simplicity

*/

const inspectSession = () => {
  return async (req, res, next) => {
    const url = req.originalUrl;

    //---> feed the array any routes that you want to be public
    const publicRoutes = ['/signin', '/'];

    //---> then validate the cookie and expose a protected route
    if (publicRoutes.indexOf(url) < 0) {
      if (req.signedCookies['session_id']) {
        return next();
      } else {
        res
          .status(401)
          .json({ message: 'Unauthorized! you are not signed in.' });
      }
    } else {
      return next();
    }
  };
};

module.exports = inspectSession;
