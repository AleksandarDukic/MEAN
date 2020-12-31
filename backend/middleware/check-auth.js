const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]                           // EXPRESS gives us access to headers
    const decodeToken = jwt.verify(token, 'secret_this_should_be_longer');      // giving a const token a possible header data is in try-catch block because it could fail if null | also jwt.verify() can fail
    req.userData = {
      email: decodeToken.email,
      userId: decodeToken.userId
    }
    next()                                // with next() the execution of request can travel on
  } catch(err) {
    res.status(401).json({
      message: 'You are not authenticated!'
    });
  }
}


/*
    req.headers.authorization.split(" ")[1]

    Mora se dodati u "allowd headers" u app.js header "Authorization"

*/
