const app = require("express");
const http = require("http").createServer(app);
var io = require("socket.io")(http);

io.on("connection", (socket) => {
	console.log("new client connected", socket.id);

	socket.on("user_join", ({ name, roomName }) => {
		socket.join(roomName);
		console.log(`${name} has joined room ${roomName}`);
		// socket.broadcast.emit("user_join", name);
		io.to(roomName).emit("user_join", { name, roomName });
	});

	socket.on("message", ({ name, message, roomName }) => {
		console.log(name, roomName, message, socket.id);
		io.to(roomName).emit("message", { name, message });
	});

	socket.on("disconnect", () => {
		console.log("Disconnect Fired");
	});

	socket.on("update_room", ({ name, prevRoomName, newRoomName }) => {
		console.log("update", name, prevRoomName, newRoomName);
		socket.join(newRoomName);
		socket.leave(prevRoomName);
		io.to(newRoomName).emit("user_join", { name, roomName: newRoomName });
	});
});

http.listen(4000, () => {
	console.log(`listening on *:${4000}`);
});
