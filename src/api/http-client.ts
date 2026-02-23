// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from "axios";
import {
	type ApiClientConfig,
	type ApiError,
	type ApiResult,
	ErrorCode,
} from "../types/api";

export class HttpClient {
	private client: AxiosInstance;
	private config: Required<ApiClientConfig>;

	constructor(config: ApiClientConfig) {
		this.config = {
			timeout: 10000,
			withCredentials: true,
			enableLogging: import.meta.env.DEV,
			...config,
		};

		this.client = axios.create({
			baseURL: this.config.baseURL,
			timeout: this.config.timeout,
			withCredentials: this.config.withCredentials,
			headers: { "Content-Type": "application/json" },
		});

		this.setupInterceptors();
	}

	private setupInterceptors(): void {
		this.client.interceptors.request.use((config) => {
			if (this.config.enableLogging) {
				console.debug(
					`→ ${config.method?.toUpperCase()} ${config.url}`,
				);
			}
			return config;
		});

		this.client.interceptors.response.use(
			(response) => {
				if (this.config.enableLogging) {
					console.debug(
						`← ${response.status} ${response.config.url}`,
					);
				}
				return response;
			},
			(error: AxiosError) => {
				const apiError = this.normalizeError(error);
				if (this.config.enableLogging) {
					console.error(
						`✗ ${apiError.code}: ${apiError.message}`,
						apiError.details,
					);
				}
				return Promise.reject(apiError);
			},
		);
	}

	private normalizeError(error: AxiosError): ApiError {
		if (!error.response) {
			return {
				code: ErrorCode.NETWORK_ERROR,
				message: "Network error — check your connection",
				details: error.message,
			};
		}

		const { status, data } = error.response;
		const errorData = data as { error?: string; details?: unknown };

		const codeMap: Record<number, ErrorCode> = {
			400: ErrorCode.VALIDATION_ERROR,
			401: ErrorCode.UNAUTHORIZED,
			403: ErrorCode.FORBIDDEN,
			404: ErrorCode.NOT_FOUND,
			500: ErrorCode.SERVER_ERROR,
		};

		return {
			code: codeMap[status] || ErrorCode.UNKNOWN,
			message: errorData.error || error.message || "Request failed",
			details: errorData.details,
			status,
		};
	}

	async get<T>(endpoint: string, options?: AxiosRequestConfig): ApiResult<T> {
		try {
			const response = await this.client.get<T>(endpoint, options);
			return { data: response.data, error: null };
		} catch (error) {
			return { data: null, error: error as ApiError };
		}
	}

	async post<T>(
		endpoint: string,
		data?: unknown,
		options?: AxiosRequestConfig,
	): ApiResult<T> {
		try {
			const response = await this.client.post<T>(endpoint, data, options);
			return { data: response.data, error: null };
		} catch (error) {
			return { data: null, error: error as ApiError };
		}
	}
}
