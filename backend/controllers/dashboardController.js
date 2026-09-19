import { findAllRecords, getStats } from "../models/recordModel.js";

export function getDashboard(_req, res) {
  const stats = getStats();

  res.json({
    success: true,
    stats,
    recentRecords: findAllRecords().slice(0, 5)
  });
}
