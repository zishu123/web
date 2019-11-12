const login = require('../controllers/login');
const registration = require('../controllers/resgistration');
const express = require('express');
const router = express.Router();


router.post("/login" , login.login);
router.post("/register" , registration.register);

module.exports = router;