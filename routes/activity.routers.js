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
    //console.log(createdBy)
    if (name === '' || activityDate === '' || location === '') {
        res.status(400).json({ message: "Provide name, date and place." });
        return;
      } 
      Activity.create({ name, description, duration, activityDate, location, sport, createdBy, member: [], pictures: [] })
        .then(activity => {               
            return User.findByIdAndUpdate(createdBy, { $push: { userActivities: activity._id }}, { new: true })
            .then (() => {
                return Sport.findByIdAndUpdate(sport, { $push: { activities: activity._id }}, { new: true })
            })          
        })        
        .then((response) => res.json(response))
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


router.put('/activities/:activityID', isAuthenticated, (req, res, next) => {
    const { activityID } = req.params;
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
                // Sport.findByIdAndUpdate(foundActivity.sport, { $pull: { activities: activityID } }, {new: true} )
                    //.then((res)=> console.log('yy', res ))
                const { name, description, duration, activityDate, location, sport } = req.body
                return Activity.findByIdAndUpdate( foundActivity._id, { name, description, duration, activityDate, location, sport }, {new: true})
                .then ((updatedActivity) => {
                    // Sport.findByIdAndUpdate(updatedActivity.sport, { $push: { activities: updatedActivity._id }}, { new: true })
                       // .then((res)=> console.log('xxx', res ))
                    return res.json(updatedActivity)                   
                    
                })
            })            
            .catch(err => console.log(err))
})


router.delete('/activities/:activityID', isAuthenticated, (req,res) => {
    const { activityID } = req.params;
    if (!mongoose.Types.ObjectId.isValid(activityID)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
    };
    Activity.findById(activityID)
            .then(foundActivity => {
                if(foundActivity.createdBy.valueOf() !== req.payload._id && req.payload.isAdmin === false ) {
                    res.status(401).json({ message: "Wrong credentials" });
                     return;
                }
                Activity.findByIdAndRemove(activityID)
                .then((activity) => { 
                    return User.findByIdAndUpdate(activity.createdBy, { $pull: { userActivities: activityID } }, {new: true} )
                    .then(() => Sport.findByIdAndUpdate(activity.sport, { $pull: { activities: activityID } }, {new: true} ) )
                })
                .then (() =>  res.json({message: `Activity was successfully deleted`}))           
              
            })
            .catch(err => console.log(err))
})


module.exports = router;
