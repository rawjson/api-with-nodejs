/*

Authenticate the user

*/

const { query } = require('../dbQuery/query');
const { randomBytes } = require('node:crypto');

const authenticate = (app) => {
  app.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const [user] = await query(
      `SELECT username, password 
        FROM auth_users 
        WHERE username = "${username}"`
    );

    if (user) {
      if (user.password !== password) {
        res.status(400).json({ error: 'Username or password does not match' });
      } else {
        /*
         ---> generate a random string using built in cypto module
        */
        const session_id = randomBytes(52).toString('base64').slice(0, 52);
        /*
          send a signed cookie that further uses a hasing logic to 
          return a random string
        */
        res.cookie('session_id', session_id, {
          maxAge: 86400 * 1000, // valid for 24 hours
          signed: true,
        });
        res.json({ success: true, message: 'You are signed in' });
      }
    } else {
      res.status(400).json({ error: 'Username does not exist' });
    }
  });

  // remove or clear the cookie from browser
  app.post('/signout', async (req, res) => {
    res.clearCookie('session_id');
    res.json({ message: 'You have been signed out' });
  });
};

module.exports = authenticate;
