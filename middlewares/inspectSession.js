/*

This middleware blocks any request if user is not signed in
we are using a dummy user with username: "johndoe" and password:"password"
for the sake of simplicity

*/

const inspectSession = (app, query) => {
  //
  //---->  uses the sqlite query to validate the session_id
  //
  //----> the app paramter is required for the query to work

  return async (req, res, next) => {
    const session_id = req.cookies.session_id;
    const [user] = await query(`
    SELECT * FROM auth_users 
    WHERE session_id = "${session_id}"
    `);
    if (user?.session_id) {
      return next();
    } else {
      res.status(401).json({ message: 'Unauthorized! you are not signed in.' });
    }
  };
};

module.exports = inspectSession;
