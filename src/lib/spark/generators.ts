// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { faker } from "@faker-js/faker";
import {
	type SparkBot,
	type SparkStat,
	type StatLatency,
	type StatMAH,
	type StatMUC,
	type StatThroughput,
} from "../../types/spark";

export function sparkGenerateBot(): SparkBot {
	const trackers: string[] = [
		"throughput",
		"latency",
		"most-used-command",
		"most-active-hour",
	];

	const firstName: string = faker.person.firstName();
	const lastName: string = faker.person.lastName();

	return {
		name: faker.internet.username({ firstName, lastName }),
		botId: faker.string.alpha(10),
		totalMsgs: faker.number.int({ min: 0, max: 200000 }),
		uptime: faker.date.past(),
		dockerTrackers: ["cpu", "ram", "disk", "gpu"],
		trackers: faker.helpers.arrayElements(trackers),
	};
}

export function sparkGenerateStat<
	T = StatThroughput | StatLatency | StatMUC | StatMAH,
>(timestamp: Date, valueOverride?: string): SparkStat {
	const subjects = [
		"throughput",
		"latency",
		"most-used-command",
		"most-active-hour",
	] as const;
	const subject = faker.helpers.arrayElement(subjects);
	const message = "";

	const value =
		valueOverride ??
		(() => {
			switch (subject) {
				case "throughput":
					return {
						amount: faker.number.int({ min: 0, max: 500 }),
						hour: faker.number.int({ min: 0, max: 23 }),
						minute: faker.number.int({ min: 0, max: 59 }),
					} as StatThroughput;
				case "latency":
					return faker.number.int({
						min: 5,
						max: 3000,
					}) as StatLatency;
				case "most-used-command":
					return faker.helpers.arrayElement([
						"/start",
						"/help",
						"/stats",
						"/info",
						"/deploy",
						"/config",
						"/ping",
					]) as StatMUC;
				case "most-active-hour":
					return faker.number.int({ min: 0, max: 23 }) as StatMAH;
				default:
					return null;
			}
		})();

	return {
		timestamp: timestamp.getTime(),
		issuedBy: faker.internet.username(),
		subject,
		value: value as T,
		message,
	} as SparkStat;
}

export function sparkGenerateStatBatch<
	T = StatThroughput | StatLatency | StatMUC | StatMAH,
>(startFromTime: Date): Array<SparkStat> {
	const batchSize = faker.number.int({ min: 5, max: 15 });
	const stats: Array<SparkStat> = [];
	let currentTime = new Date(startFromTime.getTime());

	for (let i = 0; i < batchSize; i++) {
		currentTime = new Date(
			currentTime.getTime() +
				faker.number.int({ min: 30000, max: 300000 }),
		);
		stats.push(sparkGenerateStat<T>(currentTime));
	}

	return stats;
}
