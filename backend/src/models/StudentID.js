const mongoose = require("mongoose");

const studentIdSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    branch: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    isUsed: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const StudentID = mongoose.model("StudentID", studentIdSchema);
module.exports = StudentID;

