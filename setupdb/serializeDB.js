/*

creates necessary tables in the database

*/
const { db } = require('../dbQuery/sequelite');
const { query } = require('../dbQuery/query');
const createDatasetIfEmpty = require('./createDatasetIfEmpty');

const serialize = () =>
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

    // for the sake of simplicity we are not using password hashing
    await query(
      `CREATE TABLE IF NOT EXISTS auth_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE, 
        password TEXT,
        session_id TEXT UNIQUE
      )`,
      'run'
    );

    // invoke the fn decalred above
    await createDatasetIfEmpty(query);
  });

module.exports = serialize;
