import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  LogIn,
  CheckCircle,
  AlertCircle,
  UserPlus,
  X,
  ChevronRight
} from 'lucide-react';
import Button from './ui/Button';
import { loginUser, googleAuth, setCurrentUser } from '../utils/userData';

const InputField = ({ label, icon: Icon, type, value, onChange, error, showPasswordToggle, onTogglePassword, id }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 group-focus-within:text-brand-green">
        <Icon className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border rounded-xl outline-none transition-all duration-200 ${error
          ? 'border-red-300 focus:ring-4 focus:ring-red-100 bg-red-50/10'
          : 'border-gray-200 focus:border-brand-green focus:ring-4 focus:ring-brand-green/10 focus:bg-white'
          }`}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          {type === 'text' ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-red-500 flex items-center ml-1"
      >
        <AlertCircle size={14} className="mr-1" />
        {error}
      </motion.p>
    )}
  </div>
);

const Login = ({ onSectionChange, onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Account Selection State
  const [showAccountSelection, setShowAccountSelection] = useState(false);
  const [availableAccounts, setAvailableAccounts] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [enteringEmail, setEnteringEmail] = useState(false);
  const [enteringPassword, setEnteringPassword] = useState(false);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialPassword, setSocialPassword] = useState('');
  const [showSocialPassword, setShowSocialPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // await new Promise(resolve => setTimeout(resolve, 800)); // Network delay simulation removed
      const result = await loginUser(formData.email, formData.password);

      if (result.success) {
        onLogin();
        onSectionChange('dashboard');
      } else {
        setErrors({ general: result.error || 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setSelectedProvider(provider);
    setAvailableAccounts([]);
    setShowAccountSelection(true);
    setEnteringEmail(false);
    setEnteringPassword(false);
    setSocialEmail('');
    setSocialPassword('');
    setShowSocialPassword(false);
  };

  const createNewSocialAccount = async (e) => {
    e?.preventDefault();
    if (!socialEmail) return;

    // Transition to password step if not already there
    if (!enteringPassword) {
      setEnteringPassword(true);
      return;
    }

    if (!socialPassword) return;

    setIsLoading(true);
    setShowAccountSelection(false);
    try {
      const email = socialEmail;
      const provider = selectedProvider;

      const firstNames = ['James', 'Emma', 'Oliver', 'Ava', 'William', 'Sophia'];
      const lastNames = ['Smith', 'Johnson', 'Brown', 'Taylor', 'Miller', 'Davis'];

      const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];

      const profile = {
        personal: {
          firstName: randomFirst,
          lastName: randomLast,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(randomFirst + ' ' + randomLast)}&background=random&color=fff&format=png`
        }
      };

      const result = await googleAuth(email, profile);

      if (result.success) {
        onLogin();
        onSectionChange('dashboard');
      } else {
        setErrors({ general: result.error || 'Social login failed.' });
      }
    } catch (err) {
      setErrors({ general: 'Social login failed. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSelect = async (email) => {
    setIsLoading(true);
    setShowAccountSelection(false);

    // Find the selected account details
    const selectedAccount = availableAccounts.find(acc => acc.email === email);

    try {
      // For existing accounts in our mock list, we just log them in
      const result = await googleAuth(email, selectedAccount.profile);

      if (result.success) {
        onLogin();
        onSectionChange('dashboard');
      } else {
        setErrors({ general: result.error || 'Login failed.' });
      }
    } catch (err) {
      setErrors({ general: 'Login failed. Try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => onSectionChange('hero')}
          className="group absolute -top-16 left-0 flex items-center space-x-2 text-gray-500 hover:text-brand-green transition-colors pl-2"
        >
          <div className="p-2 bg-white/50 rounded-full group-hover:bg-white shadow-sm transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="font-medium">Back to Home</span>
        </button>

        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/60">
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-gradient-to-br from-brand-green to-brand-light rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand-green/20 mb-6 group"
            >
              <LogIn className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              id="email"
              label="Email"
              type="email"
              icon={Mail}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
            />

            <InputField
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              showPasswordToggle={true}
              onTogglePassword={() => setShowPassword(!showPassword)}
              error={errors.password}
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green/20 cursor-pointer" />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm font-medium text-brand-green hover:text-brand-dark transition-colors">
                Forgot password?
              </button>
            </div>

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start"
              >
                <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                {errors.general}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full py-4 text-base shadow-xl shadow-brand-green/20 hover:shadow-brand-green/30"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/50 backdrop-blur-sm text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span className="text-gray-700 font-medium">Google</span>
              </button>
              <button
                onClick={() => handleSocialLogin('facebook')}
                disabled={isLoading}
                className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white/50 group"
              >
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-gray-700 font-medium group-hover:text-[#1877F2] transition-colors">Facebook</span>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => onSectionChange('register')} className="font-semibold text-brand-green hover:text-brand-gold hover:underline transition-all">
                Sign up for free
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Account Selection Modal */}
      <AnimatePresence>
        {showAccountSelection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccountSelection(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    {enteringEmail ? 'Sign in' : 'Choose an account'}
                  </h3>
                  <button
                    onClick={() => setShowAccountSelection(false)}
                    className="p-1 rounded-full hover:bg-gray-100/50 transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>

                {enteringEmail ? (
                  <form onSubmit={createNewSocialAccount} className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-4">
                        to continue to EduHire
                      </p>
                      {enteringPassword ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                          <button
                            type="button"
                            onClick={() => setEnteringPassword(false)}
                            className="text-sm text-gray-500 mb-4 flex items-center hover:text-gray-700"
                          >
                            <ArrowLeft size={14} className="mr-1" /> {socialEmail}
                          </button>
                          <InputField
                            id="social-password"
                            label="Enter your password"
                            type={showSocialPassword ? 'text' : 'password'}
                            icon={Lock}
                            value={socialPassword}
                            onChange={(e) => setSocialPassword(e.target.value)}
                            showPasswordToggle={true}
                            onTogglePassword={() => setShowSocialPassword(!showSocialPassword)}
                          />
                        </div>
                      ) : (
                        <InputField
                          id="social-email"
                          label="Email or phone"
                          type="email"
                          icon={Mail}
                          value={socialEmail}
                          onChange={(e) => setSocialEmail(e.target.value)}
                        />
                      )}
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      {!enteringPassword && (
                        <button
                          type="button"
                          onClick={() => setEnteringEmail(false)}
                          className="px-4 py-2 text-sm font-medium text-brand-green hover:bg-brand-green/5 rounded-lg transition-colors"
                        >
                          Back
                        </button>
                      )}
                      <Button
                        type="submit"
                        className="px-6 py-2 text-sm shadow-lg shadow-brand-green/20"
                        disabled={enteringPassword ? !socialPassword : !socialEmail}
                      >
                        {enteringPassword ? 'Sign In' : 'Next'}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {availableAccounts.map((account, index) => (
                      <motion.button
                        key={account.email}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAccountSelect(account.email)}
                        className="w-full flex items-center p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-brand-green/5 border border-transparent hover:border-white/50 transition-all duration-200 group"
                      >
                        <img
                          src={account.profile?.personal?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent('User')}`}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full mr-4 border border-gray-100"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {account.profile?.personal?.firstName} {account.profile?.personal?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{account.email}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-green group-hover:translate-x-0.5 transition-all" />
                      </motion.button>
                    ))}

                    <div className="border-t border-gray-200/50 my-3"></div>

                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: availableAccounts.length * 0.1 }}
                      onClick={() => setEnteringEmail(true)}
                      className="w-full flex items-center p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-brand-green/5 border border-transparent hover:border-white/50 transition-all duration-200 group text-gray-600 hover:text-gray-900"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mr-4 group-hover:bg-brand-green/10 group-hover:text-brand-green transition-colors">
                        <UserPlus size={20} />
                      </div>
                      <div className="text-left font-medium">Use another account</div>
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-400">
                  To continue to <span className="font-medium text-gray-500">EduHire</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login; 