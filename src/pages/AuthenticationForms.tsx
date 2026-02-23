// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { useState } from "react";
import { Login } from "../components/auth/Login";
import { Register } from "../components/auth/Register";

export function AuthenticationForms() {
	const [isLogin, setIsLogin] = useState(true);
	return isLogin ? (
		<Login
			onSwitch={() => setIsLogin(false)}
			onSuccess={() => window.location.reload()}
		/>
	) : (
		<Register
			onSwitch={() => setIsLogin(true)}
			onSuccess={() => window.location.reload()}
		/>
	);
}
