import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
	return (
		<Box>
			<Typography component="h1" variant="h3" textAlign="center">
				Ticketmaster API Website
			</Typography>
			<br />
			<Typography>
				Ticketmaster is the world's leading live entertainment company. If
				you're a music lover, sports enthusiast, or just someone who loves to
				attend live events, you've come to the right place!{" "}
			</Typography>
			<br />
			<Typography>
				Here, you'll find all events, attractions, and venues from Ticketmaster
				and the API that powers it. As someone who has been to many concerts and
				shows, I can tell you that there's nothing quite like the energy and
				excitement of a live performance. From the music to the lights to the
				crowd, it's an experience unlike any other. And Ticketmaster makes it
				all possible.
			</Typography>
			<br />
			<Typography>
				Whether you're looking for tickets to your favorite band's concert, a
				big game, or the latest Broadway show, Ticketmaster has got you covered.
				With its easy-to-use API, you can find and purchase tickets in just a
				few clicks. And with its extensive network of venues and promoters,
				you're sure to find something that suits your interests.
			</Typography>
			<br />
			<br />
			<Typography
				component="h2"
				variant="h4"
				textAlign="center"
				marginBottom={2}
			>
				Start Exploring Now
			</Typography>
			<Stack direction="row" justifyContent="space-around">
				<Typography>
					<Link to="/events/page/1">Events</Link>
				</Typography>
				<Typography>
					<Link to="/attractions/page/1">Attractions</Link>
				</Typography>
				<Typography>
					<Link to="/venues/page/1">Venues</Link>
				</Typography>
			</Stack>
		</Box>
	);
}

export default Home;
