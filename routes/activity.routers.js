const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Activity = require('../models/Activity.model')
const Sport = require('../models/Sport.model')
const User = require('../models/User.model')

const { isAuthenticated } = require('./../middleware/jwt.middleware.js');

router.get('/activities', (req, res ) => {
    Activity.find()
        .populate('createdBy sport members')
        .then(activities => res.json(activities))
        .catch(err => console.log(err))
})


router.post('/activities', isAuthenticated, (req, res, next) => {
    const { name, description, duration, activityDate, location, sport } = req.body
    const createdBy = req.payload._id

    if (name === '' || activityDate === '' || location === '') {
        res.status(400).json({ message: "Provide name, date and place." });
        return;
      }  
// Need to add activity to the user        
    Activity.create({ name, description, duration, activityDate, location, sport, createdBy, member: [], pictures: [] })
            .then(activity => res.json(activity))
            .catch(err => res.json(err));
})


router.get('/activities/:activityID', isAuthenticated, (req, res, next) => {
    const {activityID} = req.params;
    if (!mongoose.Types.ObjectId.isValid(activityID)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    }

    Activity.findById(activityID)
        .populate('createdBy sport members')
        .then(activity => res.json(activity))
        .catch(err => console.log(err))
})

//PUT
router.put('/activities/:activityID', isAuthenticated, (req, res, next) => {
    const {activityID} = req.params;
    if (!mongoose.Types.ObjectId.isValid(activityID)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    };    
    Activity.findById(activityID)
            .then(foundActivity => {
                if(foundActivity.createdBy.valueOf() !== req.payload._id) {
                    res.status(401).json({ message: "Wrong credentials" });
                     return;
                }
                const { name, description, duration, activityDate, location, sport } = req.body
                return Activity.findByIdAndUpdate( foundActivity._id, { name, description, duration, activityDate, location, sport }, {new: true})
                .then ((updatedActivity) => res.json(updatedActivity))
            })            
            .catch(err => console.log(err))
    
    
    // AndUpdate(activityID, { name, description, duration, activityDate, location, sport, pictures: [] }, {new: true} )

})



//DELATE

module.exports = router;