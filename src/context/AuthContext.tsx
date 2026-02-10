import { createContext, useContext, useState, useEffect } from 'react';
import Auth from '../api/auth';

interface User {
    firstName: string;
    lastName: string;
    username: string;
    id: number;
    email: string;
    role: number;
    sessionId: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string
    ) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const auth = new Auth();

    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auth.checkAuth();
            
            setUser(data.authenticated ? data.user : null);
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            setError(null);
            await auth.login({ email, password });
            await checkAuthentication();
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Login failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string
    ) => {
        try {
            setLoading(true);
            setError(null);
            await auth.register({ firstName, lastName, username, email, password });
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setError(null);
            await auth.logout();
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
            setError('Logout failed');
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}