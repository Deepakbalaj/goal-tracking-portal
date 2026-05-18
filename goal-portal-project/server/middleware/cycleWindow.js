import Cycle from "../models/Cycle.js";

export function requireActiveWindow(phaseParam = "quarter") {
  return async (req, res, next) => {
    const phase = req.params[phaseParam] || req.body[phaseParam] || req.query[phaseParam];
    const cycle = await Cycle.findById(req.body.cycle || req.query.cycle || req.params.cycleId);
    if (!cycle) return res.status(404).json({ message: "Cycle not found." });

    const now = new Date();
    const window = cycle.windows.find((item) => item.name === phase);
    if (!window || now < window.opensAt || now > window.closesAt) {
      return res.status(403).json({ message: `${phase} updates are outside the active window.` });
    }

    req.cycle = cycle;
    next();
  };
}
