const express = require('express');
const UserRouter = express.Router();
const {userSchema} = require("../validations/users.validations");
const {validate} = require("../middlewares/validate.middleware");
const {UsersControllers} = require("../controllers/index.controllers");

UserRouter.post('/register',validate(userSchema),UsersControllers.addUser);

module.exports = {UserRouter};