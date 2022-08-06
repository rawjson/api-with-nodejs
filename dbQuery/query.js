/* 

function to run database queries

*/

const { db } = require('./sequelite');

exports.query = (command, method = 'all') => {
  return new Promise((resolve, reject) => {
    db[method](command, (err, res) => {
      err ? reject(err) : resolve(res);
    });
  });
};
