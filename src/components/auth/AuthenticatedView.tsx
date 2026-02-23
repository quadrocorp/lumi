// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { useMemo, useState } from "react";
import { createApiClients } from "../../api";
import { type CheckAuthResponse } from "../../api/services/auth";

export function AuthenticatedView({
	user,
	onLogout,
}: {
	user: CheckAuthResponse["user"];
	onLogout: () => void;
}) {
	const [loading, setLoading] = useState(false);
	const { auth } = useMemo(() => createApiClients(), []);

	const handleLogout = async () => {
		setLoading(true);
		try {
			await auth.logout();
		} catch (e) {
			console.warn("Logout error (ignored):", e);
		} finally {
			setLoading(false);
			onLogout();
		}
	};

	return (
		<div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
			<p>
				✓ Authenticated as <b>{user?.username}</b> ({user?.email})
			</p>
			<button onClick={handleLogout} disabled={loading}>
				{loading ? "Logging out..." : "Logout"}
			</button>
		</div>
	);
}
