import mongoose from "mongoose";

const sharedGoalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    thrustArea: { type: String, required: true },
    description: { type: String, required: true },
    uomType: {
      type: String,
      enum: ["numeric", "percentage", "timeline", "zero_based"],
      required: true,
    },
    measurementType: { type: String, enum: ["min", "max", "timeline", "zero_based"], required: true },
    target: { type: Number, required: true },
    deadline: Date,
    primaryOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("SharedGoal", sharedGoalSchema);
