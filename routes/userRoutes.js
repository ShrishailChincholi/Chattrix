const express = require("express");
const router = express.Router();

const userController =
    require("../controllers/userController");

const isAuthenticated =
    require("../middleware/authMiddleware");


// IMPORTANT:
// These routes MUST come before /:username

router.get(
    "/:username/edit",
    isAuthenticated,
    userController.getEditProfile
);

router.post(
    "/:username/edit",
    isAuthenticated,
    userController.updateProfile
);

router.get(
    "/:username/followers",
    userController.getFollowers
);

router.get(
    "/:username/following",
    userController.getFollowing
);


// KEEP THIS LAST
router.get(
    "/:username",
    userController.getProfile
);

module.exports = router;