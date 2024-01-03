const express =  require( "express")
const router = express.Router()
const protectPg = require('../utility/protectpg') 
const {adminPanel} =require("../controller/controlle")

router.get( "/admin",  adminPanel)


/* below is how the page will be protected if we have database connected and want to protect the admin page 
 */


// router.get( "/admin",  protectPg, adminPanel)

module.exports = router