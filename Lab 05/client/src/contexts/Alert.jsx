import React, { createContext, useContext, useMemo, useState } from "react";

export const AlertContext = createContext();

export function useAlertContext() {
	return useContext(AlertContext);
}

export function AlertContextProvider({ children }) {
	const [alertState, setAlertState] = useState({
		open: false,
		type: "info",
		message: "",
	});

	const errorAlert = (message) => {
		setAlertState({
			open: true,
			type: "error",
			message,
		});
	};

	const successAlert = (message) => {
		setAlertState({
			open: true,
			type: "success",
			message,
		});
	};

	const dismissAlert = () => {
		setAlertState({
			open: false,
			type: "info",
			message: "",
		});
	};

	const contextValue = useMemo(
		() => ({
			alertState,
			errorAlert,
			successAlert,
			dismissAlert,
		}),
		[alertState]
	);
	return (
		<AlertContext.Provider value={contextValue}>
			{children}
		</AlertContext.Provider>
	);
}
