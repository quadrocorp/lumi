import axios from "axios";

// Request Interfaces
interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

// Response Interfaces (per endpoint)
interface RegisterResponse {
    error: string;
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

interface LoginResponse {
    user: {
        id: number;
        email: string;
        username: string;
        firstName?: string;
        lastName?: string;
        role: number;
    };
}

interface RefreshResponse {
    accessToken: string;
    tokenType: string;
}

interface CheckAuthResponse {
    authenticated: boolean;
    user: {
        firstName: string;
        lastName: string;
        username: string;
        id: number;
        email: string;
        role: number;
        sessionId: string;
    };
}

interface LogoutResponse {
    error: string;
}

// Error Response Interface
interface ErrorResponse {
    error: string;
}

export default class Auth {
    private target: string;
    
    constructor(target = "api/v1") {
        this.target = target;
        console.log("current target address is: ", this.target);
        axios.defaults.withCredentials = true;
    }

    async register(data: RegisterRequest) {
        try {
            const response = await axios.post<RegisterResponse>(
                `${this.target}/register`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response?.data as ErrorResponse | undefined;
                console.error("Registration error:", errResponse?.error);
            }
            throw error;
        }
    }

    async login(data: LoginRequest) {
        try {
            const response = await axios.post<LoginResponse>(
                `${this.target}/login`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response?.data as ErrorResponse | undefined;
                console.error("Login error:", errResponse?.error);
            }
            throw error;
        }
    }

    async refresh(refreshToken: string) {
        try {
            const response = await axios.post<RefreshResponse>(
                `${this.target}/refresh`,
                { refresh_token: refreshToken },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response?.data as ErrorResponse | undefined;
                console.error("Refresh error:", errResponse?.error);
            }
            throw error;
        }
    }

    async checkAuth() {
        try {
            const response = await axios.get<CheckAuthResponse>(
                `${this.target}/auth/check`,
                { withCredentials: true }
            );

            if (response.data.authenticated && response.data.user) {
                return { authenticated: true, user: response.data.user };
            }

            return { authenticated: false, user: null}
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // 401 means not authenticated
                if (error.response?.status === 401) {
                    return { authenticated: false, user: null };
                }
                const errResponse = error.response?.data as ErrorResponse | undefined;
                console.error("Auth check error:", errResponse?.error);
            }
            throw error;
        }
    }

    async logout() {
        try {
            const response = await axios.post<LogoutResponse>(
                `${this.target}/logout`,
                {},
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errResponse = error.response?.data as ErrorResponse | undefined;
                console.error("Logout error:", errResponse?.error);
            }
            throw error;
        }
    }
}