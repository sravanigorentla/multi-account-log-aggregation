import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CloudCog,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoSignIn = async (role = 'admin') => {
    setError('');
    try {
      setIsSubmitting(true);
      if (role === 'admin') {
        setEmail('admin@cloudtrail.aws');
        setPassword('Admin@123');
      } else {
        setEmail('alex.rivera@cloudtrail.aws');
        setPassword('Admin@123');
      }
      await demoLogin(role);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background-effects">
        <div className="auth-glow-orb orb-1" />
        <div className="auth-glow-orb orb-2" />
        <div className="auth-grid-overlay" />
      </div>

      <div className="auth-card-wrapper">
        <div className="auth-brand-header">
          <div className="auth-brand-logo">
            <CloudCog size={28} />
          </div>
          <div>
            <h1 className="auth-brand-title">CloudTrail Central</h1>
            <span className="auth-brand-subtitle">Multi-Account Log Aggregator & Security Hub</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Welcome Back</h2>
            <p>Authenticate with your AWS IAM identity or Security Operations account</p>
          </div>

          {error && (
            <div className="auth-alert error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Work Email / IAM Identity</label>
              <div className="auth-input-group">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@cloudtrail.aws"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <div className="auth-field-header">
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="auth-input-group">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember this terminal session</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-btn-loader">Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Aggregator</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="auth-demo-section">
            <div className="auth-demo-divider">
              <span>Quick 1-Click Demo Access</span>
            </div>

            <div className="auth-demo-chips">
              <button
                type="button"
                className="auth-demo-chip"
                onClick={() => handleDemoSignIn('admin')}
                disabled={isSubmitting}
              >
                <div className="demo-chip-icon admin">
                  <ShieldCheck size={14} />
                </div>
                <div className="demo-chip-text">
                  <strong>Security Admin</strong>
                  <span>admin@cloudtrail.aws</span>
                </div>
                <Zap size={14} className="demo-chip-action" />
              </button>

              <button
                type="button"
                className="auth-demo-chip"
                onClick={() => handleDemoSignIn('architect')}
                disabled={isSubmitting}
              >
                <div className="demo-chip-icon arch">
                  <KeyRound size={14} />
                </div>
                <div className="demo-chip-text">
                  <strong>Lead Architect</strong>
                  <span>alex.rivera@cloudtrail.aws</span>
                </div>
                <Zap size={14} className="demo-chip-action" />
              </button>
            </div>
          </div>

          <div className="auth-card-footer">
            <p>
              Don't have an IAM SecOps identity?{' '}
              <Link to="/signup" className="auth-link">
                Register New Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="auth-security-badges">
          <div className="badge-item">
            <CheckCircle2 size={13} />
            <span>End-to-End Encryption</span>
          </div>
          <div className="badge-item">
            <ShieldCheck size={13} />
            <span>SOC 2 Type II Audited</span>
          </div>
          <div className="badge-item">
            <CheckCircle2 size={13} />
            <span>AWS Well-Architected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
