require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MOGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINRARY_NAME,
  api_key: process.env.CLOUDINARY_API_PUBLIC,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Welcome to vinted" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  try {
    return res.status(404).json("Not found");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
