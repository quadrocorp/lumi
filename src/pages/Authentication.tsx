import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'login' | 'register';

interface FieldConfig {
    name: keyof FormData;
    label: string;
    type: 'text' | 'email' | 'password';
    required: boolean;
}

interface FormData {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export default function Authentication({ login = true }: { login?: boolean }) {
    const { login: loginFn, register: registerFn, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [mode, setMode] = useState<AuthMode>(login ? 'login' : 'register');
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: ''
    });

    // Redirect if authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Reset form on mode change
    useEffect(() => {
        setFormData({
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: ''
        });
    }, [mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (mode === 'login') {
                await loginFn(formData.email, formData.password);
            } else {
                await registerFn(
                    formData.firstName,
                    formData.lastName,
                    formData.username,
                    formData.email,
                    formData.password
                );
                setMode('login');
            }
        } catch (err) {
            // Error handled by AuthContext
        }
    };

    const fields: FieldConfig[] = [
        { name: 'firstName', label: 'First Name', type: 'text', required: mode === 'register' },
        { name: 'lastName', label: 'Last Name', type: 'text', required: mode === 'register' },
        { name: 'username', label: 'Username', type: 'text', required: mode === 'register' },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true }
    ];

    const visibleFields = fields.filter(field => {
        if (mode === 'login') {
            return field.name === 'email' || field.name === 'password';
        }
        return true;
    });

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {visibleFields.map(field => (
                        <div key={field.name} className="field-group">
                            <label htmlFor={field.name}>{field.label}</label>
                            <input 
                                type={field.type} 
                                id={field.name}
                                name={field.name} 
                                value={formData[field.name]}
                                onChange={handleInputChange}
                                placeholder={field.label}
                                required={field.required}
                            />
                        </div>
                    ))}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
                    </button>
                </form>

                <button 
                    onClick={() => setMode(prev => prev === 'login' ? 'register' : 'login')} 
                    className="toggle-btn"
                    disabled={loading}
                >
                    {mode === 'login' 
                        ? "Don't have an account? Register" 
                        : "Already have an account? Login"}
                </button>
            </div>
        </div>
    );
}