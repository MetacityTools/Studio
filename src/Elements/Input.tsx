import React from 'react';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} onKeyDown={(e) => e.stopPropagation()} />;
}
