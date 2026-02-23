// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { type TrackerOptions } from "./types";

export function Tracker({
	config,
	value,
}: {
	config: TrackerOptions;
	value?: number | string;
}) {
	return (
		<div>
			{config.icon}
			<span>{config.name}:</span>
			<span>
				{" "}
				{value ?? "—"}
				{config.unit}
			</span>
		</div>
	);
}
