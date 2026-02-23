// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

export interface TrackerOptions {
	key: string;
	name: string;
	reference: string[];
	icon: React.ReactElement;
	unit?: string;
	valueBounds?: [number, number];
	color?: string;
}
