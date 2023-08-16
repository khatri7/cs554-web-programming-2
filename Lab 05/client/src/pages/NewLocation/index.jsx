import { Box, Button, CircularProgress, Stack } from "@mui/material";
import React from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components/FormikMuiFields";
import * as Yup from "yup";
import { useMutation } from "@apollo/client";
import {
	GET_USER_POSTED_LOCATIONS,
	UPLOAD_LOCATION,
} from "../../utils/queries";
import { useAlertContext } from "../../contexts/Alert";

const schema = Yup.object().shape({
	name: Yup.string().required("Name is required"),
	image: Yup.string()
		.required("Image URL is required")
		.matches(
			"^https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$",
			"Invalid Image URL"
		),
	address: Yup.string(),
});

// .matches("/.(jpg|jpeg|png|webp|avif|gif|svg)$/", "Invalid Image URL"),

function NewLocation() {
	const navigate = useNavigate();
	const { errorAlert, successAlert } = useAlertContext();
	const [uploadLocation, { error, reset }] = useMutation(UPLOAD_LOCATION, {
		refetchQueries: [{ query: GET_USER_POSTED_LOCATIONS }],
	});
	if (error) {
		errorAlert(error.message);
		reset();
	}
	return (
		<Box>
			<Formik
				validationSchema={schema}
				initialValues={{
					name: "",
					image: "",
					address: "",
				}}
				onSubmit={async (
					{ name, image, address },
					{ setSubmitting, resetForm }
				) => {
					try {
						setSubmitting(true);
						const variables = {
							name,
							image,
						};
						if (address.trim().length > 0) variables.address = address;
						await uploadLocation({
							variables,
						});
						successAlert("Location created successfully!");
						navigate("/my-locations");
						resetForm();
					} catch {
					} finally {
						setSubmitting(false);
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<Stack gap={2}>
							<Field name="name" label="Name" component={TextInput} required />
							<Field
								name="image"
								label="Image URL"
								component={TextInput}
								required
							/>
							<Field name="address" label="Address" component={TextInput} />
							<Button
								variant="contained"
								type="submit"
								disabled={isSubmitting}
								sx={{
									alignSelf: "flex-end",
									minWidth: "10rem",
									minHeight: "2.5rem",
								}}
							>
								{isSubmitting ? <CircularProgress size={22} /> : "Create"}
							</Button>
						</Stack>
					</Form>
				)}
			</Formik>
		</Box>
	);
}

export default NewLocation;
