import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastComponent: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 5000); // Auto-close after 5 seconds

        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
    };

    const iconStyles = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div
            className={`${typeStyles[toast.type]} border rounded-lg p-4 shadow-lg flex items-center justify-between min-w-[300px] max-w-md`}
        >
            <div className="flex items-center gap-3">
                <span className="text-xl font-bold">{iconStyles[toast.type]}</span>
                <p className="font-medium">{toast.message}</p>
            </div>
            <button
                onClick={() => onClose(toast.id)}
                className="ml-4 text-gray-500 hover:text-gray-700 font-bold"
            >
                ×
            </button>
        </div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
            ))}
        </div>
    );
};
