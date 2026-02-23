// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { HttpClient } from "./http-client";
import { AuthService } from "./services/auth";

export function createApiClients(baseURL?: string) {
	const isDev = import.meta.env.DEV;
	const defaultBaseURL = baseURL || (isDev ? "/api/v1" : "/api/v1");

	const http = new HttpClient({
		baseURL: defaultBaseURL,
		enableLogging: isDev,
	});

	return {
		http,
		auth: new AuthService(http),
	};
}

// Re-export types for convenience
export { ErrorCode, type ApiError, type ApiResult } from "../types/api";
export type {
	CheckAuthResponse,
	LoginRequest,
	LoginResponse,
	LogoutResponse,
	RegisterRequest,
	RegisterResponse,
} from "./services/auth";
