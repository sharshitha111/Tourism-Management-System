const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/UserRoutes");
const route = require("./Routes/ProfileRoutes");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const JWT_SECRET = "your_secret_key_here";
const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/users", router);
app.use("/regi", route);

mongoose
  .connect("mongodb+srv://admin:dEUc6939TtMKezRM@cluster0.sepzjhs.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000);
  })
  .catch((err) => console.log(err));

// Call Register Model
require("./Model/Register");
const User = mongoose.model("Register");

app.post("/register", async (req, res) => {
  const { Firstname, Lastname, Age, Country, Email, Password } = req.body;
  const encryptedPassword = await bcrypt.hash(Password, 10);

  try {
    const oldUser = await User.findOne({ Email });
    if (oldUser) {
      return res.status(400).json({ err: "User exists" });
    }
    const newUser = new User({
      Firstname,
      Lastname,
      Age,
      Country,
      Email,
      Password: encryptedPassword,
    });
    await newUser.save();
    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    // User authenticated, generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "5h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/userdeta", async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ status: "ok", data: user });
    } else {
      res.status(404).json({ status: "error", data: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(401).json({ status: "error", data: "Invalid token" });
  }
});

app.put("/userdeta", async (req, res) => {
  const { token, updates } = req.body;
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (updatedUser) {
      res.status(200).json({ status: "ok", data: updatedUser });
    } else {
      res.status(404).json({ status: "error", data: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", data: err.message });
  }
});

app.delete("/userdeta", async (req, res) => {
  const { token } = req.body;
  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (deletedUser) {
      res.status(200).json({ status: "ok", data: "User deleted successfully" });
    } else {
      res.status(404).json({ status: "error", data: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", data: err.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { Email } = req.body;
  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate password reset token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create password reset URL
    const resetURL = `http://localhost:3000/reset-password?token=${token}`;

    // Send email using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sharshithab2021@gmail.com",
        pass: "uqvu ewol guih hges",
      },
    });

    const mailOptions = {
      from: "sharshithab2021@gmail.com",
      to: "sharshitharules11@gmail.com",
      subject: "Password Reset Request",
      text: `http://localhost:3000/reset-password/${user._id}/${token}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Password reset link sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Update the user's password
    user.Password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
