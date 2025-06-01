import express from "express";
import { getForumPosts, getForumPostById, createForumPost, updateForumPost, deleteForumPost, addForumComment, updateForumComment, getForumComments, toggleForumPostLike, deleteForumComment, getCatagories, likeForumComment, } from "../controllers/forumControllers.js";
import { verifyToken, authenticate } from "../middelware/authMiddelware.js";
const router = express.Router();
router.get("/", getForumPosts); //public route to get all forum posts
router.get("/:id", verifyToken, authenticate, getForumPostById); //public route to get a specific forum post by ID
router.post("/posts", verifyToken, authenticate, createForumPost); //admin route to create a new forum post
router.put("/updatepost/:id", verifyToken, authenticate, updateForumPost);
router.delete("/posts/:postId", verifyToken, authenticate, deleteForumPost); //admin route to delete a forum post
router.post("/addcomment/:postId", verifyToken, authenticate, addForumComment); //public route to add a comment to a forum post
router.put("/comments/:commentId", verifyToken, authenticate, updateForumComment); //public route to update a comment on a forum pos
router.get("/comments/:postId", verifyToken, authenticate, getForumComments); //public route to get comments for a specific forum post
router.post("/like/:postId", verifyToken, authenticate, toggleForumPostLike); //public route to like or unlike a forum post
router.delete("/comments/:commentId", verifyToken, authenticate, deleteForumComment); //public route to delete a comment on a forum post
router.post('/comments/like/:commentId', verifyToken, authenticate, likeForumComment); //public route to get a specific comment by ID
export default router;
//# sourceMappingURL=forumRoutes.js.map