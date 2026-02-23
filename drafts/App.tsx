// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useMemo, useState, useEffect } from "react";
import { faker } from '@faker-js/faker';

console.clear();

interface SparkBot {
    name: string;
    botId: string;
    totalMsgs: number;
    uptime: Date;
    dockerTrackers: string[];      // ['cpu', 'ram', 'disk', 'gpu']
    trackers: string[];            // Active stat trackers: ['throughput', 'latency', ...]
}

interface SparkStat<T = StatThroughput | StatLatency | StatMUC | StatMAH> {
    timestamp: number;
    issuedBy: string;
    subject: string;
    value: T;
    message: string;
}

function sparkGenerateBot(): SparkBot {
    const trackers: string[] = ['throughput', 'latency', 'most-used-command', 'most-active-hour'];
    
    const firstName: string = faker.person.firstName();
    const lastName: string = faker.person.lastName();
    
    const data: SparkBot = {
        name: faker.internet.username({ firstName, lastName }),
        botId: faker.string.alpha(10),
        totalMsgs: faker.number.int({ min: 0, max: 200000 }),
        uptime: faker.date.past(),
        dockerTrackers: ['cpu', 'ram', 'disk', 'gpu'],
        trackers: faker.helpers.arrayElements(trackers),
    }

    return data;
}

// ── Stat Type Helpers (unchanged structure, just ensuring clarity) ──
interface StatThroughput {
    amount: number;    // msgs/min
    hour: number;      // 0-23
    minute: number;    // 0-59
}

type StatLatency = number;        // duration in ms
type StatMUC = string;            // command string, e.g. "/start"
type StatMAH = number;            // hour 0-23

// ── Spark Stat Generator ──
function sparkGenerateStat<T = StatThroughput | StatLatency | StatMUC | StatMAH>(
    timestamp: Date, 
    valueOverride?: string
): SparkStat {
    const subjects = ['throughput', 'latency', 'most-used-command', 'most-active-hour'] as const;
    const subject = faker.helpers.arrayElement(subjects);
    const message = '';

    // Smart value generation based on subject type, unless overridden
    const value = valueOverride ?? (() => {
        switch (subject) {
            case 'throughput':
                
                return {
                    amount: faker.number.int({ min: 0, max: 500 }),
                    hour: faker.number.int({ min: 0, max: 23 }),
                    minute: faker.number.int({ min: 0, max: 59 })
                } as StatThroughput;
            case 'latency':
                return faker.number.int({ min: 5, max: 3000 }) as StatLatency;
            case 'most-used-command':
                return faker.helpers.arrayElement([
                    '/start', '/help', '/stats', '/info', '/deploy', '/config', '/ping'
                ]) as StatMUC;
            case 'most-active-hour':
                return faker.number.int({ min: 0, max: 23 }) as StatMAH;
            default:
                return null;
        }
    })();
    
    return {
        timestamp: timestamp.getTime(),
        issuedBy: faker.internet.username(),
        subject,
        value: value as T,
        message
    } as SparkStat;
}

// ── Batch Generator: creates progressive stats from a start time ──
function sparkGenerateStatBatch<T = StatThroughput | StatLatency | StatMUC | StatMAH>(startFromTime: Date): Array<SparkStat> {
    const batchSize = faker.number.int({ min: 5, max: 15 });
    const stats: Array<SparkStat> = [];
    let currentTime = new Date(startFromTime.getTime());
    
    for (let i = 0; i < batchSize; i++) {
        // Advance time by random interval (30s to 5min) for realistic spacing
        currentTime = new Date(currentTime.getTime() + faker.number.int({ min: 30000, max: 300000 }));
        stats.push(sparkGenerateStat<T>(currentTime));
    }
    
    return stats;
}


console.log("=========================")
console.log("TEST: creating Spark Bot.")
const b: SparkBot = sparkGenerateBot()
console.log(b)
console.log("=========================")
const s: Array<SparkStat> = sparkGenerateStatBatch(new Date(Date.now() - 3600000))
console.log("TEST: creating Spark Stat Batch")
console.log(s)
console.log("=========================")


interface ApiVersionResponse {
    name: string;
    version: number;
}

type SupportedApiVersion = 1 | 2;

class Api {
    private readonly address: string;
    private readonly fallbackTarget: string;
    private client: AxiosInstance | null = null;
    private versionPromise: Promise<string> | null = null;

    constructor(address: string, fallbackTarget: string = 'http://localhost:8081/api/v1') {
        this.address = address.replace(/\/$/, '');
        this.fallbackTarget = fallbackTarget;
    }

