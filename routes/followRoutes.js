const express = require("express");
const router = express.Router();

const followController =
    require("../controllers/followController");

const isAuthenticated =
    require("../middleware/authMiddleware");

router.post(
    "/:userId",
    isAuthenticated,
    followController.toggleFollow
);

module.exports = router;