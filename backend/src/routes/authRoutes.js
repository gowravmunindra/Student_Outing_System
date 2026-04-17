const express = require("express");
const { registerWarden, loginWarden, loginStudent } = require("../controllers/authController");

const router = express.Router();

// Warden
router.post("/warden/register", registerWarden);
router.post("/warden/login", loginWarden);

// Student
router.post("/student/login", loginStudent);

module.exports = router;

