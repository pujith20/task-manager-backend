const { io } = require("socket.io-client");

// Replace this URL with your actual backend socket server URL
const socket = io("http://localhost:3001"); // Change port if needed

socket.on("connect", () => {
  console.log("Connected to server");

  const toUserId = "6816c60ef49d949afdd3eec3"; // MongoDB user _id
  const task = {
    _id: "6814747e8e9e043e510581bc",           // MongoDB task _id
    title: "This is a test from Postman.",
  };

  // Step 1: Register the user
  socket.emit("register", toUserId);

  // Step 2: Trigger the taskAssigned event after short delay
  setTimeout(() => {
    socket.emit("taskAssigned", { toUserId, task });
    console.log("Sent taskAssigned event");
  }, 1000);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
