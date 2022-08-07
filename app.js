/* 

Server is exposed from this file

*/

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const inspectSession = require('./middlewares/inspectSession');
const serializeDB = require('./setupdb/serializeDB');
const availableRoutes = require('./middlewares/availableRoutes');

const app = express();
const port = 8080;

require('dotenv').config();

// -----> By default fs will recreate the access.log file
//        everytime the server is started
const accessLogStream = require('fs').createWriteStream(
  require('path').join(__dirname, 'access.log')
  // { flags: 'r+' }  please uncomment this flag when going to production
);
//
// -----> use the necessary built-in middlewares
app.use(express.static(path.dirname('./static'))); // serve static assets
app.use(express.json()); // for accepting json body
app.use(express.urlencoded({ extended: true }));
app.use(availableRoutes); // for validating available routes
app.use(cookieParser(process.env.SECRET)); // parse the incoming cookie
app.use(inspectSession()); //validate session
app.use(require('morgan')('combined', { stream: accessLogStream }));

//  setup database
serializeDB();

// ------>  import our routes
// ------>  Main route for home page is '/'
require('./routes/home')(app, port);
require('./routes/authenticate')(app);
require('./routes/allEmployees')(app);
require('./routes/addEmployee')(app);
require('./routes/deleteEmployee')(app);
require('./routes/summaryStatistics')(app);

app.listen(port, () => {
  console.log(`-----> Server Running on port:${port}`);
});
