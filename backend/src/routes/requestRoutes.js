const express = require("express");
const { protect } = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/requestController");

const router = express.Router();

// Student
router.post("/", protect, requireRole("student"), createRequest);
router.get("/my", protect, requireRole("student"), getMyRequests);

// Warden
router.get("/", protect, requireRole("warden"), getAllRequests);
router.put("/:id/approve", protect, requireRole("warden"), approveRequest);
router.put("/:id/reject", protect, requireRole("warden"), rejectRequest);

module.exports = router;

