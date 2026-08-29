const express = require("express");
const router = express.Router();

const postController =
    require("../controllers/postController");

const isAuthenticated =
    require("../middleware/authMiddleware");


// IMPORTANT:
// Put specific routes BEFORE /:id

router.get(
    "/create",
    isAuthenticated,
    postController.getCreatePost
);

router.post(
    "/create",
    isAuthenticated,
    postController.createPost
);

router.get(
    "/explore/all",
    postController.getExplore
);

router.get(
    "/:id/edit",
    isAuthenticated,
    postController.getEditPost
);

router.post(
    "/:id/edit",
    isAuthenticated,
    postController.updatePost
);

router.post(
    "/:id/delete",
    isAuthenticated,
    postController.deletePost
);

router.post(
    "/:id/like",
    isAuthenticated,
    postController.toggleLike
);

router.post(
    "/:id/comment",
    isAuthenticated,
    postController.addComment
);

router.get(
    "/:id",
    postController.getPostDetails
);

module.exports = router;