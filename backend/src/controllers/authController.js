const { z } = require("zod");
const User = require("../models/User");
const StudentID = require("../models/StudentID");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");

const wardenRegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

const wardenLoginSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
});

const studentLoginSchema = z.object({
  name: z.string().min(1),
  rollNo: z.string().min(1),
  studentId: z.string().min(1),
});

const registerWarden = asyncHandler(async (req, res) => {
  const parsed = wardenRegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });

  const { name, email, password } = parsed.data;

  const existingByName = await User.findOne({ role: "warden", name: name.trim() });
  if (existingByName) return res.status(409).json({ message: "Warden name already registered" });

  const existingByEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingByEmail) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password, role: "warden" });
  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const loginWarden = asyncHandler(async (req, res) => {
  const parsed = wardenLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });

  const { name, password } = parsed.data;
  const user = await User.findOne({ role: "warden", name: name.trim() }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

const loginStudent = asyncHandler(async (req, res) => {
  const parsed = studentLoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });

  const { name, rollNo, studentId } = parsed.data;

  const idDoc = await StudentID.findOne({ studentId });
  if (!idDoc) return res.status(401).json({ message: "Invalid credentials" });
  if (idDoc.rollNo !== rollNo.trim()) return res.status(401).json({ message: "Invalid credentials" });
  if (idDoc.name.toLowerCase() !== name.trim().toLowerCase()) return res.status(401).json({ message: "Invalid credentials" });

  let user = await User.findOne({ role: "student", studentId });
  if (!user) {
    user = await User.create({
      role: "student",
      name: idDoc.name,
      email: idDoc.email,
      studentId: idDoc.studentId,
    });
  }

  const token = signToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId },
  });
});

module.exports = { registerWarden, loginWarden, loginStudent };

