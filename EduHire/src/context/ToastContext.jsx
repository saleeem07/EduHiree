import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

const Toast = ({ message, type, onClose }) => {
    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
    };

    const colors = {
        success: 'border-green-500 bg-white shadow-green-500/10',
        error: 'border-red-500 bg-white shadow-red-500/10',
        info: 'border-blue-500 bg-white shadow-blue-500/10'
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            layout
            className={`min-w-[320px] p-4 rounded-xl shadow-xl border-l-4 flex items-start gap-4 ${colors[type]} bg-white backdrop-blur-sm`}
        >
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1">
                <p className="text-gray-800 font-medium text-sm leading-tight">{message}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={16} />
            </button>
        </motion.div>
    );
};
