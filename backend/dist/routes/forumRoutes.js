"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const forumControllers_js_1 = require("../controllers/forumControllers.js");
const authMiddelware_js_1 = require("../middelware/authMiddelware.js");
const router = express_1.default.Router();
router.get("/", forumControllers_js_1.getForumPosts); //public route to get all forum posts
router.get("/categories", forumControllers_js_1.getCatagories); //public route to get forum posts by category
router.get("/:id", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.getForumPostById); //public route to get a specific forum post by ID
router.post("/posts", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.createForumPost); //admin route to create a new forum post
router.put("/updatepost/:id", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.updateForumPost);
router.delete("/posts/:postId", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.deleteForumPost); //admin route to delete a forum post
router.post("/addcomment/:postId", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.addForumComment); //public route to add a comment to a forum post
router.put("/comments/:commentId", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.updateForumComment); //public route to update a comment on a forum pos
router.get("/comments/:postId", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.getForumComments); //public route to get comments for a specific forum post
router.post("/like/:postId", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.toggleForumPostLike); //public route to like or unlike a forum post
router.delete("/comments/:commentId", authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.deleteForumComment); //public route to delete a comment on a forum post
router.post('/comments/like/:commentId', authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, forumControllers_js_1.likeForumComment); //public route to get a specific comment by ID
exports.default = router;
//# sourceMappingURL=forumRoutes.js.map