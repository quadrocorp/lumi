// Copyright 2025-2026 Tsupko "quadrocorp" N.R.
// SPDX-License-Identifier: MIT

import { type ApiResult } from "../../types/api";
import { HttpClient } from "../http-client";

export interface RegisterRequest {
	firstName: string;
	lastName: string;
	username: string;
	password: string;
	email: string;
}

export interface RegisterResponse {
	message: string;
	user: { id: number; username: string; email: string };
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	id: number;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	role: number;
}

export interface CheckAuthResponse {
	authenticated: boolean;
	user: {
		id: number;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
		role: number;
	} | null;
}

export interface LogoutResponse {
	message: string;
}

export class AuthService {
	constructor(private http: HttpClient) {}

	async register(data: RegisterRequest): ApiResult<RegisterResponse> {
		return this.http.post<RegisterResponse>("/register", data);
	}

	async login(data: LoginRequest): ApiResult<LoginResponse> {
		return this.http.post<LoginResponse>("/login", data);
	}

	async checkAuth(): ApiResult<CheckAuthResponse> {
		return this.http.get<CheckAuthResponse>("/auth/check");
	}

	async logout(): ApiResult<LogoutResponse> {
		return this.http.post<LogoutResponse>("/logout", {});
	}

	async isAuthenticated(): Promise<boolean> {
		const { data, error } = await this.checkAuth();
		return !error && data?.authenticated === true;
	}
}
