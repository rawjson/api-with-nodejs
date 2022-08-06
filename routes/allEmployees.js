// -----> retrieve all records from employees
const { query } = require('../dbQuery/query');

const retrieveAllEmployees = (app) => {
  app.get('/all', async (req, res) => {
    const dataSet = await query('SELECT * FROM employees');
    res.json({ object: 'all employees', data: dataSet, total: dataSet.length });
  });
};

module.exports = retrieveAllEmployees;
