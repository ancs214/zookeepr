
const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

//we are using the router exported from animalRoutes.js file
router.use(animalRoutes);

module.exports = router;





//  **** this is the CENTRAL HUB for all routing functions in the application *****