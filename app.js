/* 

Server is exposed from this file

*/

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const inspectSession = require('./middlewares/inspectSession');
const serializeDB = require('./setupdb/serializeDB');

const app = express();
const port = 8080;

require('dotenv').config();
//
// -----> use the necessary built-in middlewares

app.use(express.json()); // for accepting json body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.dirname('./static'))); // serve static assets
app.use(cookieParser(process.env.SECRET)); // parse the incoming cookie
app.use(inspectSession()); //validate session

//  setup database
serializeDB();

// ------>  import our routes
// ------>  Main route for home page is '/'
require('./routes/home')(app, port);
require('./routes/addEmployee')(app);
require('./routes/allEmployees')(app);
require('./routes/authenticate')(app);
require('./routes/deleteEmployee')(app);
require('./routes/summaryStatistics')(app);

app.listen(port, () => {
  console.log(`-----> Server Running on port:${port}`);
});
