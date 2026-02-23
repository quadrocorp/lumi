// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

export enum ErrorCode {
	NETWORK_ERROR = "NETWORK_ERROR",
	UNAUTHORIZED = "UNAUTHORIZED",
	FORBIDDEN = "FORBIDDEN",
	NOT_FOUND = "NOT_FOUND",
	VALIDATION_ERROR = "VALIDATION_ERROR",
	SERVER_ERROR = "SERVER_ERROR",
	UNKNOWN = "UNKNOWN",
}

export interface ApiError {
	code: ErrorCode;
	message: string;
	details?: unknown;
	status?: number;
}

export type ApiResult<T> = Promise<{
	data: T | null;
	error: ApiError | null;
}>;

export interface ApiClientConfig {
	baseURL: string;
	timeout?: number;
	withCredentials?: boolean;
	enableLogging?: boolean;
}
