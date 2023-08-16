import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { createTheme, ThemeProvider } from "@mui/material";
import { AlertContextProvider } from "./contexts/Alert";
import NotFound from "./pages/404";
import Collectors from "./pages/Collectors";
import MarvelCharacters from "./pages/MarvelCharacters";
import SingleMarvelCharacter from "./pages/SingleMarvelCharacter";

const theme = createTheme({
	typography: {
		fontFamily: "'Saira Condensed', sans-serif",
	},
	palette: {
		primary: {
			main: "#e6242a",
		},
	},
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
			<AlertContextProvider>
				<Router>
					<Layout>
						<Routes>
							<Route index element={<Home />} />
							<Route path="/collectors" element={<Collectors />} />
							<Route path="/marvel-characters">
								<Route path="page/:pageNum" element={<MarvelCharacters />} />
								<Route path=":id" element={<SingleMarvelCharacter />} />
							</Route>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</Layout>
				</Router>
			</AlertContextProvider>
		</ThemeProvider>
	);
}

export default App;
