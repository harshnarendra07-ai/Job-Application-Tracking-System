"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, ArrowRight, User as UserIcon, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';

export default function LoginPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = useAuthStore(state => state.login);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) return;

        setIsLoading(true);

        // Simulate slight network delay for premium feel
        setTimeout(() => {
            login(name, email);
            router.push('/dashboard');
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {/* Background Decorators */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 shadow-glow mb-6">
                        <Activity className="w-8 h-8 text-blue-400 stroke-[1.5]" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-slate-50 to-slate-400 bg-clip-text text-transparent mb-2">
                        Welcome to CareerPulse
                    </h1>
                    <p className="text-slate-400 text-sm max-w-[280px]">
                        Your private, locally-encrypted application tracking and CV optimization suite.
                    </p>
                </div>

                <Card className="border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-glow overflow-hidden">
                    <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-emerald-400 to-emerald-500" />
                    <CardContent className="p-8">
                        <form onSubmit={handleLogin} className="space-y-6">

                            <div className="space-y-2 group">
                                <label className="text-[11px] font-mono uppercase tracking-widest text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="e.g. Jane Doe"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-[11px] font-mono uppercase tracking-widest text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="e.g. jane@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-sm font-semibold tracking-wide shadow-glow flex items-center justify-center gap-2 group"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                            >
                                                <Activity className="w-4 h-4 opacity-50" />
                                            </motion.div>
                                            Authenticating...
                                        </span>
                                    ) : (
                                        <>
                                            Enter Workspace
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-[10px] text-slate-600 font-mono tracking-wider uppercase">
                                    Data stored locally on this device
                                </p>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
