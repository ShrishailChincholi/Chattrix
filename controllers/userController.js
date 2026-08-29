const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");


// GET USER PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        }).lean();

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/home");
        }

        const posts = await Post.find({
            user: user._id
        })
            .sort({ createdAt: -1 })
            .lean();

        const followersCount =
            await Follow.countDocuments({
                following: user._id
            });

        const followingCount =
            await Follow.countDocuments({
                follower: user._id
            });

        let isFollowing = false;

        if (req.session.user) {
            const follow = await Follow.findOne({
                follower: req.session.user._id,
                following: user._id
            });

            isFollowing = !!follow;
        }

        const isOwnProfile =
            req.session.user &&
            req.session.user._id.toString() ===
            user._id.toString();

        res.render("profile/profile", {
            title: `${user.username}'s Profile`,
            user,
            posts,
            followersCount,
            followingCount,
            isFollowing,
            isOwnProfile
        });

    } catch (error) {
        console.error("Profile Error:", error);

        req.flash("error", "Unable to load profile.");
        res.redirect("/home");
    }
};


// SHOW EDIT PROFILE PAGE
exports.getEditProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        }).lean();

        if (!user) {
            return res.redirect("/home");
        }

        if (
            user._id.toString() !==
            req.session.user._id.toString()
        ) {
            req.flash(
                "error",
                "You cannot edit this profile."
            );

            return res.redirect("/home");
        }

        res.render("profile/edit-profile", {
            title: "Edit Profile",
            user
        });

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};


// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });

        if (!user) {
            return res.redirect("/home");
        }

        if (
            user._id.toString() !==
            req.session.user._id.toString()
        ) {
            req.flash(
                "error",
                "Unauthorized action."
            );

            return res.redirect("/home");
        }

        const { bio, avatar } = req.body;

        user.bio = bio?.trim() || "";

        if (avatar && avatar.trim()) {
            user.avatar = avatar.trim();
        }

        await user.save();

        req.session.user.avatar = user.avatar;

        req.flash(
            "success",
            "Profile updated successfully!"
        );

        res.redirect(`/users/${user.username}`);

    } catch (error) {
        console.error("Update Profile Error:", error);

        req.flash("error", "Unable to update profile.");

        res.redirect("/home");
    }
};


// SHOW FOLLOWERS
exports.getFollowers = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });

        if (!user) {
            return res.redirect("/home");
        }

        const followRecords = await Follow.find({
            following: user._id
        })
            .populate(
                "follower",
                "username avatar bio"
            )
            .lean();

        const followers = followRecords
            .filter((item) => item.follower)
            .map((item) => item.follower);

        res.render("profile/followers", {
            title: "Followers",
            profileUser: user,
            users: followers
        });

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};


// SHOW FOLLOWING
exports.getFollowing = async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.params.username
        });

        if (!user) {
            return res.redirect("/home");
        }

        const followRecords = await Follow.find({
            follower: user._id
        })
            .populate(
                "following",
                "username avatar bio"
            )
            .lean();

        const following = followRecords
            .filter((item) => item.following)
            .map((item) => item.following);

        res.render("profile/following", {
            title: "Following",
            profileUser: user,
            users: following
        });

    } catch (error) {
        console.error(error);
        res.redirect("/home");
    }
};