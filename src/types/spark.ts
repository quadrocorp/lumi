// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

export interface SparkBot {
	name: string;
	botId: string;
	totalMsgs: number;
	uptime: Date;
	dockerTrackers: string[];
	trackers: string[];
}

export interface SparkStat<
	T = StatThroughput | StatLatency | StatMUC | StatMAH,
> {
	timestamp: number;
	issuedBy: string;
	subject: string;
	value: T;
	message: string;
}

export interface StatThroughput {
	amount: number;
	hour: number;
	minute: number;
}

export type StatLatency = number;
export type StatMUC = string;
export type StatMAH = number;
