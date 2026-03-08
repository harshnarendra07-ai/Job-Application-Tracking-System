"use client";

import { useState, useEffect } from 'react';
import { HeroMetrics } from '@/components/dashboard/HeroMetrics';
import { SankeyPipeline } from '@/components/dashboard/SankeyPipeline';
import { RejectionSunburst } from '@/components/dashboard/RejectionSunburst';
import { TheLedger } from '@/components/dashboard/TheLedger';
import { Activity, Plus, Download, LogOut, ChevronDown, Settings, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ApplicationFormModal } from '@/components/dashboard/ApplicationFormModal';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const router = useRouter();

    const user = useAuthStore(state => state.user);
    const logout = useAuthStore(state => state.logout);
    const getApplications = useAppStore(state => state.getApplications);
    const addApplication = useAppStore(state => state.addApplication);

    // Safe default to prevent hydration mismatches before auth state loads
    const applications = user ? getApplications(user.email) : [];

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleExportCSV = () => {
        if (applications.length === 0) return;

        const headers = ['Company Name', 'Role', 'Status', 'Date Applied', 'Feedback Category', 'Feedback Notes'];
        const csvContent = [
            headers.join(','),
            ...applications.map(app => [
                `"${app.companyName}"`,
                `"${app.role}"`,
                `"${app.status}"`,
                `"${app.dateApplied}"`,
                `"${app.feedbackCategory}"`,
                `"${app.feedbackNotes.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `careerpulse-${user?.name?.replace(/\s+/g, '-').toLowerCase()}-report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-30">
                <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 shadow-glow">
                            <Activity className="w-5 h-5 text-blue-400 stroke-[1.5]" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-br from-slate-50 to-slate-400 bg-clip-text text-transparent">
                            CareerPulse
                        </h1>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-6 ml-12">
                        <div className="flex gap-3">
                            <Button size="sm" onClick={() => setIsModalOpen(true)} className="gap-2 shadow-glow font-semibold tracking-wide">
                                <Plus className="w-4 h-4" /> Add Application
                            </Button>
                            <Button variant="secondary" size="sm" onClick={handleExportCSV} className="gap-2 text-slate-300">
                                <Download className="w-4 h-4" /> Export Report
                            </Button>
                        </div>

                        <div className="h-6 w-px bg-slate-800" />

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-3 p-1.5 pl-2 pr-3 rounded-full hover:bg-slate-800/50 transition-colors group"
                            >
                                <img
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.avatarSeed}&backgroundColor=0f172a`}
                                    alt={user.name}
                                    className="w-7 h-7 rounded-full border border-slate-700 bg-slate-900 group-hover:border-blue-500/50 transition-colors"
                                />
                                <div className="hidden md:block text-left">
                                    <p className="text-xs font-medium text-slate-200 leading-tight">{user.name}</p>
                                </div>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
                            </button>

                            {showProfileMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-glow overflow-hidden z-50 py-1">
                                        <div className="px-4 py-3 border-b border-slate-800/50 mb-1">
                                            <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                setIsProfileModalOpen(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-2"
                                        >
                                            <Settings className="w-3.5 h-3.5" /> Profile Settings
                                        </button>
                                        <Link href="/optimize" onClick={() => setShowProfileMenu(false)}>
                                            <div className="px-4 py-2 text-sm text-slate-300 hover:bg-slate-800/50 hover:text-blue-400 cursor-pointer transition-colors w-full text-left flex items-center gap-2">
                                                <Zap className="w-3.5 h-3.5" /> CV Optimizer
                                            </div>
                                        </Link>
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors flex items-center gap-2">
                                            <LogOut className="w-3.5 h-3.5" /> Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto p-8">
                <div className="grid grid-cols-12 gap-6 auto-rows-[140px]">
                    <HeroMetrics />
                    <SankeyPipeline />
                    <RejectionSunburst />
                    <TheLedger />
                </div>
            </main>

            <ApplicationFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={(app) => addApplication(user.email, app as any)}
            />

            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
}
