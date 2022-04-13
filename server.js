
const { animals } = require('./data/animals');
const express = require('express');
//tells heroku to use the environment variable they have set, if not default to 80
const PORT = process.env.PORT || 3001;
//assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

// parse incoming string or array data that will come from a POST request
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

//get method requires two arguments: 1. a string that describes the route the client will have to fetch from 2. a callback func that will execute every time that route is accessed w a GET request
// app.get('/api/animals', (req, res) => {
//     //using json() method from the res (response) object to send the JSON info to our client
//     res.json(animals);
//   });

//chain the listen() method onto our server to make our server listen. when we type npm start into command line, it will console log `API server now on port...!`
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});


  //create func to filter results by query
  function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }


  //EXPLAIN THROUGH THIS ...
  function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }

  //GET ROUTE/ENDPOINT
  //get method requires path and req/res arguments
  //req.query - often combines MULTIPLE PARAMTERS
  app.get('/api/animals', (req, res) => {
    let results = animals;
   
    if (req.query) {
        //console.log(req.query);

        //run filterByQuery func
        results = filterByQuery(req.query, results);
    }
    //if no query, return entire animals json file
    res.json(results);
  });


  // GET ROUTE/ENDPOINT
  //if user searches for a specific id, results will filter that specific id (will come BEFORE the question mark)
  //req.params - specific to a single property/parameter
  app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
      //if resource could not be found, communicate to the client a 404 error
    }
  });
  
  
  //post req indicate a client requesting the server to accept data instead of vice versa
  app.post('/api/animals', (req, res) => {
    //req.body is where our INCOMING content will be. this can be risky accepting data, which is why most APIs require user authentication. validation libraries (expreess-validator npm) on the server side also ensure data meets certain criteria.
    console.log(req.body);
    res.json(req.body);
  });
