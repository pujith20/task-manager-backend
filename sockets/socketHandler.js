// sockets/socketHandler.js

const Notification = require("../models/Notification");

const activeUsers = {};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("register", (userId) => {
      activeUsers[userId] = socket.id;
    });

    socket.on("taskAssigned", async ({ toUserId, task }) => {
      const socketId = activeUsers[toUserId];
      
      if (socketId) {
        io.to(socketId).emit("newTask", task);
      }

      // Save the notification in the DB
      console.log(toUserId, task);  
      try {
        const createdNotification = await Notification.create({
          toUser: toUserId,
          message: `You have been assigned a new task: ${
            task.title || "Unnamed Task"
          }`,
          task: task._id,
        });
        io.to(socketId).emit("notificationCreated", createdNotification); // Emit new event
      } catch (err) {
        console.error("Error storing notification:", err);
      }
    });

    socket.on("disconnect", () => {
      Object.keys(activeUsers).forEach((uid) => {
        if (activeUsers[uid] === socket.id) delete activeUsers[uid];
      });
      console.log("User disconnected");
    });
  });
};
