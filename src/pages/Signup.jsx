import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CloudCog,
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Cloud Security Analyst',
    organization: 'FinTech Cloud SecOps',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Password requirements calculation
  const password = formData.password;
  const hasLength = password.length >= 6;
  const hasUpperOrNumber = /[A-Z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === formData.confirmPassword;

  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score; // max 5
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Please provide a valid work email.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('You must accept the AWS Multi-Account security policy.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organization: formData.organization,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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

      <div className="auth-card-wrapper auth-card-wide">
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
            <h2>Create SecOps Account</h2>
            <p>Register your IAM identity for centralized multi-account audit and monitoring</p>
          </div>

          {error && (
            <div className="auth-alert error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="signup-name">Full Name</label>
                <div className="auth-input-group">
                  <User size={18} className="auth-input-icon" />
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Sravani K."
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-email">Work Email</label>
                <div className="auth-input-group">
                  <Mail size={18} className="auth-input-icon" />
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="sravani@company.aws"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>

            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="signup-role">Security Role</label>
                <div className="auth-input-group">
                  <Briefcase size={18} className="auth-input-icon" />
                  <select
                    id="signup-role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="auth-select"
                  >
                    <option value="Cloud Security Admin">Cloud Security Admin</option>
                    <option value="Lead Cloud Architect">Lead Cloud Architect</option>
                    <option value="DevSecOps Lead">DevSecOps Lead</option>
                    <option value="Cloud Security Analyst">Cloud Security Analyst</option>
                    <option value="SOC Compliance Auditor">SOC Compliance Auditor</option>
                  </select>
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="signup-org">Organization / AWS OU</label>
                <div className="auth-input-group">
                  <Building size={18} className="auth-input-icon" />
                  <input
                    id="signup-org"
                    name="organization"
                    type="text"
                    placeholder="Enterprise SecOps OU"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="auth-form-row">
              <div className="auth-field">
                <label htmlFor="signup-password">Master Password</label>
                <div className="auth-input-group">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
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

                {/* Password strength bar */}
                {password && (
                  <div className="auth-strength-meter">
                    <div className="strength-bars">
                      <div className={`bar ${strength >= 1 ? 'active weak' : ''}`} />
                      <div className={`bar ${strength >= 2 ? 'active medium' : ''}`} />
                      <div className={`bar ${strength >= 3 ? 'active good' : ''}`} />
                      <div className={`bar ${strength >= 4 ? 'active strong' : ''}`} />
                    </div>
                    <span className="strength-label">
                      {strength <= 1 && 'Weak'}
                      {strength === 2 && 'Fair'}
                      {strength === 3 && 'Good'}
                      {strength >= 4 && 'Strong'}
                    </span>
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="signup-confirm">Confirm Password</label>
                <div className="auth-input-group">
                  <Lock size={18} className="auth-input-icon" />
                  <input
                    id="signup-confirm"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
                {formData.confirmPassword && (
                  <div className={`password-match-tag ${passwordsMatch ? 'match' : 'mismatch'}`}>
                    {passwordsMatch ? (
                      <>
                        <Check size={12} /> Passwords match
                      </>
                    ) : (
                      <>
                        <X size={12} /> Passwords do not match
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="auth-requirements-checklist">
              <span className={`req-item ${hasLength ? 'met' : ''}`}>
                {hasLength ? <Check size={12} /> : <span className="req-dot" />} Min 6 characters
              </span>
              <span className={`req-item ${hasUpperOrNumber ? 'met' : ''}`}>
                {hasUpperOrNumber ? <Check size={12} /> : <span className="req-dot" />} Number or capital letter
              </span>
            </div>

            <div className="auth-options">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  required
                />
                <span>
                  I acknowledge multi-account CloudTrail audit log compliance and encryption policies.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="auth-btn-loader">Creating Account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <p>
              Already have an authorized SecOps profile?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="auth-security-badges">
          <div className="badge-item">
            <CheckCircle2 size={13} />
            <span>FIPS 140-2 Salted Hash</span>
          </div>
          <div className="badge-item">
            <ShieldCheck size={13} />
            <span>Centralized Org Audit Ready</span>
          </div>
          <div className="badge-item">
            <CheckCircle2 size={13} />
            <span>Zero-Trust IAM Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
