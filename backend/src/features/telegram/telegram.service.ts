import { injectable } from "inversify";
import { LogModel } from "../../db/models/Log.model";
import { flag, name } from 'country-emoji';
import { sensitivePaths } from "../../utils/constants";

@injectable()
export class TelegramService {

	async getLogs(period: string) {
		const now = new Date();
		const startDate = new Date(now.getTime() - Number(period) * 60 * 60 * 1000);

		const logs = await LogModel.find({
			"originalLog.formattedTimestamp": {
				$gte: startDate,
				$lte: now
			}
		});
		return this._summarizeLogs(logs);
	}

	private _summarizeLogs(logs: any[]) {
		const now = new Date();
		const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

		const recentLogs = logs.filter(log => {
			const ts = new Date(log.originalLog['@timestamp']);
			return ts >= oneDayAgo;
		});

		const total = recentLogs.length;

		const uniqueIPs = new Set(recentLogs.map(log => log.originalLog.source.address)).size;

		const errors = recentLogs.filter(log => {
			const code = log.originalLog.http?.response?.status_code;
			return code >= 400;
		});

		const errorCount = errors.length;
		const errorPercent = ((errorCount / total) * 100).toFixed(1);

		// Geography
		const countryMap: Record<string, { count: number; cities: Set<string> }> = {};

		recentLogs.forEach(log => {
			const country = log.metadata.location?.country;
			const city = log.metadata.location?.city;

			const validCountry = country && country !== 'Unknown' ? country : 'Unknown';
			const validCity = city && city !== 'Unknown' ? city : null;

			if (!countryMap[validCountry]) {
				countryMap[validCountry] = { count: 0, cities: new Set() };
			}

			countryMap[validCountry].count += 1;
			if (validCity) {
				countryMap[validCountry].cities.add(validCity);
			}
		});

		const topCountries = Object.entries(countryMap)
			.sort((a, b) => b[1].count - a[1].count)
			.slice(0, 5)
			.map(([code, data]) => {
				const flagEmoji = flag(code) || '🏴‍☠️';
				const countryName = name(code) || code;
				const cityList = Array.from(data.cities);
				const cityInfo = cityList.length > 0 ? `(${cityList.join(', ')})` : '';
				return `${flagEmoji} ${countryName} ${cityInfo} — ${data.count}`;
			});

		// Devices
		const deviceMap: Record<string, number> = {};
		recentLogs.forEach(log => {
			const browser = log.metadata.device?.browser && log.metadata.device?.browser !== 'Unknown' ? log.metadata.device?.browser : null;
			const os = log.metadata.device?.os && log.metadata.device?.os !== 'Unknown' ? log.metadata.device?.os : null;
			const ua = log.metadata.device?.userAgent;

			let label = 'Unknown';
			if (ua?.includes('curl')) label = 'curl';
			else if (browser && os) label = `${browser}/${os}`;
			else if (browser) label = browser;
			else if (os) label = os;
			else label = 'Unknown';

			deviceMap[label] = (deviceMap[label] || 0) + 1;
		});

		const topDevices = Object.entries(deviceMap)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([label, count]) => {
				const percent = ((count / total) * 100).toFixed(1);
				return `— ${label} — ${percent}%`;
			});

		// Suspicious
		const suspiciousIPs: Record<string, number> = {};
		const suspiciousPaths: Record<string, number> = {};

		recentLogs.forEach(log => {
			const ip = log.originalLog.source.address;
			const status = log.originalLog.http?.response?.status_code;
			const path = log.originalLog.url?.original;

			if (status >= 400) {
				suspiciousIPs[ip] = (suspiciousIPs[ip] || 0) + 1;
			}

			if (sensitivePaths.includes(path)) {
				suspiciousPaths[path] = (suspiciousPaths[path] || 0) + 1;
			}
		});

		const topSuspiciousIPs = Object.entries(suspiciousIPs)
			.filter(([_, count]) => count > 10)
			.sort((a, b) => b[1] - a[1])
			.map(([ip, count]) => `— ${ip} — ${count} ошибок`);

		const topSuspiciousPaths = Object.entries(suspiciousPaths)
			.sort((a, b) => b[1] - a[1])
			.map(([path, count]) => `— ${path} — ${count} попытки`);


		let successCount = 0;
		let clientErrorCount = 0;
		let serverErrorCount = 0;

		recentLogs.forEach(log => {
			const status = log.originalLog.http?.response?.status_code;

			if (status >= 200 && status < 300) successCount++;
			else if (status >= 400 && status < 500) clientErrorCount++;
			else if (status >= 500) serverErrorCount++;
		});

		// 📦 Final report
		return {
			total,
			uniqueIPs,
			errorCount,
			errorPercent,
			topCountries,
			topDevices,
			topSuspiciousIPs: topSuspiciousIPs.map(([ip, count]) => `— ${ip} — ${count} ошибок`),
			topSuspiciousPaths,
			successCount,
			clientErrorCount,
			serverErrorCount
		}
	}

}