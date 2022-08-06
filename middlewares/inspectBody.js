/*

A middleware to inspect and validate the properties 
of object passed in the request body

*/

const inspectBody = async (req, res, next) => {
  //
  // ----> check if the body is an object
  //       and remove keys with null values
  //
  const obj = req.body;
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((k) => obj[k] == null && delete obj[k]);
  }

  // we define the employee object type that we need for this request
  const employee = {
    name: 'John Doe',
    salary: '2000000',
    currency: 'USD',
    department: 'Entrepreneur',
    on_contract: false,
    sub_department: 'Engineer',
  };

  // map over the object and validate

  for (x in Object.keys(employee)) {
    //
    // ---> Interesting things happen here
    // -    We check to see if the key exists in our employee type variable
    // -    If it does not exist we return an error
    //
    if (Object.keys(obj).indexOf(Object.keys(employee)[x]) < 0) {
      res
        .status(400)
        .json({ error: `key "${Object.keys(employee)[x]}" was not provided` });
      return;
    } else {
      //
      // ---> Here we check to see if the data type of keys
      //      in the object employee matches with the recieved object
      //
      Object.keys(obj).find((o, y) => {
        if (o === Object.keys(employee)[x])
          if (
            typeof Object.values(employee)[x] !== typeof Object.values(obj)[y]
          ) {
            res.status(400).json({
              error: `Data type of "${
                Object.keys(employee)[x]
              }" is not ${typeof Object.values(employee)[x]}`,
            });
          }
      });
    }
  }
  return next();
};

module.exports = inspectBody;
