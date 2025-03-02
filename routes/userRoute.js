import express from "express";
import { loginUser, registerUser } from "../controllers/userController.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const userRouter = express.Router();

// Middleware untuk validasi token
const authenticate = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) return res.json({ success: false, message: "Token tidak ditemukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decoded.id);
    next();
  } catch (error) {
    return res.json({ success: false, message: "Token tidak valid" });
  }
};

// Routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Route untuk mendapatkan data user
userRouter.get("/data", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default userRouter;
