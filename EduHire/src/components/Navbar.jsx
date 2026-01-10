import React, { useState, useRef, useEffect } from 'react';
import { Settings, Bell, User, LogIn, Home, UserPlus, FileText, Upload, Briefcase, LogOut, UserCheck, RefreshCw, Menu, X } from 'lucide-react';
import { clearCurrentUser } from '../utils/userData';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileMenu = ({ currentUser, onSectionChange, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((s) => !s)}
        className="p-1 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img
          src={currentUser?.profile?.personal?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
          alt="Profile"
          className={`w-9 h-9 rounded-full object-cover border-2 transition-colors ${open ? 'border-brand-gold' : 'border-brand-green'}`}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 py-3 z-50 ring-1 ring-black/5"
          >
            <div className="px-5 py-3 border-b border-gray-100 mb-2 bg-gray-50/50 rounded-t-2xl">
              <p className="text-sm font-bold text-gray-800 truncate">{currentUser?.profile?.personal?.firstName || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{typeof currentUser === 'string' ? currentUser : currentUser?.email}</p>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onSectionChange('dashboard');
                  setOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-brand-green/5 hover:text-brand-green transition-all"
              >
                <Home size={18} className="text-gray-400 group-hover:text-brand-green" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  onSectionChange('student-profile'); // View Profile Mode (if intended) or ProfileBuilder
                  setOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-brand-green/5 hover:text-brand-green transition-all"
              >
                <User size={18} className="text-gray-400 group-hover:text-brand-green" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onSectionChange('profile');
                  setOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-brand-green/5 hover:text-brand-green transition-all"
              >
                <UserCheck size={18} className="text-gray-400 group-hover:text-brand-green" />
                <span>Complete Profile</span>
              </button>

              <button
                onClick={() => {
                  onSectionChange('settings');
                  setOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-2.5 text-left text-sm text-gray-700 hover:bg-brand-green/5 hover:text-brand-green transition-all"
              >
                <Settings size={18} className="text-gray-400 group-hover:text-brand-green" />
                <span>Settings</span>
              </button>
            </div>

            <div className="border-t border-gray-100 my-2 pt-2">
              <button
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`p-2.5 rounded-xl transition-all duration-200 relative group ${active
      ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20'
      : 'text-gray-600 hover:bg-white hover:text-brand-green hover:shadow-md'
      }`}
    title={label}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    {active && (
      <motion.span
        layoutId="activeTab"
        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-brand-gold rounded-full transform -translate-x-1/2"
      />
    )}
  </motion.button>
);

const Navbar = ({ isLoggedIn, onLogin, onSectionChange, onLogout, currentUser }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20'
        : 'bg-transparent'
        }`}
    >
      <div className="site-container">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Logo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => isLoggedIn ? onSectionChange('dashboard') : onSectionChange('hero')}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-green to-brand-light flex items-center justify-center shadow-lg shadow-brand-green/20 group-hover:shadow-brand-green/30 transition-all duration-300">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-brand-green group-hover:to-brand-light transition-all duration-300">
              EduHire
            </span>
          </motion.button>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {isLoggedIn && (
              <ProfileMenu currentUser={currentUser} onSectionChange={onSectionChange} onLogout={onLogout} />
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-brand-green hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center bg-gray-100/50 p-1.5 rounded-2xl border border-white/50 backdrop-blur-sm">
                  <NavButton icon={Home} label="Dashboard" onClick={() => onSectionChange('dashboard')} />
                  <NavButton icon={UserPlus} label="Profile Builder" onClick={() => onSectionChange('profile')} />
                  <NavButton icon={FileText} label="Templates" onClick={() => onSectionChange('resume-ai')} />
                  <NavButton icon={Upload} label="Upload" onClick={() => onSectionChange('upload')} />
                </div>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                <motion.button
                  whileHover={{ rotate: 15 }}
                  className="p-2.5 text-gray-600 hover:text-brand-green hover:bg-white rounded-xl hover:shadow-md transition-all duration-200 relative"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-gold rounded-full ring-2 ring-white"></span>
                </motion.button>

                <ProfileMenu currentUser={currentUser} onSectionChange={onSectionChange} onLogout={onLogout} />
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => { clearCurrentUser(); localStorage.removeItem('eduhire_users'); window.location.reload(); }}
                  title="Reset Demo"
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <RefreshCw size={18} />
                </button>
                <div className="h-6 w-px bg-gray-300"></div>
                <Button
                  onClick={() => onSectionChange('login')}
                  variant="ghost"
                  className="hover:bg-brand-green/5 text-brand-green"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => onSectionChange('register')}
                  className="shadow-lg shadow-brand-green/20"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-xl border-t border-gray-100"
            >
              <div className="p-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { onSectionChange('dashboard'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Home size={20} className="text-gray-400" />
                      <span className="font-medium">Dashboard</span>
                    </button>
                    <button
                      onClick={() => { onSectionChange('profile'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <UserPlus size={20} className="text-gray-400" />
                      <span className="font-medium">Profile Builder</span>
                    </button>
                    <button
                      onClick={() => { onSectionChange('resume-ai'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <FileText size={20} className="text-gray-400" />
                      <span className="font-medium">Templates</span>
                    </button>
                    <button
                      onClick={() => { onSectionChange('upload'); setMobileMenuOpen(false); }}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Upload size={20} className="text-gray-400" />
                      <span className="font-medium">Upload</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => { onSectionChange('login'); setMobileMenuOpen(false); }}
                      variant="ghost"
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => { onSectionChange('register'); setMobileMenuOpen(false); }}
                      className="w-full justify-start"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
export default Navbar; 