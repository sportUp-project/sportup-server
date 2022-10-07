const express = require("express");
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");
const Sport = require("../models/Sport.model");
const fileUploader = require("../config/cloudinary.config");

const {
  isAuthenticated,
  checkAdmin,
} = require("./../middleware/jwt.middleware.js");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/allUsers", isAuthenticated, (req, res) => {
  User.find()
    .then((foundUsers) => res.json( foundUsers ))
    .catch(err => console.log(err))
});


router.post("/upload", fileUploader.single("image"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ fileUrl: req.file.path });
});

router.get("/:userId", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "User do not exist" });
    return;
  }
  User.findById(userId)
    .populate("sports")
    .populate({
      path: "joinedActivities",
      populate: [
        {
          path: "sport",
          model: "Sport",
        },
        {
          path: "members",
          model: "User",
        },
        {
          path: "createdBy",
          model: "User",
        },
      ],
    })
    .populate({
      path: "userActivities",
      populate: [
        {
          path: "sport",
          model: "Sport",
        },
        {
          path: "members",
          model: "User",
        },
        {
          path: "createdBy",
          model: "User",
        },
      ],
    })
    .populate("follows", "_id image name")
    .populate("followers", "_id image name")
    .then((foundUser) => {
      const {
        email,
        name,
        _id,
        isAdmin,
        image,
        description,
        sports,
        userActivities,
        joinedActivities,
        follows,
        followers,
      } = foundUser;
      const user = {
        email,
        name,
        _id,
        isAdmin,
        image,
        description,
        sports,
        userActivities,
        joinedActivities,
        follows,
        followers,
      };
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err));
});

router.get("/:userId/following", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "User do not exist" });
    return;
  }
  User.findById(userId)
    .populate(
      "follows",
      "_id name image sports userActivities joinedActivities"
    )
    .populate({
      path: "follows",
      populate: [
        {
          path: "sports",
          model: "Sport",
        },
        {
          path: "joinedActivities",
          populate: [{
            path: "sport",
            model: "Sport"
          },{
            path: "createdBy",
            model: "User"
          },{

              path:'members',
              model:'User'
            }
        ],
          model: "Activity",
        },
        {
          path: "userActivities",
          populate: [{
            path: "sport",
            model: "Sport"
          },{
            path: "createdBy",
            model: "User"
          },{

              path:'members',
              model:'User'
            }
        ],
          model: "Activity",
        },
      ],
    })
    .then((foundUser) => {
      const {
        email,
        name,
        _id,
        isAdmin,
        image,
        follows,
        followers,
        sports,
        userActivities,
        joinedActivities,
      } = foundUser;
      const user = {
        email,
        name,
        _id,
        isAdmin,
        image,
        follows,
        followers,
        sports,
        userActivities,
        joinedActivities,
      };
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err));
});

router.put("/:userId", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "User do not exist" });
    return;
  }
  if (userId !== req.payload._id) {
    res.status(401).json({ message: "Wrong credentials" });
    return;
  }
  const { name, image, description, sports } = req.body;
  console.log(req.body);
  const convertedSposrts = sports.map((sport) =>
    mongoose.Types.ObjectId(sport)
  );
  User.findByIdAndUpdate(
    userId,
    { name, image, description, sports: convertedSposrts },
    { new: true }
  )
    .then((updatedUser) => res.json(updatedUser))
    .catch((err) => next(err));
});

//path to add to a friend when in the other user profil
// AUTHORIZATION DO NOT WORK WHEN CONNECTDRD WITH CLIENT SIDE
router.put("/:userId/follow", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  const authID = req.payload._id; //req.payload._id
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "User do not exist" });
    return;
  }
  if (userId === authID) {
    res.status(400).json({ message: `Logged user-wrong request` });
    return;
  }
  User.findByIdAndUpdate(authID, { $push: { follows: userId } }, { new: true })
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { $push: { followers: authID } },
        { new: true }
      )
        .populate("followers", '_id name image')
        .populate("sports")
        .populate({path: 'joinedActivities',
        populate: [
            {
                path: "sport",
                model: "Sport"
            },
            {
                path: 'members', 
                model: 'User'
            }
        ] })
        .populate({path: 'userActivities',
            populate: [
                {
                    path: "sport",
                    model: "Sport"
                },
                {
                    path: 'members', 
                    model: 'User'
                }
            ] })
        .then((updatedUser) => {
          res.json(updatedUser);
        });
    })
    .catch((err) => console.log(err));
});
//path to add to a friend when in the other user profil
router.put("/:userId/unfollow", isAuthenticated, (req, res, next) => {
  const { userId } = req.params;
  const authID = req.payload._id; //req.payload._id
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "User do not exist" });
    return;
  }
  if (userId === authID) {
    res.status(400).json({ message: `Logged user-wrong request` });
    return;
  }
  User.findByIdAndUpdate(authID, { $pull: { follows: userId } }, { new: true })
    .then(() => {
      User.findByIdAndUpdate(
        userId,
        { $pull: { followers: authID } },
        { new: true }
      )
        .populate("followers", '_id name image')
        .populate("sports")
        .populate({path: 'joinedActivities',
            populate: [
                {
                    path: "sport",
                    model: "Sport"
                },
                {
                    path: 'members', 
                    model: 'User'
                }
            ] })
        .populate({path: 'userActivities',
        populate: [
            {
                path: "sport",
                model: "Sport"
            },
            {
                path: 'members', 
                model: 'User'
            }
        ] })
        .then((updatedUser) => res.json(updatedUser));
    })
    .catch((err) => console.log(err));
});

// Delate the users arctivities from another users joinedactivities
router.delete("/:userId", isAuthenticated, checkAdmin, (req, res) => {
  const { userId } = req.params;
  User.findByIdAndRemove(userId)
    .then((user) => {

      const removeActivities = Activity.deleteMany({
        _id: user.userActivities,
      });

      const sportActivities = user.userActivities.map((activity) => {

        Sport.findOneAndUpdate(
          { activities: activity },
          { $pull: { activities: activity } }
        ).then((s) => console.log(s)); //
      });

      return Promise.all([removeActivities, sportActivities]).then(() =>
        res.json({ message: `User was successfully deleted` })
      );
    })
    .catch((err) => console.log(err));
});




module.exports = router;
