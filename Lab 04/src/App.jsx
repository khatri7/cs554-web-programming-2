import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Events from "./pages/Events";
import Layout from "./components/Layout";
import Attractions from "./pages/Attractions";
import Venues from "./pages/Venues";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import SingleEvent from "./pages/Events/SingleEvent";
import SingleAttraction from "./pages/Attractions/SingleAttraction";
import SingleVenue from "./pages/Venues/SingleVenue";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					"&.Mui-disabled": {
						":disabled": {
							color: "#5c5c5c",
						},
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& legend": { display: "none" },
					"& fieldset": { top: 0 },
					"& label": {
						padding: "0 5px",
						background: "white",
					},
				},
			},
		},
		MuiInputLabel: {
			styleOverrides: {
				root: {
					"&.Mui-disabled": {
						color: "#747474",
					},
				},
			},
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/events">
							<Route path="page/:page" element={<Events />} />
							<Route path=":id" element={<SingleEvent />} />
						</Route>
						<Route path="/attractions">
							<Route path="page/:page" element={<Attractions />} />
							<Route path=":id" element={<SingleAttraction />} />
						</Route>
						<Route path="/venues">
							<Route path="page/:page" element={<Venues />} />
							<Route path=":id" element={<SingleVenue />} />
						</Route>
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Layout>
			</Router>
		</ThemeProvider>
	);
}

export default App;
