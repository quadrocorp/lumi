import { createContext, useContext, useState, useEffect } from 'react';
import Auth from '../api/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = new Auth();

    // Check auth on mount
    useEffect(() => {
        checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await auth.checkAuth();
            
            if (data.authenticated) {
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await auth.login(email, password);
            
            // Login successful, check auth to get user data
            await checkAuthentication();
            return response;
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (first_name, last_name, username, email, password) => {
        try {
            setLoading(true);
            setError(null);
            const response = await auth.register(
                first_name,
                last_name,
                username,
                email,
                password
            );
            return response;
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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

    const value = {
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