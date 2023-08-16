import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import { Typography } from "@mui/material";

const client = new ApolloClient({
	uri: "http://localhost:4000/",
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					locationPosts: {
						keyArgs: false,
						// read(existing, { args: { pageNum } }) {
						// 	if (!pageNum) return existing && existing.slice(0, 10);
						// 	console.log(pageNum);
						// 	return (
						// 		existing && existing.slice(pageNum * 10, pageNum * 10 + 10)
						// 	);
						// },
						merge(existing = [], incoming) {
							return [...existing, ...incoming];
						},
					},
				},
			},
		},
	}),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Provider store={store}>
				<PersistGate
					loading={<Typography>Loading...</Typography>}
					persistor={persistor}
				>
					<App />
				</PersistGate>
			</Provider>
		</ApolloProvider>
	</React.StrictMode>
);
