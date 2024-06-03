const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors")


app.get("/", (req, res) => {
  res.send("Hello,I am Damilare!");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const dotenv = require("dotenv");
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(bodyParser.json());

const User = require("./models/user.js");
const BlogPost = require("./models/blogPost");
const Comment = require("./models/comment");
const secretKey = "yeyesemure";

// User registration and authentication

app.post("/api/users/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(req.body)
  const user = new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  user
    .save()
    .then((user) => {
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token, user });
    })
    .catch((err) => res.status(400).json(err));
});

app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
  res.json({ token, user });
});

// (Routes for user registration and login go here)

function authenticateUser(req, res, next) {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token is missing." });
  }
  token = token.split(" ")[1];
  try {
    const verified = jwt.verify(token, secretKey);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
}

// Middleware to authenticate user
app.post("/api/blogposts", authenticateUser, (req, res) => {
  const { title, content, tags } = req.body;
  const blogPost = new BlogPost({
    title,
    content,
    tags,
    author: req.user.userId,
  }); //passing author id
  blogPost
    .save()
    .then((blogPost) => res.json(blogPost))
    .catch((err) => res.status(400).json(err));
});

app.get("/api/blogposts", (req, res) => {
  const query = req.query;
  BlogPost.find(query)
    .populate("author")
    .then((posts) => res.json(posts))
    .catch((err) => res.status(400).json(err));
});

app.get("/api/blogposts/:id", (req, res) => {
  BlogPost.findById(req.params.id)
    .populate("author")
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json(err));
});

app.patch("/api/blogposts/:id", authenticateUser, (req, res) => {
  BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((post) => res.json(post))
    .catch((err) => res.status(400).json(err));
});

app.delete("/api/blogposts/:id", authenticateUser, (req, res) => {
  BlogPost.findByIdAndRemove(req.params.id)
    .then(() => res.json({ message: "Post deleted" }))
    .catch((err) => res.status(400).json(err));
});

app.post("/api/comments", authenticateUser, (req, res) => {
  const { text, blogPost } = req.body;
  const comment = new Comment({ commenter: req.user.userId, text, blogPost });
  comment
    .save()
    .then((comment) => res.json(comment))
    .catch((err) => res.status(400).json(err));
});

app.get("/api/comments", (req, res) => {
  Comment.find()
    .populate("blogPost")
    .then((comments) => res.json(comments))
    .catch((err) => res.status(400).json(err));
});

app.get("/api/comments/:id", (req, res) => {
  Comment.findById(req.params.id)
    .populate("blogPost")
    .then((comment) => res.json(comment))
    .catch((err) => res.status(400).json(err));
});

app.put("/api/comments/:id", authenticateUser, (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((comment) => res.json(comment))
    .catch((err) => res.status(400).json(err));
});

app.delete("/api/comments/:id", authenticateUser, (req, res) => {
  Comment.findByIdAndRemove(req.params.id)
    .then(() => res.json({ message: "Comment deleted" }))
    .catch((err) => res.status(400).json(err));
});

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
