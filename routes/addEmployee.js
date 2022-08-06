/*

------> 1. add a new record to the employees table

*/

const inspectBody = require('../middlewares/inspectBody');
const { query } = require('../dbQuery/query');

const addEmployee = (app) => {
  app.post('/add', inspectBody, async (req, res) => {
    const obj = req.body;
    try {
      await query(
        `
            INSERT INTO employees (
              name,
              salary,
              currency,
              department,
              on_contract,
              sub_department
            ) VALUES (
              "${obj.name}",
              "${obj.salary}",
              "${obj.currency}",
              "${obj.department}",
              ${obj.on_contract ? 1 : 0},
              "${obj.sub_department}")`,
        'run'
      );
      res.json({ message: 'Record added successfully', record: obj });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({ message: 'Failed to save record check logs' });
    }
  });
};

module.exports = addEmployee;
