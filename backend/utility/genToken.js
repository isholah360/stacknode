
/* this code will allow us to generate token that help us protect the admin panel
 */
const jwt = require('jsonwebtoken')



const jWebToken = (res, user)=>{
  const token = jwt.sign(user, process.env.SECRET_CODE, {expiresIn:"20min"})

  res.cookie("jwt", token, {
    httpOnly:true,
    sameSite: "strict",
    maxAge: 12 * 24 * 60 * 60 * 1000
  })
}

module.exports = jWebToken;