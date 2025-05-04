const express = require('express');
const http = require('http');
const { app, server } = require('express')();
const cors = require('cors');
const socketIO = require('socket.io');

app.use(cors());
const PORT = process.env.PORT || 3000;

// Simpan semua device dan lokasinya
let devices = {};

const io = socketIO(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Kirim semua device saat client baru connect
  socket.emit("update-devices", devices);

  // Terima update lokasi dari client
  socket.on("send-location", (data) => {
    const { deviceId, latitude, longitude } = data;
    devices[deviceId] = { latitude, longitude, lastUpdated: new Date() };
    io.emit("update-devices", devices); // Broadcast ke semua client
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Route statis
app.use(express.static('../public'));

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});