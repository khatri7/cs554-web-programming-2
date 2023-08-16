import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import MyLikes from "./pages/MyLikes";
import MyLocations from "./pages/MyLocations";
import NewLocation from "./pages/NewLocation";
import { createTheme, ThemeProvider } from "@mui/material";
import { AlertContextProvider } from "./contexts/Alert";
import { useMutation } from "@apollo/client";
import { GET_TOP_TEN_LOCATIONS, SET_USER_LOCATION } from "./utils/queries";
import TopTenLocations from "./pages/TopTenLocations";
import NotFound from "./pages/404";

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
	const [setUserLocation] = useMutation(SET_USER_LOCATION, {
		refetchQueries: [{ query: GET_TOP_TEN_LOCATIONS }],
	});
	useEffect(() => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				setUserLocation({
					variables: {
						latitude: position.coords.latitude,
						longitude: position.coords.longitude,
					},
				});
			});
		}
	}, [setUserLocation]);
	return (
		<ThemeProvider theme={theme}>
			<AlertContextProvider>
				<Router>
					<Layout>
						<Routes>
							<Route index element={<Home />} />
							<Route path="/my-likes" element={<MyLikes />} />
							<Route path="/my-locations" element={<MyLocations />} />
							<Route path="/new-location" element={<NewLocation />} />
							<Route path="/distance" element={<TopTenLocations />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Layout>
				</Router>
			</AlertContextProvider>
		</ThemeProvider>
	);
}

export default App;
