import React from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const HowItWorks: React.FC<Props> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    ✕
                </button>

                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-900 mb-4">
                    How this works
                </h3>

                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    Local sentiment analysis meets reactive visual feedback.<br />
                    Write something, watch the interface react.
                </p>

                <div className="text-xs text-gray-500 flex items-center gap-2">

                    <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">transformers.js</span>
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-800">Giphy API</span>
                </div>
            </div>
        </div>
    );
};
