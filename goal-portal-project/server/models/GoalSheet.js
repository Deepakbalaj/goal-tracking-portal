import mongoose from "mongoose";

const goalSheetSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },
    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "rework", "rejected", "locked"],
      default: "draft",
    },
    submittedAt: Date,
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    unlockedUntil: Date,
  },
  { timestamps: true }
);

goalSheetSchema.index({ employee: 1, cycle: 1 }, { unique: true });

export default mongoose.model("GoalSheet", goalSheetSchema);
