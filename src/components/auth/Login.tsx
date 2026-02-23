// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { useMemo, useState } from "react";
import { createApiClients, ErrorCode } from "../../api";

export function Login({
	onSwitch,
	onSuccess,
}: {
	onSwitch: () => void;
	onSuccess: () => void;
}) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { auth } = useMemo(() => createApiClients(), []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const { data, error: apiError } = await auth.login({
				email,
				password,
			});

			if (apiError) {
				switch (apiError.code) {
					case ErrorCode.UNAUTHORIZED:
						setError("Invalid email or password");
						break;
					case ErrorCode.NETWORK_ERROR:
						setError("Cannot connect to server");
						break;
					case ErrorCode.VALIDATION_ERROR:
						setError("Please check your input");
						break;
					default:
						setError(apiError.message);
				}
				return;
			}

			console.log("Login success:", data);
			onSuccess();
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Login error:", err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			{error && (
				<div style={{ color: "red", marginBottom: "1rem" }}>
					{error}
				</div>
			)}
			<div style={{ marginBottom: "1rem" }}>
				<input
					type="email"
					placeholder="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					disabled={loading}
					style={{ width: "100%", padding: "0.5rem" }}
				/>
			</div>
			<div style={{ marginBottom: "1rem" }}>
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					disabled={loading}
					style={{ width: "100%", padding: "0.5rem" }}
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				style={{ marginRight: "0.5rem" }}
			>
				{loading ? "Logging in..." : "Login"}
			</button>
			<button type="button" onClick={onSwitch} disabled={loading}>
				Register instead
			</button>
		</form>
	);
}
