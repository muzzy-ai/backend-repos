import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Tidak Ada" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Password Salah" });
    }

    // Check for admin credentials
    if (email === "admin123@gmail.com" && password === "admin234") {
      return res.json({
        success: true,
        token: createToken(user._id),
        adminRedirect: "http://localhost:5174/orders",
      });
    }

    const token = createToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    // memeriksa apakah pengguna sudah ada
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Telah Ada" });
    }

    // memvalidasi format email dan kata sandi yang kuat
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Silakan Masukkan Email yang Valid",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Silakan Masukkan Kata Sandi yang Kuat",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { loginUser, registerUser };
