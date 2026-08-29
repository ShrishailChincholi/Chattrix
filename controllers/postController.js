const Post = require("../models/Post");
const Comment = require("../models/Comment");

// ============= HELPER FUNCTIONS =============

// Extract direct image URL from various sources
function processImageUrl(url) {
    if (!url) return "";
    
    // Handle Bing image search URLs
    if (url.includes('bing.com/images/search')) {
        // Try to extract mediaurl parameter
        const mediaUrlMatch = url.match(/mediaurl=([^&]+)/);
        if (mediaUrlMatch) {
            try {
                const decodedUrl = decodeURIComponent(mediaUrlMatch[1]);
                // Check if it's a valid image URL
                if (decodedUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)/i)) {
                    return decodedUrl;
                }
            } catch (e) {
                console.error("Failed to decode Bing URL:", e);
            }
        }
        
        // Try to extract from thid parameter (thumbnail)
        const thidMatch = url.match(/thid=([^&]+)/);
        if (thidMatch) {
            try {
                const decodedThumb = decodeURIComponent(thidMatch[1]);
                if (decodedThumb.match(/\.(jpg|jpeg|png|gif)/i)) {
                    return decodedThumb;
                }
            } catch (e) {
                console.error("Failed to decode Bing thumbnail:", e);
            }
        }
        
        // If extraction fails, return the original URL
        return url;
    }
    
    // Handle Google Drive links
    if (url.includes('drive.google.com')) {
        let fileId = null;
        
        // Pattern: /d/XXXXX/view
        const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1) fileId = match1[1];
        
        // Pattern: id=XXXXX
        const match2 = url.match(/id=([a-zA-Z0-9_-]+)/);
        if (match2) fileId = match2[1];
        
        // Pattern: /file/d/XXXXX/view
        const match3 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match3) fileId = match3[1];
        
        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
    }
    
    // Handle Google Photos
    if (url.includes('photos.google.com')) {
        // Google Photos direct link - may not work directly
        return url;
    }
    
    // Handle Pinterest
    if (url.includes('pinterest.com')) {
        // Pinterest links need to be extracted
        // If it's a direct pinimg.com URL, return as is
        if (url.includes('pinimg.com')) {
            return url;
        }
        return url;
    }
    
    // Handle Instagram
    if (url.includes('instagram.com')) {
        // Instagram links need special handling
        return url;
    }
    
    return url;
}

// ============= HOME PAGE =============
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

// ============= SHOW CREATE POST PAGE =============
exports.getCreatePost = (req, res) => {
    res.render("posts/create-post", {
        title: "Create Post"
    });
};

// ============= CREATE POST =============
exports.createPost = async (req, res) => {
    try {
        const { caption, image } = req.body;

        if (!caption?.trim() && !image?.trim()) {
            req.flash("error", "Please add a caption or image.");
            return res.redirect("/posts/create");
        }

        // Process the image URL to extract direct image
        let processedImage = image?.trim() || "";
        if (processedImage) {
            processedImage = processImageUrl(processedImage);
        }

        await Post.create({
            user: req.session.user._id,
            caption: caption?.trim() || "",
            image: processedImage
        });

        req.flash("success", "Your post has been published!");
        res.redirect("/home");

    } catch (error) {
        console.error("Create Post Error:", error);
        req.flash("error", "Unable to create post.");
        res.redirect("/posts/create");
    }
};

// ============= POST DETAILS =============
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

// ============= SHOW EDIT POST PAGE =============
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
            req.flash("error", "You cannot edit this post.");
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

// ============= UPDATE POST =============
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
            req.flash("error", "Unauthorized action.");
            return res.redirect("/home");
        }

        const { caption, image } = req.body;

        post.caption = caption?.trim() || "";
        
        // Process the image URL to extract direct image
        let processedImage = image?.trim() || "";
        if (processedImage) {
            processedImage = processImageUrl(processedImage);
        }
        post.image = processedImage;

        await post.save();

        req.flash("success", "Post updated successfully!");
        res.redirect(`/posts/${post._id}`);

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};

// ============= DELETE POST =============
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
            req.flash("error", "You cannot delete this post.");
            return res.redirect("/home");
        }

        await Comment.deleteMany({
            post: post._id
        });

        await Post.findByIdAndDelete(post._id);

        req.flash("success", "Post deleted successfully.");
        res.redirect("/home");

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};

// ============= LIKE / UNLIKE POST =============
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

// ============= ADD COMMENT =============
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            req.flash("error", "Comment cannot be empty.");
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

// ============= EXPLORE PAGE =============
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