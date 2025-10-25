import express from "express";
import Post from "../models/Post.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const posts = await Post.find().populate("author", "name");
  res.json(posts);
});

router.post("/", protect, async (req, res) => {
  const { title, content, category } = req.body;
  const post = await Post.create({ title, content, category, author: req.user._id });
  res.json(post);
});

router.put("/:id", protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });

  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });
  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

export default router;
