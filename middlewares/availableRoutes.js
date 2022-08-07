/*

To validate if API consumer is accessing a route that is available
returns a 404 response otherwise. It might get harder to implement 
this logic when there are a lot of routes. It is recommended to use a 
library such as \**class-validator**\ instead of going your own way.

*/

const availableRoutes = (req, res, next) => {
  const routes = {
    '/': 'GET',
    '/signin': 'POST',
    '/signout': 'POST',
    '/all': 'GET',
    '/add': 'POST',
    '/ss': 'GET',
    '/*': 'DELETE', // requires furhter validation with regexp
  };
  //   queries for ss route
  const availableQueries = ['department', 'sub_department'];

  const path = req._parsedUrl.pathname;
  const method = req.method;
  const keys = Object.keys(routes);
  const values = Object.values(routes);
  const routeIndex = keys.indexOf(path);

  const fourOFour = (
    e = 'The route you are trying to access is not available'
  ) =>
    res.status(404).json({
      error: e,
    });

  const validator = ({ greenSignal = true } = {}) => {
    if (method !== values[routeIndex]) {
      greenSignal = false;
      fourOFour();
    } else if (path === keys[5]) {
      //  extract the query object from request
      const queryObj = Object.keys(req.query);
      if (queryObj.length) {
        //   we check if the user if querying for the right data
        if (availableQueries.indexOf(queryObj[0] || queryObj[1]) < 0) {
          greenSignal = false;
          fourOFour('Requested query is not available');
        }
      }
    }
    return greenSignal;
  };

  if (routeIndex !== -1) {
    const greenSignal = validator();
    greenSignal ? next() : null;
  } else {
    const regexp = /\/./; // returns true for any string after '/'
    if (method === values[6] && regexp.test(path)) {
      return next();
    }
    return fourOFour();
  }
};

module.exports = availableRoutes;
