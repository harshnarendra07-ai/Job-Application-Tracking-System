"use client";

import { useAppStore, ApplicationStatus, JobApplication } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Activity, Target, Zap, Send } from 'lucide-react';

export function HeroMetrics() {
    const user = useAuthStore(state => state.user);
    const getApplications = useAppStore(state => state.getApplications);
    const applications = user ? getApplications(user.email) : [];
    const activeApplicationId = useAppStore(state => state.activeApplicationId);

    // Dynamic filtering based on active ledger row
    const displayApps = activeApplicationId
        ? applications.filter(app => app.id === activeApplicationId)
        : applications;

    const totalSent = displayApps.length;
    const interviews = displayApps.filter(a => a.status === ApplicationStatus.Interview || a.status === ApplicationStatus.Offer);

    // For a single active app, interview rate is just binary (100% or 0%)
    const interviewRate = totalSent > 0 ? Math.round((interviews.length / totalSent) * 100) : 0;

    const activeCount = displayApps.filter(a => [ApplicationStatus.Applied, ApplicationStatus.Screening, ApplicationStatus.Interview].includes(a.status)).length;

    const responseRate = displayApps.length > 0
        ? Math.round((displayApps.filter(app => app.status !== ApplicationStatus.Applied).length / displayApps.length) * 100)
        : 0;

    // Sort applications by most recent updates based on date (assuming dateApplied stands in for updates for now)
    const sortedApps = [...displayApps].sort((a: JobApplication, b: JobApplication) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());

    return (
        <Card className="col-span-4 row-span-1 bg-slate-900 flex items-center justify-between p-6 overflow-hidden relative group">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="space-y-4 w-full z-10">
                <div className="flex justify-between items-center text-slate-400">
                    <span className="text-sm font-medium tracking-wide flex items-center gap-2">
                        <Send className="w-4 h-4 text-emerald-400" />
                        Total Sent
                    </span>
                    <span className="text-2xl font-semibold text-slate-100">{totalSent}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                    <span className="text-sm font-medium tracking-wide flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-400" />
                        Interview Rate
                    </span>
                    <span className="text-2xl font-semibold text-slate-100">{interviewRate}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                    <span className="text-sm font-medium tracking-wide flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Active Pipeline
                    </span>
                    <span className="text-2xl font-semibold text-slate-100">{activeCount}</span>
                </div>
            </div>
        </Card>
    );
}
