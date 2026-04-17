const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true },
    outingDate: { type: Date, required: true },
    outTime: { type: String, required: true, trim: true },
    returnDate: { type: Date, required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true }
);

requestSchema.index({ student: 1, createdAt: -1 });

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;

