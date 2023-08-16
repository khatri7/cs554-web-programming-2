import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";

function App() {
	const [state, setState] = useState({
		message: "",
		name: "",
		roomName: "general",
	});
	const [chat, setChat] = useState([]);

	const socketRef = useRef();

	useEffect(() => {
		socketRef.current = io("/");
		return () => {
			socketRef.current.disconnect();
		};
	}, []);

	useEffect(() => {
		socketRef.current.on("message", ({ name, message }) => {
			console.log("The server has sent some data to all clients");
			setChat([...chat, { name, message }]);
		});
		socketRef.current.on("user_join", function ({ name, roomName }) {
			setChat([
				...chat,
				{ name: "ChatBot", message: `${name} has joined the room ${roomName}` },
			]);
		});

		return () => {
			socketRef.current.off("message");
			socketRef.current.off("user-join");
		};
	}, [chat]);

	const userjoin = (name, roomName) => {
		socketRef.current.emit("user_join", { name, roomName });
	};

	const onMessageSubmit = (e) => {
		let msgEle = document.getElementById("message");
		console.log([msgEle.name], msgEle.value);
		setState({ ...state, [msgEle.name]: msgEle.value });
		socketRef.current.emit("message", {
			name: state.name,
			message: msgEle.value,
			roomName: state.roomName,
		});
		e.preventDefault();
		setState({ message: "", name: state.name, roomName: state.roomName });
		msgEle.value = "";
		msgEle.focus();
	};

	const handleRoomChange = () => {
		const newRoomName = document.getElementById("room").value;
		if (newRoomName !== state.roomName) {
			socketRef.current.emit("update_room", {
				name: state.name,
				prevRoomName: state.roomName,
				newRoomName,
			});
			setState({
				...state,
				roomName: newRoomName,
			});
			setChat([]);
		}
	};

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		));
	};

	return (
		<div>
			{state.name && (
				<div className="card">
					<div className="render-chat">
						<h1>Chat Log</h1>
						{renderChat()}
					</div>
					<form onSubmit={onMessageSubmit}>
						<h1>Messenger</h1>
						<div>
							<input
								name="message"
								id="message"
								variant="outlined"
								label="Message"
							/>
						</div>
						<button>Send Message</button>
					</form>

					<div className="form-group">
						<label>
							Chat Room:
							<br />
							<select
								name="room"
								id="room"
								value={state.roomName}
								onChange={handleRoomChange}
							>
								<option value="general">General</option>
								<option value="frontend">Front End</option>
								<option value="backend">Backend</option>
								<option value="fullstack">Full Stack</option>
							</select>
						</label>
					</div>
				</div>
			)}

			{!state.name && (
				<form
					className="form"
					onSubmit={(e) => {
						console.log(document.getElementById("username_input").value);
						e.preventDefault();
						setState({
							name: document.getElementById("username_input").value,
							roomName: document.getElementById("room").value,
						});
						userjoin(
							document.getElementById("username_input").value,
							document.getElementById("room").value
						);
						// userName.value = "";
					}}
				>
					<div className="form-group">
						<label>
							User Name:
							<br />
							<input id="username_input" />
						</label>
					</div>
					<br />
					<div className="form-group">
						<label>
							Chat Room:
							<br />
							<select name="room" id="room">
								<option value="general" selected>
									General
								</option>
								<option value="frontend">Front End</option>
								<option value="backend">Backend</option>
								<option value="fullstack">Full Stack</option>
							</select>
						</label>
					</div>
					<br />
					<br />
					<button type="submit"> Click to join</button>
				</form>
			)}
		</div>
	);
}

export default App;
