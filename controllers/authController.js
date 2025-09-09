const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Please provide all requested fields" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userService.createUser(fullname, email, hashedPassword);

    res.status(201).json({ message: "User registered successfully", userId });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }
 
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let role = 'user';
    if(user.user_type === 2){
      role = 'admin';
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role },
        process.env.JWT_SECRET || "mytemporarysecretkey",
      { expiresIn: "15m" }
    );
    // store JWT in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,       // prevent JS access
      secure: false,         // only over HTTPS
      sameSite: "lax",   // CSRF protection
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.json({
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "No session" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });  // decoded has userId, email, role
  } catch (err) {
    return res.status(401).json({ msg: "Invalid session" });
  }
};

exports.logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: "lax",
    });

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};