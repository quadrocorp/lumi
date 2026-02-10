import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome, {user.firstName} {user.lastName}!</h1>
                <button onClick={handleLogout} className="logout-btn">
                    Logout
                </button>
            </header>

            <div className="dashboard-content">
                <div className="card">
                    <h2>Account Info</h2>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Session ID:</strong> {user.sessionId}</p>
                </div>
            </div>
        </div>
    );
}