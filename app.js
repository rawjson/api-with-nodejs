/* 

Sever is exposed from this file

*/

const express = require('express');
const sqllite3 = require('sqlite3');

const dataset = require('./dataset.json');

const app = express();
const port = 8080;

const SQLite3 = sqllite3.verbose();
const db = new SQLite3.Database('database.db');

const query = (command, method = 'all') => {
  return new Promise((resolve, reject) => {
    db[method](command, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};

const createDatasetIfEmpty = async () => {
  // query all from database
  const existingSet = await query('SELECT * FROM employees');

  // if empty, prefill dataset for our API consumer
  if (existingSet?.length === 0) {
    for (let i = 0; i < dataset.length; i++) {
      await query(
        `INSERT INTO employees (
          name,
          salary,
          currency,
          department,
          on_contract, 
          sub_department
        ) VALUES (
          "${dataset[i].name}", 
          "${dataset[i].salary}", 
          "${dataset[i].currency}",
          "${dataset[i].department}",
          ${dataset[i].on_contract === 'true' ? 1 : 0},
          "${dataset[i].sub_department}")`,
        'run'
      );
    }
  }
};

db.serialize(async () => {
  // Creates table and columns if database is empty
  await query(
    `CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, 
      salary TEXT, 
      currency TEXT, 
      department TEXT,
      on_contract BOOLEAN NOT NULL,
      sub_department TEXT
      )`,
    'run'
  );

  // invoke the fn decalred above
  await createDatasetIfEmpty();
});


// ----->  Our app routes start here

app.use(express.json()); // for accepting json body

// ------> Main route/home page of our app

app.get('/', async (req, res) => {
  const message = 'Welcome to the Solution of NodeJs Problem Statement.';
  const route = '/';
  description = 'This app uses REST APIs and returns and accepts JSON response';
  res.json({ message, description, route, port });
});

// -----> retrieve all records from employees

app.get('/all', async (req, res) => {
  const dataSet = await query('SELECT * FROM employees');
  res.json({ object: 'all employees', data: dataSet, total: dataSet.length });
});

// ------> 1. add a new record to the employees table

app.post('/add', async (req, res) => {
  const obj = req.body;


  // ----> check if the body is an object
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((k) => {
      // ---- remove keys with null values
      if (obj[k] == null) delete obj[k];
    });
    try {
      await query(`
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
      )
      res.json({ message: 'Record added successfully', record: obj });
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({ message: 'Failed to save record check logs' });
    }
  }
});


// ------> 3. delete a record from the dataset

app.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    if (id) {
      await query(`DELETE FROM employees WHERE id = ${id}`)
      res.json({ message: `Employee with id:${id} is deleted` })
    } else {
      res.json({ message: `You forgot to provide id in param` });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ error: 'Failed to delete employee' })
  }
});

// ------> 3. fetch Summary Statistics for salary
// ------------ --------- AND -------------------
// ------> 4. fetch summary statistics for records
//             -> that satisfy "on_contract": true
// ------> 5/ fetch SS for each department
// ------> 6. fetch SS for each department and sub department

app.get('/ss', async (req, res) => {

  let employees;
  // if our api consumer is querying for something
  // otherwise query all employees

  if (req.query.on_contract) {
    switch (req.query.on_contract) {
      case 'true':
        // ---->
        // query those who are on contract
        // ---->
        employees = await query(`SELECT * FROM employees WHERE on_contract = ${1}`)
        break;
      case 'false':
        // ---->
        // query those who are not on contract
        // ---->
        employees = await query(`SELECT * FROM employees WHERE on_contract = ${0}`)
        break;
    }
  } else if (req.query.department) {
    // ---->
    if (req.query.department && req.query.sub_department) {
      // ---->
      // query employees from both department and sub department
      // ---->
      employees = await query(`
      SELECT * FROM employees 
      WHERE department = "${req.query.department}"
      AND sub_department = "${req.query.sub_department}"
      `)
    } else {
      // ---->
      // query employees from a specific department
      // ---->
      employees = await query(`
      SELECT * FROM employees 
      WHERE department = "${req.query.department}"
      `)
    }
    // ---->
  } else {
    // ---->
    // query all employees
    employees = await query(`SELECT * FROM employees`)
    // ---->
  }

  let sumOfSalaries = 0;
  let salaries = []

  for (let i = 0; i < employees.length; i++) {
    sumOfSalaries += Number(employees[i].salary)
    salaries.push(employees[i].salary)
  }

  const mean = Math.round(sumOfSalaries / employees.length)
  const max = Math.max(...salaries)
  const min = Math.min(...salaries)

  res.json({ mean, max, min });
});


app.listen(port, () => {
  console.log(`-----> Server Running on - http://localhost:${port}`);
});
