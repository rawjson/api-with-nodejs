/*
 ------> 3. delete a record from the dataset

*/
const { query } = require('../dbQuery/query');

const deleteEmployee = (app) => {
  app.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
      if (id) {
        await query(`DELETE FROM employees WHERE id = ${id}`);
        res.json({ message: `Employee with id:${id} is deleted` });
      } else {
        res.json({ message: `You forgot to provide id in param` });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(400).json({ error: 'Failed to delete employee' });
    }
  });
};

module.exports = deleteEmployee;
