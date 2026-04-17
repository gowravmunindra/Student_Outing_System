const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      select: false,
      required: function requiredPassword() {
        return this.role === "warden";
      },
    },
    role: { type: String, enum: ["student", "warden"], default: "student" },
    studentId: { type: String, trim: true, unique: true, sparse: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function preSave() {
  if (!this.password) return;
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;

