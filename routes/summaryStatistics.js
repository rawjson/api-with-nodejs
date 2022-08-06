/* 

------> 4. fetch Summary Statistics for salary
------------ --------- AND -------------------
------> 5. fetch summary statistics for records
        -> that satisfy "on_contract": true
------> 6. fetch SS for each department
------> 7. fetch SS for each department and sub department

*/

const { query } = require('../dbQuery/query');

const summaryStatistics = (app) => {
  app.get('/ss', async (req, res) => {
    let employees;
    // check if our api consumer is querying for something
    // otherwise query all employees

    if (req.query.on_contract) {
      switch (req.query.on_contract) {
        case 'true':
          //
          // ----> query those who are on contract

          employees = await query(
            `SELECT * FROM employees WHERE on_contract = ${1}`
          );
          break;
        case 'false':
          //
          // ----> query those who are not on contract

          employees = await query(
            `SELECT * FROM employees WHERE on_contract = ${0}`
          );
          break;
      }
    } else if (req.query.department) {
      // ---->
      if (req.query.department && req.query.sub_department) {
        //
        // ----> query employees from both department and sub department

        employees = await query(`
        SELECT * FROM employees 
        WHERE department = "${req.query.department}"
        AND sub_department = "${req.query.sub_department}"
        `);
      } else {
        //
        // ----> query employees from a specific department

        employees = await query(`
        SELECT * FROM employees 
        WHERE department = "${req.query.department}"
        `);
      }
    } else {
      //
      // ----> query all employees

      employees = await query(`SELECT * FROM employees`);
    }

    let sumOfSalaries = 0;
    let salaries = [];

    for (let i = 0; i < employees.length; i++) {
      sumOfSalaries += Number(employees[i].salary);
      salaries.push(employees[i].salary);
    }

    const mean = Math.round(sumOfSalaries / employees.length);
    const max = Math.max(...salaries);
    const min = Math.min(...salaries);

    res.json({ mean, max, min });
  });
};

module.exports = summaryStatistics;
