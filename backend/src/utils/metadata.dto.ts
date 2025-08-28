type LocationType = {
	country: string;
	city: string;
	latitude: number;
	longitude: number;
	timezone: string;
}

type DeviceType = {
	browser: string;
	os: string;
	type: string;
	ip: string;
	userAgent: string;
}

export type SessionMetadataType = {
	location: LocationType;
	device: DeviceType;
}
