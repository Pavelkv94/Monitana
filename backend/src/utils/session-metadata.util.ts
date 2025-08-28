import { lookup } from "geoip-lite";
import DeviceDetector = require("device-detector-js");
import { SessionMetadataType } from "./metadata.dto";


export function getSessionMetadata(userAgent: string = "Unknown", ip: string = "Unknown"): SessionMetadataType {

	const location = lookup(ip);

	const device = new DeviceDetector().parse(userAgent);

	return {
		location: {
			country: location?.country || "Unknown",
			city: location?.city || "Unknown",
			latitude: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0,
			timezone: location?.timezone || "Unknown",
		},
		device: {
			browser: device?.client?.name || "Unknown",
			os: device?.os?.name || "Unknown",
			type: device?.device?.type || "Unknown",
			ip,
			userAgent,
		},
	};
}
