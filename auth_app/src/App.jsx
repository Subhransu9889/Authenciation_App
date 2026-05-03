import { useState, useEffect } from 'react';

const API_BASE = 'https://api.freeapi.app/api/v1/users';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE}/current-user`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setView('profile');
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Registration successful! Please login.');
        setView('login');
      } else {
        setMessage(data.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.data.accessToken);
        setUser(data.data.user);
        setView('profile');
        setMessage('Login successful!');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
    setMessage('Logged out successfully');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">Authentication</h1>
          <p className="text-center text-gray-600 text-sm">Secure access to your account</p>
        </div>
        
        {message && (
          <div className={`alert mb-6 ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="transition-all duration-300">
          {view === 'login' && <LoginForm onSubmit={handleLogin} loading={loading} onSwitch={() => setView('register')} />}
          {view === 'register' && <RegisterForm onSubmit={handleRegister} loading={loading} onSwitch={() => setView('login')} />}
          {view === 'profile' && <Profile user={user} onLogout={handleLogout} loading={loading} />}
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onSubmit, loading, onSwitch }) {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>
      
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full mt-6"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don't have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitch} 
          className="link-primary"
        >
          Create one
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSubmit, loading, onSwitch }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'USER' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>
      
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Choose a strong password"
          value={formData.password}
          onChange={handleChange}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Account Type</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="form-input"
        >
          <option value="USER">Regular User</option>
          <option value="ADMIN">Administrator</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full mt-6"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="text-center text-gray-600 text-sm mt-6">
        Already have an account?{' '}
        <button 
          type="button" 
          onClick={onSwitch} 
          className="link-primary"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

function Profile({ user, onLogout, loading }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back!</h2>
        <p className="text-gray-600 mb-4">Here's your account information</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Username</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">{user.username}</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
          <p className="text-lg font-semibold text-gray-900 mt-1">{user.email}</p>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Type</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {user.role === 'ADMIN' ? 'Administrator' : 'User'}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onLogout}
        disabled={loading}
        className="w-full px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium transition-all duration-200 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Signing out...' : 'Sign Out'}
      </button>
    </div>
  );
}

export default App;
