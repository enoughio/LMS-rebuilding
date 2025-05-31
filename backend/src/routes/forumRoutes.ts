import express from "express";
import {
  getForumPosts,
  getForumPostById,
  createForumPost,
  updateForumPost,
  deleteForumPost,
  addForumComment,
  updateForumComment,
  getForumComments,
  toggleForumPostLike,
  deleteForumComment,
} from "../controllers/forumControllers.js";
import { authenticate, authorizeRoles, verifyToken } from "../middleware/authMiddelware.js";
import { UserRole } from "../../generated/prisma/index.js";

const router = express.Router();

router.get("/", getForumPosts);  //public route to get all forum posts
router.get("/:id", verifyToken, authenticate, getForumPostById);  //public route to get a specific forum post by ID
router.post("/addpost", verifyToken, authenticate, authorizeRoles(UserRole.ADMIN), createForumPost);  //admin route to create a new forum post
router.put("/updatepost/:id", verifyToken, authenticate, authorizeRoles(UserRole.ADMIN), updateForumPost);  //admin route to update a forum post
router.delete("/deletepost/:id", verifyToken, authenticate, authorizeRoles(UserRole.ADMIN), deleteForumPost);  //admin route to delete a forum post
router.post("/addcomment/:postId", verifyToken, authenticate, addForumComment);  //public route to add a comment to a forum post
router.put("/updatecomment/:commentId", verifyToken, authenticate, updateForumComment);  //public route to update a comment on a forum post
router.get("/comments/:postId", verifyToken, authenticate, getForumComments);  //public route to get comments for a specific forum post
router.post("/like/:postId", verifyToken, authenticate, toggleForumPostLike);  //public route to like or unlike a forum post
router.delete("/deletecomment/", verifyToken, authenticate, deleteForumComment);  //public route to delete a comment on a forum post

export default router;
