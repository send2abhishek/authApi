const appModel = require("../Models/appModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const getExistingUser = await queryUserFromDb(req.body.email);
    if (getExistingUser.length >= 1) {
      return res.status(409).json({
        message: config.get("userExits"),
      });
    } else {
      bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
          return res.status(500).json({
            error: err,
          });
        } else {
          const user = new appModel({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            password: hash,
            email: req.body.email,
            country: req.body.country,
            phone: req.body.phone,
          });

          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: config.get("userRegister"),
              });
            })
            .catch((error) => {
              res.status(500).json({
                message: config.get("error"),
                info: error.message,
              });
            });
        }
      });
    }
  } catch (ex) {
    next(ex);
  }
};

const login = async (req, res, next) => {
  try {
    const getExistingUser = await queryUserFromDb(req.body.email);

    if (getExistingUser.length < 1) {
      return res.status(401).json({
        message: config.get("userNotFound"),
      });
    } else {
      bcrypt.compare(
        req.body.password,
        getExistingUser[0].password,
        async (error, resp) => {
          if (error) {
            return res.status(401).json({
              message: config.get("InvalidPassword"),
            });
          }

          if (resp) {
            const Token = jwt.sign(
              {
                username: getExistingUser[0].name,
                email: getExistingUser[0].email,
                country: getExistingUser[0].country,
                phone: getExistingUser[0].phone,
              },
              config.get("AuthKey"),
              {
                expiresIn: "1h",
              }
            );

            return res.status(200).json({
              userId: getExistingUser[0]._id,
              username: getExistingUser[0].name,
              email: getExistingUser[0].email,
              country: getExistingUser[0].country,
              phone: getExistingUser[0].phone,
              token: Token,
            });
          }

          return res.status(401).json({
            message: config.get("InvalidAuth"),
          });
        }
      );
    }
  } catch (err) {
    next(err);
  }
};

const queryUserFromDb = async (user) => {
  try {
    const getUser = await appModel.find({ email: user });
    return getUser;
  } catch (ex) {
    return new Error(config.get("error"));
  }
};
const getDetails = async (req, res) => {
  try {
    const getDetails = await appModel.find(
      {},
      { name: 1, email: 1, country: 1 }
    );
    return res.status(201).json(getDetails);
  } catch (ex) {
    return new Error(config.get("error"));
  }
};
module.exports = {
  login,
  register,
  getDetails,
};
