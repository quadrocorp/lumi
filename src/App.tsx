// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { useEffect, useMemo, useState } from "react";
import { createApiClients, ErrorCode } from "./api";
import { type CheckAuthResponse } from "./api/services/auth";
import { AuthenticatedView } from "./components/auth/AuthenticatedView";
import { Bot } from "./components/bot/SparkBot";
import { sparkGenerateBot } from "./lib/spark/generators";
import { AuthenticationForms } from "./pages/AuthenticationForms";
import { type SparkBot } from "./types/spark";

function App() {
	const { auth } = useMemo(() => createApiClients(), []);
	const [checking, setChecking] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const [user, setUser] = useState<CheckAuthResponse["user"]>(null);

	// Demo data
	const demoBot: SparkBot = sparkGenerateBot();
	const demoBot2: SparkBot = sparkGenerateBot();
	const demoBot3: SparkBot = sparkGenerateBot();

	useEffect(() => {
		let mounted = true;

		auth.checkAuth().then(({ data, error }) => {
			if (!mounted) return;

			if (error) {
				if (error.code !== ErrorCode.UNAUTHORIZED) {
					console.warn("Auth check error:", error);
				}
				setAuthenticated(false);
				setUser(null);
			} else if (data) {
				setAuthenticated(data.authenticated);
				setUser(data.authenticated ? data.user : null);
			}
			setChecking(false);
		});

		return () => {
			mounted = false;
		};
	}, [auth]);

	const handleLogout = () => {
		setAuthenticated(false);
		setUser(null);
		window.location.reload();
	};

	if (checking)
		return (
			<div style={{ padding: "2rem" }}>Checking authentication...</div>
		);

	if (!authenticated) {
		return (
			<main
				style={{
					maxWidth: "400px",
					margin: "2rem auto",
					padding: "1rem",
				}}
			>
				<h2 style={{ textAlign: "center" }}>Welcome to Lumi</h2>
				<AuthenticationForms />
			</main>
		);
	}

	return (
		<main style={{ padding: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
			<header
				style={{
					marginBottom: "2rem",
					paddingBottom: "1rem",
					borderBottom: "1px solid #333",
				}}
			>
				<AuthenticatedView user={user} onLogout={handleLogout} />
			</header>

			<h1>Bot Dashboard</h1>
			<Bot data={demoBot} />
			<Bot data={demoBot2} />
			<Bot data={demoBot3} />
		</main>
	);
}

export default App;
