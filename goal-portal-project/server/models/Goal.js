import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    sheet: { type: mongoose.Schema.Types.ObjectId, ref: "GoalSheet", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", required: true },
    sharedGoal: { type: mongoose.Schema.Types.ObjectId, ref: "SharedGoal" },
    isShared: { type: Boolean, default: false },
    isPrimaryOwner: { type: Boolean, default: false },
    thrustArea: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    uomType: {
      type: String,
      enum: ["numeric", "percentage", "timeline", "zero_based"],
      required: true,
    },
    measurementType: { type: String, enum: ["min", "max", "timeline", "zero_based"], required: true },
    target: { type: Number, required: true },
    weightage: { type: Number, required: true, min: 10, max: 100 },
    deadline: Date,
    status: {
      type: String,
      enum: ["not_started", "on_track", "completed"],
      default: "not_started",
    },
    locked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

goalSchema.index({ employee: 1, cycle: 1 });

export default mongoose.model("Goal", goalSchema);
