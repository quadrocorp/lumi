// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { useMemo, useState } from "react";
import { createApiClients, ErrorCode } from "../../api";

export function Register({
	onSwitch,
	onSuccess,
}: {
	onSwitch: () => void;
	onSuccess: () => void;
}) {
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const { auth } = useMemo(() => createApiClients(), []);

	const handleChange =
		(field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setForm((prev) => ({ ...prev, [field]: e.target.value }));
		};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const { data, error: apiError } = await auth.register(form);

			if (apiError) {
				switch (apiError.code) {
					case ErrorCode.VALIDATION_ERROR:
						setError("Please check your input fields");
						break;
					case ErrorCode.SERVER_ERROR:
						setError("Email or username already taken");
						break;
					case ErrorCode.NETWORK_ERROR:
						setError("Cannot connect to server");
						break;
					default:
						setError(apiError.message);
				}
				return;
			}

			console.log("Registration success:", data);
			onSuccess();
		} catch (err) {
			setError("An unexpected error occurred");
			console.error("Registration error:", err);
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
			<div
				style={{ display: "grid", gap: "0.5rem", marginBottom: "1rem" }}
			>
				<input
					placeholder="firstName"
					value={form.firstName}
					onChange={handleChange("firstName")}
					required
					disabled={loading}
				/>
				<input
					placeholder="lastName"
					value={form.lastName}
					onChange={handleChange("lastName")}
					required
					disabled={loading}
				/>
				<input
					placeholder="username"
					value={form.username}
					onChange={handleChange("username")}
					required
					disabled={loading}
				/>
				<input
					type="email"
					placeholder="email"
					value={form.email}
					onChange={handleChange("email")}
					required
					disabled={loading}
				/>
				<input
					type="password"
					placeholder="password"
					value={form.password}
					onChange={handleChange("password")}
					required
					disabled={loading}
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				style={{ marginRight: "0.5rem" }}
			>
				{loading ? "Registering..." : "Register"}
			</button>
			<button type="button" onClick={onSwitch} disabled={loading}>
				Login instead
			</button>
		</form>
	);
}
