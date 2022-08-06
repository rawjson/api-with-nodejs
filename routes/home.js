/*

----> home route ---> Welcome message and briefing

*/

const home = (app, port) => {
  app.get('/', async (req, res) => {
    const message = 'Welcome to the Solution of NodeJs Problem Statement.';
    const routes = {
      'POST /signin': 'signin to the app',
      'GET /all': 'get all employees',
      'POST /add': 'add a new employee',
      'DELETE /:id': 'deletes an employee',
      'GET /ss': 'Get summary statistics',
      'QUERY /ss':
        'Query the /ss with conditions "on_contract=true/false" Or call employees of a department or sub_department',
    };
    description =
      'This app uses REST APIs and returns and accepts JSON response';
    res.json({ message, description, routes, port });
  });
};

module.exports = home;
