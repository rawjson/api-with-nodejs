/*

Prefill the dataset from .dataset.json

*/
const dataset = require('../dataset.json');

const createDatasetIfEmpty = async (query) => {
  // query all from database
  const existingSet = await query('SELECT * FROM employees');

  // if empty, prefill dataset for our API consumer
  if (!existingSet?.length) {
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

  const authUsers = await query('SELECT * FROM auth_users');

  if (!authUsers?.length) {
    await query(
      `INSERT INTO auth_users (
          username,
          password
        ) VALUES (
          "johndoe",
          "password"
        )`
    );
  }
};

module.exports = createDatasetIfEmpty;
