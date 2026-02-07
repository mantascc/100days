import React from 'react';

interface Props {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const SentimentInput: React.FC<Props> = ({ value, onChange, disabled, placeholder }) => {
    return (
        <div className="relative">
            <textarea
                className="relative w-full h-24 p-3 bg-white text-black rounded-lg border border-gray-200 focus:border-lime-primary focus:ring-1 focus:ring-lime-primary focus:outline-none transition-all resize-none text-base font-normal placeholder:text-gray-400 shadow-sm"
                placeholder={placeholder || "Type something to analyze..."}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-medium bg-white px-1.5 py-0.5 rounded border border-gray-100">
                {value.length}
            </div>
        </div>
    );
};
