//NOTE: animals.json is an object, with an array (animals) of objects (id, name, species, diet....etc)

const fs = require('fs');
const path = require('path');
const { animals } = require('./data/animals');
const express = require('express');
//tells heroku to use the environment variable they have set, if not default to 80
const PORT = process.env.PORT || 3001;
//assign express() to the app variable so that we can later chain on methods to the Express.js server.
const app = express();

//MIDDLEWARE
// parse incoming string or array data from a POST request and parse into the req.body object
//converts incoming POST data and converts to key/value pairings that can be accessed in the req.body object
//extended.true option informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into POST data as possible to parse correctly 
app.use(express.urlencoded({ extended: true }));
// method to parse incoming JSON data before getting to the endpoint
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

  //func that accepts POST route's req.body value and the array we want to add the data to (animalsArray) so that we can add a new animal to the catalog
  function createNewAnimal(body, animalsArray) {
    const animal = body;
    //add req.body data to animalsArray
    animalsArray.push(animal);

    //writeFileSync is the synchronous version of writeFile and doesnt require a callback func (ok since this is smaller file)
    fs.writeFileSync(
      //__dirname = folder of the file we execute the code in that contains path to animals.json
      //join method will join value of __dirname with animals.json
      path.join(__dirname, './data/animals.json'),
      //convert JS array data to JSON, null = we dont want to edit any of our existing data, 2 = we want to create white space between our values to make it more readable
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
  
    // return finished code to post route for response
    return animal;
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
    
    //set an id based on what the next index of the array will be; will work only as long as we dont remove any data
    req.body.id = animals.length.toString();

    //run validation function
    if (!validateAnimal(req.body)) {
      //if any return false, user will get 400 error (server has no problems and understands request, but request was incorrectly made) with message below:
      res.status(400).send('The animal is not properly formatted.');
    } else {
      const animal = createNewAnimal(req.body, animals);
      res.json(animal);
    }
  });

  //POST request validation: must have name, species, diet, personality data entered and must be a string
  function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }