const express = require("express");
const route = express.Router();
const controller = require("../Controllers/appController");
const validateUsers = require("../Middlewares/usersValidate");
const AuthCheck = require("../Middlewares/authvalidate");
// all routes
route.post("/login", validateUsers.validateUser, controller.login);
route.post(
  "/register",
  validateUsers.validateRegistration,
  controller.register
);
route.get("/home", AuthCheck, controller.getDetails);
route.get("/", (req, res) => {
  res.send("App is running");
});
module.exports = route;