    private async resolveBaseUrl(): Promise<string> {
        if (this.client) {
            return this.client.defaults.baseURL || '';
        }

        if (!this.versionPromise) {
            this.versionPromise = this.fetchVersion().then(version => {
                const baseUrl = `${this.address}/api/v${version}`;
                this.client = axios.create({
                    baseURL: baseUrl,
                    timeout: 10000,
                    withCredentials: true,
                });
                return baseUrl;
            });
        }

        return this.versionPromise;
    }

    private async fetchVersion(): Promise<SupportedApiVersion> {
        try {
            const response = await axios.get<ApiVersionResponse>(this.fallbackTarget, {
                timeout: 5000,
                withCredentials: true,
            });
            const version = response.data.version;
            if (version === 1 || version === 2) {
                return version;
            }
            throw new Error(`Unsupported API version: ${version}`);
        } catch (error) {
            console.warn('Version negotiation failed, defaulting to v1', error);
            return 1;
        }
    }

    public async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        await this.resolveBaseUrl();
        return this.client!.get<T>(endpoint, config);
    }

    public async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        await this.resolveBaseUrl();
        return this.client!.post<T>(endpoint, data, config);
    }

    public async getBaseUrl(): Promise<string> {
        return await this.resolveBaseUrl();
    }
}

interface AuthenticationRequest {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
}

interface AuthenticationResponse {
    message: string;
    user: { id: number; username: string; email: string };
}

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    id: number;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: number;
}

interface RefreshResponse {
    access_token: string;
    refresh_token: string;
}

interface CheckAuthResponse {
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

interface LogoutResponse {
    message: string;
}

interface ErrorResponse {
    error: string;
    details?: unknown;
}

// ── Auth Class ──
class Auth {
    private readonly api: Api;

    constructor(apiBase: string = 'http://localhost:8081') {
        this.api = new Api(apiBase);
    }

    private handleAxiosError(error: unknown): never {
        if (axios.isAxiosError(error)) {
            const errResponse = error.response?.data as ErrorResponse | undefined;
            console.error(`API error [${error.response?.status}]:`, errResponse?.error);
            throw new Error(errResponse?.error || error.message || 'API request failed');
        }
        throw error;
    }

    public async Authentication(data: AuthenticationRequest): Promise<AuthenticationResponse> {
        try {
            console.log('Sending Authentication payload:', JSON.stringify(data, null, 2));
            const response = await this.api.post<AuthenticationResponse>('Authentication', data);
            console.log('Authentication success:', response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Authentication failed:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                });
            }
            throw error;
        }
    }

    public async login(data: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await this.api.post<LoginResponse>('login', data);
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    public async refresh(): Promise<RefreshResponse> {
        try {
            const response = await this.api.post<RefreshResponse>('refresh');
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }

    public async checkAuth(): Promise<{ authenticated: boolean; user: CheckAuthResponse['user'] }> {
        try {
            const response = await this.api.get<CheckAuthResponse>('auth/check');
            const { authenticated, user } = response.data;
            return { authenticated, user: authenticated ? user : null };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                return { authenticated: false, user: null };
            }
            return this.handleAxiosError(error);
        }
    }

    public async logout(): Promise<LogoutResponse> {
        try {
            const response = await this.api.post<LogoutResponse>('logout', {});
            return response.data;
        } catch (error) {
            return this.handleAxiosError(error);
        }
    }
}

// ── Minimal Login Component ──
function Login({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const auth = useMemo(() => new Auth(), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await auth.login({ email, password });
            onSuccess();
        } catch (err: unknown) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <input type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <button type="button" onClick={onSwitch}>Register instead</button>
        </form>
    );
}

// ── Minimal Register Component ──
function Register({ onSwitch, onSuccess }: { onSwitch: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const auth = useMemo(() => new Auth(), []);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await auth.Authentication(form);
            onSuccess();
        } catch (err: unknown) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <input placeholder="firstName" value={form.firstName} onChange={handleChange("firstName")} required />
            <input placeholder="lastName" value={form.lastName} onChange={handleChange("lastName")} required />
            <input placeholder="username" value={form.username} onChange={handleChange("username")} required />
            <input type="email" placeholder="email" value={form.email} onChange={handleChange("email")} required />
            <input type="password" placeholder="password" value={form.password} onChange={handleChange("password")} required />
            <button type="submit">Register</button>
            <button type="button" onClick={onSwitch}>Login instead</button>
        </form>
    );
}

// ── Wrapper Authentication Component (forms only) ──
function AuthenticationForms() {
    const [isLogin, setIsLogin] = useState(true);
    return isLogin
        ? <Login onSwitch={() => setIsLogin(false)} onSuccess={() => window.location.reload()} />
        : <Register onSwitch={() => setIsLogin(true)} onSuccess={() => window.location.reload()} />;
}

