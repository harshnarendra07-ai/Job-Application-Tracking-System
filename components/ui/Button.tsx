import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none',
                    {
                        'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-glow focus:ring-blue-500': variant === 'primary',
                        'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 focus:ring-slate-500': variant === 'secondary',
                        'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500': variant === 'danger',
                        'bg-transparent text-slate-300 hover:text-white hover:bg-slate-800': variant === 'ghost',
                        'h-9 px-4 text-xs': size === 'sm',
                        'h-10 px-6 text-sm': size === 'md',
                        'h-12 px-8 text-base': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
