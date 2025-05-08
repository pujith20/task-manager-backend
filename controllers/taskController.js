const mongoose = require("mongoose");
const Task = require("../models/Task");

// Helper Functions
const getNextOccurrence = (recurrence, dueDate) => {
  let nextDate;
  if (!dueDate) return null;

  const currentDate = new Date();
  let baseDate = new Date(dueDate);

  // Ensure baseDate is after currentDate for recurrence
  if (baseDate < currentDate) {
    baseDate = new Date(currentDate);
  }

  switch (recurrence) {
    case "Daily":
      nextDate = new Date(baseDate);
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "Weekly":
      nextDate = new Date(baseDate);
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "Monthly":
      nextDate = new Date(baseDate);
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return null;
  }
  return nextDate;
};

exports.createTask = async (req, res) => {
  try {
    const { isRecurring, recurrence, dueDate, ...taskData } = req.body;
    const creator = req.user.id;

    const task = await Task.create({
      ...taskData,
      creator,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      isRecurring,
      recurrence,
    });

    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  const { category, userId } = req.query;

  try {
    let tasks = [];
    if (!category || !userId) {
      tasks = await Task.find();
    } else if (category === "assigned") {
      tasks = await Task.find({ assignee: userId });
    } else if (category === "created") {
      tasks = await Task.find({ creator: userId });
    } else if (category === "overdue") {
      tasks = await Task.find({
        dueDate: { $lt: new Date() },
        assignee: userId,
      });
    }

    // Handle recurring tasks:
    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        if (task.isRecurring && task.recurrence !== "None") {
          const nextDueDate = getNextOccurrence(task.recurrence, task.dueDate);
          if (nextDueDate) {
            // Create a new task with the next due date
            const newTask = await Task.create({
              ...task.toObject(), // creates a plain js object, removing mongoose stuff.
              _id: new mongoose.Types.ObjectId(), //assign new ID
              dueDate: nextDueDate,
              isRecurring: false, // Ensure the new task is not recurring itself
              recurrence: "None",
              createdAt: new Date(),
            });
            return newTask; // Return the newly created task
          }
        }
        return task; // Return original task if not recurring
      })
    );
    res.json({ tasks: updatedTasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { isRecurring, recurrence, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        dueDate: dueDate ? new Date(dueDate) : undefined, //update
        isRecurring,
        recurrence,
      },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
};
