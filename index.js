const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000",  // React frontend URL
  credentials: true                 // allow cookies / auth headers
}));

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api', userRoutes);

// start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));

