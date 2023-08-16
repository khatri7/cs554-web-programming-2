import { Snackbar, Alert as MuiAlert } from "@mui/material";
import React from "react";
import { useAlertContext } from "../../contexts/Alert";

function Alert() {
	const { alertState, dismissAlert } = useAlertContext();
	const handleClose = () => {
		dismissAlert();
	};
	return (
		<Snackbar
			open={alertState.open}
			autoHideDuration={5000}
			onClose={handleClose}
			anchorOrigin={{ vertical: "top", horizontal: "center" }}
		>
			<MuiAlert severity={alertState.type || "info"}>
				{alertState.message || ""}
			</MuiAlert>
		</Snackbar>
	);
}

export default Alert;
