const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // console.log(req.headers.authorization); // Bearer ObUpy4sA6CQE1P7h
  // on retire "Bearer " de devant notre token pour effectuer la recherche de l'utilisateur dans la BDD :
  const token = req.headers.authorization.replace("Bearer ", "");
  // Rechercher si l'utilisateur existe dans la BDD :
  const user = await User.findOne({ token: token });

  // console.log(user);
  if (user) {
    req.user = user;
    return next();
  } else {
    return res.status(401).json("Unauthorized");
  }
};

module.exports = isAuthenticated;
