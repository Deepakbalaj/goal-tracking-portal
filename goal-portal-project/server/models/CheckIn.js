import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    sentiment: { type: String, enum: ["support", "risk", "recognition"], default: "support" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const checkInSchema = new mongoose.Schema(
  {
    goal: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },
    quarter: { type: String, enum: ["q1", "q2", "q3", "q4"], required: true },
    actual: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["not_started", "on_track", "completed"],
      default: "not_started",
    },
    completedAt: Date,
    comments: [commentSchema],
  },
  { timestamps: true }
);

checkInSchema.index({ goal: 1, quarter: 1 }, { unique: true });

export default mongoose.model("CheckIn", checkInSchema);
