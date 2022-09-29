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

router.get('/sports/:sportID', (req, res ) => {
    const { sportID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sportID)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    };    
    
    Sport.findById(sportID)
        .populate('activities')
        .then(sport => res.json(sport))
        .catch(err => console.log(err))
})

router.put('/sports/:sportID', isAuthenticated, checkAdmin, (req, res) => {
    const { sportID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sportID)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }; 

    const { name, iconUrl, imageUrl } = req.body
    Sport.findByIdAndUpdate(sportID, { name, iconUrl, imageUrl }, { new: true })
        .then(updatedSport => res.json(updatedSport))
        .catch(err => console.log(err))
})

router.delete('/sports/:sportID', isAuthenticated, checkAdmin, (req,res) => {
    const { sportID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(sportID)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    };
    Sport.findByIdAndRemove(sportID)
      .then((sport) => {      
            res.json({message: `Sport ${sport.name} was successfully deleted`})        
        })  
      .catch(err => console.log(err))
})


module.exports = router;