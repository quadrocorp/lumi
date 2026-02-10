import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './pages/ProtectedRoute';
import Authentication from './pages/Authentication';
import Dashboard from './pages/Dashboard';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Authentication login />} />
                    <Route path="/register" element={<Authentication login={false} />} />

                    {/* Protected routes */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Redirect root */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* 404 */}
                    <Route path="*" element={<div>404 - Not Found</div>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;