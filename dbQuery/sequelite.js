/*

----> create sequelize database instance

*/

const sqllite3 = require('sqlite3');
const SQLite3 = sqllite3.verbose();

exports.db = new SQLite3.Database('database.db');
