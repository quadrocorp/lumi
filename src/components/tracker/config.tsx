// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import {
	Activity,
	BarChart3,
	Clock,
	Cpu,
	Gauge,
	HardDrive,
	MemoryStick,
	Terminal,
} from "lucide-react";
import { type TrackerOptions } from "./types";

export const DockerTrackers: Record<string, TrackerOptions> = {
	cpu: {
		key: "cpu",
		name: "CPU Usage",
		reference: ["cpu", "cpu-usage", "processor"],
		icon: <Cpu size={20} />,
		unit: "%",
		valueBounds: [0, 100],
	},
	ram: {
		key: "ram",
		name: "Memory",
		reference: ["ram", "memory", "mem"],
		icon: <MemoryStick size={20} />,
		unit: "%",
		valueBounds: [0, 100],
	},
	disk: {
		key: "disk",
		name: "Disk I/O",
		reference: ["disk", "storage", "disk-io"],
		icon: <HardDrive size={20} />,
		unit: "MB/s",
		valueBounds: [0, 1000],
	},
	gpu: {
		key: "gpu",
		name: "GPU Load",
		reference: ["gpu", "graphics", "gpu-usage"],
		icon: <Gauge size={20} />,
		unit: "%",
		valueBounds: [0, 100],
	},
};

export const StatTrackers: Record<string, TrackerOptions> = {
	throughput: {
		key: "throughput",
		name: "Message rate",
		reference: ["throughput", "messages", "msg-rate"],
		icon: <Activity size={20} />,
		unit: "msg/min",
		valueBounds: [0, 500],
	},
	latency: {
		key: "latency",
		name: "Response Time",
		reference: ["latency", "response-time", "delay"],
		icon: <Clock size={20} />,
		unit: "ms",
		valueBounds: [0, 3000],
	},
	"most-used-command": {
		key: "most-used-command",
		name: "Top Command",
		reference: ["most-used-command", "top-command", "muc"],
		icon: <Terminal size={20} />,
	},
	"most-active-hour": {
		key: "most-active-hour",
		name: "Peak Hour",
		reference: ["most-active-hour", "peak-hour", "mah"],
		icon: <BarChart3 size={20} />,
		unit: "hour",
		valueBounds: [0, 23],
	},
};
