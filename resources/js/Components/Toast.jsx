import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-4 right-4 flex items-center p-4 mb-4 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
                {type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                )}
            </div>
            <div className="ml-3 text-sm font-normal">{message}</div>
            <button
                onClick={onClose}
                className="ml-4 -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

// Custom hook for managing toasts
export const useToast = () => {
    const [toasts, setToasts] = React.useState([]);

    const addToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return { toasts, addToast, removeToast };
};

export default Toast;