const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Activity = require('../models/Activity.model')
const Sport = require('../models/Sport.model')
const User = require('../models/User.model')

const { isAuthenticated, checkAdmin } = require('./../middleware/jwt.middleware.js');

router.get('/sports', (req, res ) => {
    Sport.find()
        .populate('activities')
        .then(sports => res.json(sports))
        .catch(err => console.log(err))
})

router.post('/sports', isAuthenticated, checkAdmin, (req, res, next) => {
    const { name, iconUrl, imageUrl } = req.body

    if (name === '' || iconUrl === '' || imageUrl === '') {
        res.status(400).json({ message: "Provide name, date and place." });
        return;
      }  
 
    Sport.create({ name, iconUrl, imageUrl, activities: [] })
            .then(sport => res.json(sport))
            .catch(err => res.json(err));
})

module.exports = router;