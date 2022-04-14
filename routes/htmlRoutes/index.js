//we can no longer use app to access express server, but we can use Router which allows us to declare routes in any file as long as we have the proper middleware. must export it at the end of the file. 
const router = require('express').Router();
const path = require('path');



//     *****REMEMBER: order of routes matters!******
// the '/' will direct us to the root route of the server
//serve up index.html
router.get('/', (req, res) => {
    //responds with HTML file instead of JSON data
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
  
  //serve up animals.html
  router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
  });
  
  //serve up zookeepers.html
  router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
  });
  
  //the * acts as a wildcard; any route not previously defined will fall under this request and go back to homepage
  router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  

  module.exports = router;