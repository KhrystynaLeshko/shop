const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Extract the token from the request header
  const authHeader = req.headers.token;
  // Check if the token exists
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      // If verification fails, respond with an error
      if (err) res.status(403).json("Token is not valid!");
      // If verification succeeds, attach the user to the request object
      req.user = user;
      // console.log(user);
      next();
    });
  } else {
    // If no token is provided, respond with an authentication error
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    // Check if the user ID matches the requested ID or if the user is an admin
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      // If not authorized, respond with a forbidden error
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

// function verifyTokenAndAdmin(req, res, next) {
//   const token = req.header('auth-token');
//   if (!token) return res.status(401).send('Access Denied');

//   try {
//     const verified = jwt.verify(token, process.env.JWT_SEC);
//     if (!verified) return res.status(401).send('Access Denied');

//     // Check if the user object exists before accessing its properties
//     if (!verified.user || !verified.user.isAdmin) {
//       return res.status(403).send('Forbidden');
//     }

//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).send('Invalid Token');
//   }
// }

// OLD CODE:
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    // Check if the user is an admin
    if (req.user.isAdmin) {
      next();
    } else {
      // If not an admin, respond with a forbidden error
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = { verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin };