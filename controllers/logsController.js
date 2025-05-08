const Log = require("../models/Logs");

exports.getLogs = async(req,res) => {
    try {
        const logs = await Log.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json(logs);
      } catch (err) {
        res.status(500).json({ message: "Error fetching logs", error: err });
      }
}

exports.createLogs = async(req,res) => {
    try {
        const { action } = req.body;
        const log = new Log({ userId: req.user.id, action });
        await log.save();
        res.status(201).json(log);
      } catch (err) {
        res.status(500).json({ message: "Error saving log", error: err });
      }
}