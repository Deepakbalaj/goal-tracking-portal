import mongoose from "mongoose";

const windowSchema = new mongoose.Schema(
  {
    name: { type: String, enum: ["goal_setting", "q1", "q2", "q3", "q4"], required: true },
    opensAt: { type: Date, required: true },
    closesAt: { type: Date, required: true },
  },
  { _id: false }
);

const cycleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fiscalYear: { type: String, required: true },
    status: { type: String, enum: ["draft", "active", "closed"], default: "active" },
    windows: [windowSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cycle", cycleSchema);
