const crypto = require("crypto");
const { z } = require("zod");
const StudentID = require("../models/StudentID");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const createStudentIdSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  branch: z.string().min(1),
  rollNo: z.string().min(1),
  age: z.coerce.number().int().positive(),
});

function generateId(rollNo, age) {
  // uses rollNo + age, but still keeps uniqueness with randomness
  // e.g. SOS-21CS101-19-7F3A1C
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `SOS-${String(rollNo).toUpperCase()}-${String(age)}-${suffix}`;
}

const createStudentId = asyncHandler(async (req, res) => {
  const parsed = createStudentIdSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });

  const { name, email, branch, rollNo, age } = parsed.data;

  let doc;
  for (let i = 0; i < 6; i += 1) {
    const studentId = generateId(rollNo, age);
    // eslint-disable-next-line no-await-in-loop
    const exists = await StudentID.findOne({ studentId });
    if (exists) continue;
    // eslint-disable-next-line no-await-in-loop
    doc = await StudentID.create({
      studentId,
      name,
      email,
      branch,
      rollNo,
      age,
      isUsed: true,
    });
    break;
  }

  if (!doc) return res.status(500).json({ message: "Failed to generate unique studentId" });

  // Create student user record (for requests ownership) if not exists
  const existingUser = await User.findOne({ role: "student", studentId: doc.studentId });
  if (!existingUser) {
    await User.create({
      role: "student",
      name: doc.name,
      email: doc.email,
      studentId: doc.studentId,
    });
  }

  res.status(201).json(doc);
});

const getRegisteredStudents = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const filter = {};

  if (q && String(q).trim()) {
    const regex = new RegExp(String(q).trim(), "i");
    filter.$or = [
      { name: regex },
      { rollNo: regex },
      { email: regex },
      { studentId: regex },
      { branch: regex },
    ];
  }

  const students = await StudentID.find(filter).sort({ createdAt: -1 });
  res.json(students);
});

const deleteStudent = asyncHandler(async (req, res) => {
  const doc = await StudentID.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ message: "Student not found" });

  // Also remove the associated User record so they can no longer log in
  const deletedUser = await User.findOneAndDelete({ role: "student", studentId: doc.studentId });

  const Request = require("../models/Request");
  
  // If the user was found and deleted, delete all their associated requests
  if (deletedUser) {
    await Request.deleteMany({ student: deletedUser._id });
  } else {
    // If the user somehow doesn't exist, use the rollNo from the ID document to remove any orphaned requests
    await Request.deleteMany({ rollNo: doc.rollNo });
  }

  res.json({ message: "Student and associated requests deleted successfully" });
});

module.exports = { createStudentId, getRegisteredStudents, deleteStudent };