// ── Minimal Authenticated View ──
function AuthenticatedView({ user, onLogout }: { user: CheckAuthResponse['user']; onLogout: () => void }) {
    return (
        <div>
            <p>✓ Authenticated as <b>{user?.username}</b> ({user?.email})</p>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

// ── Main App Component ──
// function App() {
//     const auth = useMemo(() => new Auth(), []);
//     const [checking, setChecking] = useState(true);
//     const [authenticated, setAuthenticated] = useState(false);
//     const [user, setUser] = useState<CheckAuthResponse['user']>(null);

//     useEffect(() => {
//         let mounted = true;
//         auth.checkAuth().then(({ authenticated, user }) => {
//             if (mounted) {
//                 setAuthenticated(authenticated);
//                 setUser(user);
//                 setChecking(false);
//             }
//         }).catch(() => {
//             if (mounted) {
//                 setAuthenticated(false);
//                 setUser(null);
//                 setChecking(false);
//             }
//         });
//         return () => { mounted = false; };
//     }, [auth]);

//     const handleLogout = async () => {
//         try {
//             await auth.logout();
//         } catch (e) {
//             console.warn('Logout error (ignored):', e);
//         } finally {
//             setAuthenticated(false);
//             setUser(null);
//             // Simple reload to reset any client state; replace with router redirect later
//             window.location.reload();
//         }
//     };

//     if (checking) {
//         return <div>Checking authentication...</div>;
//     }

//     if (authenticated && user) {
//         return <AuthenticatedView user={user} onLogout={handleLogout} />;
//     }

//     return <AuthenticationForms />;
// }

interface TrackerOptions {
    key: string;                    // Unique identifier: 'cpu', 'ram', etc.
    name: string;                   // Display name: "CPU Usage"
    reference: string[];            // Alternative keys for matching
    icon: React.ReactElement;       // Lucide icon component
    unit?: string;                  // Display unit: "%", "MB", "ms"
    valueBounds?: [number, number]; // [min, max] for progress bar scaling
    color?: string;                 // Optional color for theming
}

import { Cpu, MemoryStick, HardDrive, Gauge, Activity, Clock, Terminal, BarChart3 } from 'lucide-react';

const DockerTrackers: Record<string, TrackerOptions> = {
    cpu: {
        key: "cpu",
        name: "CPU Usage",
        reference: ["cpu", "cpu-usage", "processor"],
        icon: <Cpu size={20} />,
        unit: "%",
        valueBounds: [0, 100],
        color: "#3b82f6" // blue-500
    },
    ram: {
        key: "ram",
        name: "Memory",
        reference: ["ram", "memory", "mem"],
        icon: <MemoryStick size={20} />,
        unit: "%",
        valueBounds: [0, 100],
        color: "#8b5cf6" // violet-500
    },
    disk: {
        key: "disk",
        name: "Disk I/O",
        reference: ["disk", "storage", "disk-io"],
        icon: <HardDrive size={20} />,
        unit: "MB/s",
        valueBounds: [0, 1000],
        color: "#10b981" // emerald-500
    },
    gpu: {
        key: "gpu",
        name: "GPU Load",
        reference: ["gpu", "graphics", "gpu-usage"],
        icon: <Gauge size={20} />,
        unit: "%",
        valueBounds: [0, 100],
        color: "#f59e0b" // amber-500
    }
};

// ── Stat Trackers (for sparkGenerateStat subjects) ──
const StatTrackers: Record<string, TrackerOptions> = {
    throughput: {
        key: "throughput",
        name: "Msg/min",
        reference: ["throughput", "messages", "msg-rate"],
        icon: <Activity size={20} />,
        unit: "msg/min",
        valueBounds: [0, 500],
        color: "#06b6d4" // cyan-500
    },
    latency: {
        key: "latency",
        name: "Response Time",
        reference: ["latency", "response-time", "delay"],
        icon: <Clock size={20} />,
        unit: "ms",
        valueBounds: [0, 3000],
        color: "#ec4899" // pink-500
    },
    "most-used-command": {
        key: "most-used-command",
        name: "Top Command",
        reference: ["most-used-command", "top-command", "muc"],
        icon: <Terminal size={20} />,
        color: "#6366f1" // indigo-500
    },
    "most-active-hour": {
        key: "most-active-hour",
        name: "Peak Hour",
        reference: ["most-active-hour", "peak-hour", "mah"],
        icon: <BarChart3 size={20} />,
        unit: "hour",
        valueBounds: [0, 23],
        color: "#14b8a6" // teal-500
    }
};

// ── Tracker Component ──
function Tracker({ config, value }: { config: TrackerOptions; value?: number | string }) {
    // Calculate progress percentage if numeric value and bounds exist
    const progress = typeof value === 'number' && config.valueBounds 
        ? Math.min(100, Math.max(0, 
            ((value - config.valueBounds[0]) / (config.valueBounds[1] - config.valueBounds[0])) * 100
          ))
        : null;

    // Format display value
    const displayValue = value !== undefined 
        ? typeof value === 'number' 
            ? `${value.toFixed(typeof value === 'number' && value % 1 !== 0 ? 1 : 0)}${config.unit || ''}`
            : String(value)
        : '—';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            border: `1px solid ${config.color}33`,
        }}>
            {/* Icon with colored background */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: `${config.color}22`,
                color: config.color,
            }}>
                {config.icon}
            </div>
            
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                }}>
                    <span style={{ fontWeight: 500, fontSize: '14px' }}>{config.name}</span>
                    <span style={{ 
                        fontWeight: 600, 
                        fontSize: '14px',
                        color: config.color 
                    }}>
                        {displayValue}
                    </span>
                </div>
                
                {/* Progress bar for numeric bounded values */}
                {progress !== null && (
                    <div style={{
                        height: '4px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: config.color,
                            borderRadius: '2px',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Bot Component (Completed) ──
function Bot({ data }: { data: SparkBot }) {
    // Generate mock values for docker trackers (in real app, fetch from API)
    const getMockValue = (key: string): number | string => {
        switch (key) {
            case 'cpu':
            case 'ram':
            case 'gpu':
                return faker.number.int({ min: 5, max: 95 });
            case 'disk':
                return faker.number.int({ min: 10, max: 500 });
            default:
                return '—';
        }
    };

    // Format uptime to human readable
    const formatUptime = (date: Date): string => {
        const diff = Date.now() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);
        if (days > 0) return `${days}d ${hours % 24}h`;
        return `${hours}h`;
    };

    return (
        <div style={{
            background: 'rgba(30,30,40,0.8)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            maxWidth: '400px',
        }}>
            {/* Header: Avatar + Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                }}>
                    {data.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{data.name}</h3>
                    <a 
                        href={`https://t.me/${data.botId}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                            color: '#60a5fa', 
                            textDecoration: 'none',
                            fontSize: '14px'
                        }}
                    >
                        @{data.botId}
                    </a>
                </div>
            </div>

            {/* Stats Summary */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
            }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Total Messages</div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>
                        {data.totalMsgs.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Uptime</div>
                    <div style={{ fontWeight: 600, fontSize: '16px' }}>
                        {formatUptime(data.uptime)}
                    </div>
                </div>
            </div>

            {/* Docker Trackers Section */}
            {data.dockerTrackers.length > 0 && (
                <>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#9ca3af' }}>
                        System Metrics
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {data.dockerTrackers.map(key => {
                            const config = DockerTrackers[key];
                            if (!config) return null;
                            return (
                                <Tracker 
                                    key={key} 
                                    config={config} 
                                    value={getMockValue(key)} 
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {/* Stat Trackers Section */}
            {data.trackers.length > 0 && (
                <>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#9ca3af' }}>
                        Bot Statistics
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {data.trackers.map(key => {
                            const config = StatTrackers[key];
                            if (!config) return null;
                            
                            // Generate appropriate mock value based on tracker type
                            let mockValue: number | string | undefined;
                            if (key === 'throughput') {
                                mockValue = faker.number.int({ min: 0, max: 500 });
                            } else if (key === 'latency') {
                                mockValue = faker.number.int({ min: 5, max: 3000 });
                            } else if (key === 'most-used-command') {
                                mockValue = faker.helpers.arrayElement(['/start', '/help', '/stats', '/info']);
                            } else if (key === 'most-active-hour') {
                                mockValue = faker.number.int({ min: 0, max: 23 });
                            }
                            
                            return (
                                <Tracker 
                                    key={key} 
                                    config={config} 
                                    value={mockValue} 
                                />
                            );
                        })}
                    </div>
                </>
            )}

            {/* Action Buttons */}
            <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}>
                    Configure
                </button>
                <button style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#f87171',
                    border: '1px solid #f8717144',
                    borderRadius: '6px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                }}>
                    Stop
                </button>
            </div>
        </div>
    );
}

// ── Usage Example in App ──
function App() {
    // ... existing auth code ...
    
    // Demo: render a bot with trackers
    const demoBot: SparkBot = sparkGenerateBot();
    
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#0f0f1a', 
            color: '#fff',
            padding: '24px',
            fontFamily: 'system-ui, sans-serif'
        }}>
            {/* Auth section would go here */}
            
            {/* Demo Bot Card */}
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ marginBottom: '24px' }}>Bot Dashboard</h1>
                <Bot data={demoBot} />
            </div>
        </div>
    );
}

export default App;