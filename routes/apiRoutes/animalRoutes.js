//we can no longer use app to access express server, but we can use Router which allows us to declare routes in any file as long as we have the proper middleware. must export it at the end of the file. 
const router = require('express').Router();
//must require functions from animals.js to access
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//GET ROUTE/ENDPOINT
//get method requires two arguments: 1. a string that describes the route the client will have to fetch from 2. a callback func that will execute every time that route is accessed w a GET request (this callback fn will have two arguments: req, res)
router.get('/animals', (req, res) => {
    let results = animals;

    //req.query - often combines MULTIPLE PARAMETERS
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
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
        //if resource could not be found, communicate to the client a 404 error
    }
});

//post req indicate a client requesting the server to accept data instead of vice versa
router.post('/animals', (req, res) => {
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




module.exports = router;