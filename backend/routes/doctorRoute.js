
import express from "express";
import multer from "multer";
import { addDoctor } from "../controllers/adminController.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// route with multer middleware
router.post("/add-doctor", upload.single("image"), addDoctor);

export default router;