const express = require("express");
const app = express();


app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")


const adminPanel =  (req, res) => {

    try {
       
        res.render('admin')
      
    } catch (error) {
      res.status(400).json("Invalid User Credential");
   }
  
  };
 
  module.exports = { adminPanel,  };
