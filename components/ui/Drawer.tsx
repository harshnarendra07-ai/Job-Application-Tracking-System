import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function Drawer({ isOpen, onClose, children, className, title }: DrawerProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 z-50 flex flex-col h-[50vh] backdrop-blur-md bg-slate-900/90 border-t border-slate-800 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-hidden",
                            className
                        )}
                    >
                        <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-1.5 bg-slate-700 rounded-full cursor-grab active:cursor-grabbing hover:bg-slate-600 transition-colors" />
                                {title && <h2 className="text-xl font-semibold text-slate-50">{title}</h2>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0" aria-label="Close drawer">
                                <X className="w-5 h-5 text-slate-400" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 pt-6 scrollbar-hide">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
