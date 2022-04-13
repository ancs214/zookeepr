//NOTE: animals.json is an object, with an array (animals) of objects (id, name, species, diet....etc)

//NOTE: when deploying heroku app, you must add /api/animals to end of URL!!

//access to apiroutes and htmlroutes folder:
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

const fs = require('fs');
//path module provides utilities for working with file and directory paths (for path.join modules below)
const path = require('path');
const { animals } = require('./data/animals');
const express = require('express');
//tells heroku to use the environment variable they have set, if not default to 80
const PORT = process.env.PORT || 3001;
//assign express() to the app variable so that we can later chain on methods to the Express.js server; represents a single instance of the Express.js server
const app = express();

//MIDDLEWARE
// parse incoming string or array data from a POST request and parse into the req.body object
//converts incoming POST data and converts to key/value pairings that can be accessed in the req.body object
//extended.true option informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into POST data as possible to parse correctly 
app.use(express.urlencoded({ extended: true }));
// method to parse incoming JSON data before getting to the endpoint
app.use(express.json());
//provide file path to public folder to instruct the server to make these files static resources; all of those files can be accessed without having a specific server endpoint for it!
app.use(express.static('public'));
//if a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes folder
app.use('/api', apiRoutes);
//if / is the endpoint, the router will serve back to our html routes
app.use('/', htmlRoutes);


//chain the listen() method onto our server to make our server listen. when we type npm start into command line, it will console log `API server now on port...!`
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});


