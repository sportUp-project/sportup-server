const express = require("express");
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");


const { isAuthenticated, checkAdmin } = require('./../middleware/jwt.middleware.js');
const { default: mongoose } = require("mongoose");

const router = express.Router();



router.post('/upload', fileUploader.single("image"), (req, res, next) => {
    if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
      }
      res.json({ fileUrl: req.file.path });
})

router.get('/:userId', isAuthenticated, (req,res, next) => {
    const { userId  } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "User do not exist" });
        return;
    }
    User.findById(userId)
        .then((foundUser) =>  {            
            const { email, name, _id, isAdmin, image, description, sports, userActivities, joinedActivities } = foundUser;
            const user = { email, name, _id, isAdmin, image, description, sports, userActivities, joinedActivities  };
            res.status(201).json({ user: user });
        })                
        .catch(err => next(err));
})

router.put('/:userId', isAuthenticated, (req,res, next) => {
    const { userId  } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({ message: "User do not exist" });
        return;
    }
    if ( userId !== req.payload._id) {
        res.status(401).json({ message: "Wrong credentials" });
        return;
    }
    const {name, image, description, sports } = req.body
    console.log(req.body)
    const convertedSposrts = sports.split(' ').map(sport => mongoose.Types.ObjectId(sport))
    //const dbSport = Sports.findOne({ sports  }) // { _id,  }
    User.findByIdAndUpdate(userId, {name, image, description, sports: convertedSposrts  }, { new: true })
      .then((updatedUser) => res.json(updatedUser))
      .catch(err => next(err));
})


// Logic to delate the activites done by user needs to be added!
router.delete('/:userId', isAuthenticated, checkAdmin, (req,res) => {
    const { userId } = req.params;
    User.findByIdAndRemove(userId)
      .then(() => {      
            res.json({message:  `User was successfully deleted`})        
        })  
      .catch(err => console.log(err))
  })


module.exports = router;