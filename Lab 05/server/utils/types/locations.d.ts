export interface LocationObj {
	fsq_id: string;
	categories: Category[];
	chains: any[];
	distance: number;
	geocodes: Geocodes;
	link: string;
	location: Location;
	name: string;
	related_places: RelatedPlaces;
	timezone: string;
}

export interface Category {
	id: number;
	name: string;
	icon: Icon;
}

export interface Icon {
	prefix: string;
	suffix: string;
}

export interface Geocodes {
	main: Main;
}

export interface Main {
	latitude: number;
	longitude: number;
}

export interface Location {
	address: string;
	census_block: string;
	country: string;
	cross_street: string;
	dma: string;
	formatted_address: string;
	locality: string;
	postcode: string;
	region: string;
}

export interface RelatedPlaces {
	children: Child[];
}

export interface Child {
	fsq_id: string;
	name: string;
}
