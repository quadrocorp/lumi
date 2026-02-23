// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { faker } from "@faker-js/faker";
import { type SparkBot } from "../../types/spark";
import { Tracker } from "../tracker/Tracker";
import { DockerTrackers, StatTrackers } from "../tracker/config";

export function Bot({ data }: { data: SparkBot }) {
	return (
		<article>
			<header>
				<h3>{data.name}</h3>
				<a
					href={`https://t.me/${data.botId}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					@{data.botId}
				</a>
			</header>

			<section>
				<p>Messages: {data.totalMsgs.toLocaleString()}</p>
				<p>Uptime since: {data.uptime.toUTCString()}</p>
			</section>

			{data.dockerTrackers.length > 0 && (
				<section>
					<h4>System</h4>
					{data.dockerTrackers.map((key) => {
						const cfg = DockerTrackers[key];
						if (!cfg) return null;
						const val = ["cpu", "ram", "gpu"].includes(key)
							? faker.number.int({ min: 5, max: 95 })
							: faker.number.int({ min: 10, max: 500 });
						return <Tracker key={key} config={cfg} value={val} />;
					})}
				</section>
			)}

			{data.trackers.length > 0 && (
				<section>
					<h4>Stats</h4>
					{data.trackers.map((key) => {
						const cfg = StatTrackers[key];
						if (!cfg) return null;
						let val: number | string | undefined;
						if (key === "throughput")
							val = faker.number.int({ min: 0, max: 500 });
						else if (key === "latency")
							val = faker.number.int({ min: 5, max: 3000 });
						else if (key === "most-used-command")
							val = faker.helpers.arrayElement([
								"/start",
								"/help",
							]);
						else if (key === "most-active-hour")
							val = faker.number.int({ min: 0, max: 23 });
						return <Tracker key={key} config={cfg} value={val} />;
					})}
				</section>
			)}
		</article>
	);
}
