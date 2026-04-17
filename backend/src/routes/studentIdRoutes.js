const express = require("express");
const { protect } = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const { createStudentId, getRegisteredStudents, deleteStudent } = require("../controllers/studentIdController");

const router = express.Router();

router.post("/", protect, requireRole("warden"), createStudentId);
router.get("/", protect, requireRole("warden"), getRegisteredStudents);
router.delete("/:id", protect, requireRole("warden"), deleteStudent);


module.exports = router;

