const jwt = require("jsonwebtoken")
/* 
I'm Assuming that we're conneted data base the mode name User
*/

// const User = require("../../database/datas");


/* 
this code is a middleware that will allow allow us to protect the admin page when attacche to the page 
*/

const protectPg = async (req, res, next)=>{
    const token = req.cookies.jwt
    if(!token){
        res.status(401).json("Unathorise, no token")
    }
    else{
        try{
          const decoded = jwt.verify(token, process.env.SECRET_CODE, )
          req.user = decoded
          next()
        }
        catch (error){
            res.status(400).json("Unauthorise, Invalid token")
        }
    }
    
}