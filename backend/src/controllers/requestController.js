const { z } = require("zod");
const Request = require("../models/Request");
const asyncHandler = require("../utils/asyncHandler");

const createRequestSchema = z.object({
  name: z.string().min(1),
  branch: z.string().min(1),
  rollNo: z.string().min(1),
  outingDate: z.coerce.date(),
  outTime: z.string().min(1),
  returnDate: z.coerce.date(),
  reason: z.string().min(1),
}).refine((data) => data.returnDate >= data.outingDate, {
  message: "Return date must be on or after outing date",
  path: ["returnDate"],
});

const rejectSchema = z.object({
  reason: z.string().min(1),
});

const createRequest = asyncHandler(async (req, res) => {
  const parsed = createRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });

  const request = await Request.create({
    student: req.user._id,
    ...parsed.data,
    status: "pending",
    rejectionReason: undefined,
  });

  res.status(201).json(request);
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(requests);
});

// Warden
const getAllRequests = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status && ["pending", "approved", "rejected"].includes(status)) filter.status = status;

  const requests = await Request.find(filter)
    .populate("student", "name email studentId")
    .sort({ createdAt: -1 });

  const validRequests = requests.filter(r => r.student != null);

  res.json(validRequests);
});

const approveRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "approved";
  request.rejectionReason = undefined;
  await request.save();

  res.json(request);
});

const rejectRequest = asyncHandler(async (req, res) => {
  const parsed = rejectSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Rejection reason required" });

  const request = await Request.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = "rejected";
  request.rejectionReason = parsed.data.reason;
  await request.save();

  res.json(request);
});

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
};

