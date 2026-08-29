const Post = require("../models/Post");
const Comment = require("../models/Comment");


// HOME PAGE
exports.getHome = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username avatar")
            .sort({ createdAt: -1 })
            .lean();

        for (const post of posts) {
            post.commentCount = await Comment.countDocuments({
                post: post._id
            });

            post.isLiked = false;

            if (req.session.user) {
                post.isLiked = post.likes.some(
                    (like) =>
                        like.toString() ===
                        req.session.user._id.toString()
                );
            }
        }

        res.render("home", {
            title: "Home",
            posts
        });

    } catch (error) {
        console.error("Home Error:", error);

        res.status(500).send("Server Error");
    }
};


// SHOW CREATE POST PAGE
exports.getCreatePost = (req, res) => {
    res.render("posts/create-post", {
        title: "Create Post"
    });
};


// CREATE POST
exports.createPost = async (req, res) => {
    try {
        const { caption, image } = req.body;

        if (!caption?.trim() && !image?.trim()) {
            req.flash(
                "error",
                "Please add a caption or image."
            );

            return res.redirect("/posts/create");
        }

        await Post.create({
            user: req.session.user._id,
            caption: caption?.trim() || "",
            image: image?.trim() || ""
        });

        req.flash(
            "success",
            "Your post has been published!"
        );

        res.redirect("/home");

    } catch (error) {
        console.error("Create Post Error:", error);

        req.flash(
            "error",
            "Unable to create post."
        );

        res.redirect("/posts/create");
    }
};


// POST DETAILS
exports.getPostDetails = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "username avatar")
            .lean();

        if (!post) {
            req.flash("error", "Post not found.");
            return res.redirect("/home");
        }

        const comments = await Comment.find({
            post: post._id
        })
            .populate("user", "username avatar")
            .sort({ createdAt: -1 })
            .lean();

        post.isLiked = false;

        if (req.session.user) {
            post.isLiked = post.likes.some(
                (like) =>
                    like.toString() ===
                    req.session.user._id.toString()
            );
        }

        res.render("posts/post-details", {
            title: "Post Details",
            post,
            comments
        });

    } catch (error) {
        console.error("Post Details Error:", error);

        req.flash("error", "Unable to load post.");
        res.redirect("/home");
    }
};


// SHOW EDIT POST PAGE
exports.getEditPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).lean();

        if (!post) {
            req.flash("error", "Post not found.");
            return res.redirect("/home");
        }

        if (
            post.user.toString() !==
            req.session.user._id.toString()
        ) {
            req.flash(
                "error",
                "You cannot edit this post."
            );

            return res.redirect("/home");
        }

        res.render("posts/edit-post", {
            title: "Edit Post",
            post
        });

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};


// UPDATE POST
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.redirect("/home");
        }

        if (
            post.user.toString() !==
            req.session.user._id.toString()
        ) {
            req.flash(
                "error",
                "Unauthorized action."
            );

            return res.redirect("/home");
        }

        const { caption, image } = req.body;

        post.caption = caption?.trim() || "";
        post.image = image?.trim() || "";

        await post.save();

        req.flash(
            "success",
            "Post updated successfully!"
        );

        res.redirect(`/posts/${post._id}`);

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};


// DELETE POST
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.redirect("/home");
        }

        if (
            post.user.toString() !==
            req.session.user._id.toString()
        ) {
            req.flash(
                "error",
                "You cannot delete this post."
            );

            return res.redirect("/home");
        }

        await Comment.deleteMany({
            post: post._id
        });

        await Post.findByIdAndDelete(post._id);

        req.flash(
            "success",
            "Post deleted successfully."
        );

        res.redirect("/home");

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};


// LIKE / UNLIKE POST
exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.redirect("/home");
        }

        const userId = req.session.user._id.toString();

        const alreadyLiked = post.likes.some(
            (like) => like.toString() === userId
        );

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (like) => like.toString() !== userId
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.redirect("back");

    } catch (error) {
        console.error("Like Error:", error);
        res.redirect("/home");
    }
};


// ADD COMMENT
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            req.flash(
                "error",
                "Comment cannot be empty."
            );

            return res.redirect("back");
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.redirect("/home");
        }

        await Comment.create({
            post: post._id,
            user: req.session.user._id,
            text: text.trim()
        });

        res.redirect(`/posts/${post._id}`);

    } catch (error) {
        console.error("Comment Error:", error);
        res.redirect("/home");
    }
};


// EXPLORE PAGE
exports.getExplore = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username avatar")
            .sort({ createdAt: -1 })
            .lean();

        res.render("explore", {
            title: "Explore",
            posts
        });

    } catch (error) {
        console.error("Explore Error:", error);

        res.status(500).send("Server Error");
    }
};