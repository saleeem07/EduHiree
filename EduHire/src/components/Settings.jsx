import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, Monitor, Save } from 'lucide-react';
import Button from './ui/Button';
import { useToast } from '../context/ToastContext';

const Settings = ({ onSectionChange }) => {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            marketing: false
        },
        privacy: {
            profileVisibility: 'public', // public, recruiters, private
            showEmail: false
        },
        appearance: {
            theme: 'light',
            compactMode: false
        }
    });

    const handleToggle = (category, setting) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: !prev[category][setting]
            }
        }));
    };

    const handleSelect = (category, setting, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [setting]: value
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        addToast('Settings saved successfully', 'success');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account preferences and configurations.</p>
                </div>

                <div className="space-y-6">
                    {/* Notifications Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                <Bell size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-500">Receive updates about job applications and interviews via email.</p>
                                </div>
                                <Toggle
                                    enabled={settings.notifications.email}
                                    onChange={() => handleToggle('notifications', 'email')}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                                    <p className="text-sm text-gray-500">Get real-time alerts on your device.</p>
                                </div>
                                <Toggle
                                    enabled={settings.notifications.push}
                                    onChange={() => handleToggle('notifications', 'push')}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                                    <p className="text-sm text-gray-500">Receive news, tips, and special offers.</p>
                                </div>
                                <Toggle
                                    enabled={settings.notifications.marketing}
                                    onChange={() => handleToggle('notifications', 'marketing')}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Privacy Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <Lock size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block font-medium text-gray-900 mb-2">Profile Visibility</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['public', 'recruiters', 'private'].map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleSelect('privacy', 'profileVisibility', option)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-colors ${settings.privacy.profileVisibility === option
                                                    ? 'bg-brand-green text-white border-brand-green'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    {settings.privacy.profileVisibility === 'public' && 'Your profile is visible to everyone.'}
                                    {settings.privacy.profileVisibility === 'recruiters' && 'Only verified recruiters can view your profile.'}
                                    {settings.privacy.profileVisibility === 'private' && 'Your profile is hidden from everyone.'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <h3 className="font-medium text-gray-900">Change Password</h3>
                                    <p className="text-sm text-gray-500">Update your account password.</p>
                                </div>
                                <Button variant="outline" size="sm">Update</Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Appearance Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                <Monitor size={20} />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Compact Mode</h3>
                                    <p className="text-sm text-gray-500">Reduce whitespace for a denser interface.</p>
                                </div>
                                <Toggle
                                    enabled={settings.appearance.compactMode}
                                    onChange={() => handleToggle('appearance', 'compactMode')}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto flex items-center justify-center gap-2">
                            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Toggle = ({ enabled, onChange }) => (
    <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 ${enabled ? 'bg-brand-green' : 'bg-gray-200'
            }`}
    >
        <span className="sr-only">Use setting</span>
        <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
        />
    </button>
);

export default Settings;
