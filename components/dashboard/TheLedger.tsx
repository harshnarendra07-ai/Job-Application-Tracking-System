"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, ApplicationStatus, JobApplication } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ChevronDown, ChevronRight, Briefcase, Calendar, Building2, Trash2, Edit2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ApplicationFormModal } from './ApplicationFormModal';
import { useAuthStore } from '@/store/useAuthStore';

export function TheLedger() {
    const user = useAuthStore(state => state.user);
    const getApplications = useAppStore(state => state.getApplications);
    const deleteAppStore = useAppStore(state => state.deleteApplication);
    const updateAppStore = useAppStore(state => state.updateApplication);
    const setActiveApplication = useAppStore(state => state.setActiveApplication);

    const applications = user ? getApplications(user.email) : [];

    const deleteApplication = (id: string) => deleteAppStore(user!.email, id);
    const updateApplication = (id: string, updatedApp: Partial<JobApplication>) => updateAppStore(user!.email, id, updatedApp);

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

    const toggleRow = (id: string, e: React.MouseEvent) => {
        // Prevent toggle if clicking action buttons
        if ((e.target as HTMLElement).closest('.action-btn')) return;

        const isExpanding = expandedId !== id;
        setExpandedId(isExpanding ? id : null);
        setActiveApplication(isExpanding ? id : null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this application record?')) {
            deleteApplication(id);
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.Offer: return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case ApplicationStatus.Rejected: return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case ApplicationStatus.Interview: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case ApplicationStatus.Screening: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-800 text-slate-300 border-slate-700';
        }
    };

    return (
        <>
            <Card className="col-span-8 row-span-2 flex flex-col overflow-hidden group transition-all duration-200 hover:border-slate-700">
                <CardHeader className="py-3 px-5 border-b border-slate-800 bg-slate-900/50">
                    <CardTitle className="text-sm tracking-wider font-mono text-slate-400">Application History</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-y-auto min-h-[300px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 text-xs font-mono text-slate-500 border-b border-slate-800">
                            <tr>
                                <th className="px-5 py-3 font-medium w-8"></th>
                                <th className="px-5 py-3 font-medium"><div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Company</div></th>
                                <th className="px-5 py-3 font-medium"><div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Role</div></th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium"><div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</div></th>
                                <th className="px-5 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500">
                                        No applications found. Add one to get started.
                                    </td>
                                </tr>
                            ) : applications.map((app) => (
                                <React.Fragment key={app.id}>
                                    {/* Main Row */}
                                    <tr
                                        onClick={(e) => toggleRow(app.id, e)}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors"
                                    >
                                        <td className="px-5 py-3">
                                            {expandedId === app.id ?
                                                <ChevronDown className="w-4 h-4 text-slate-400" /> :
                                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                                            }
                                        </td>
                                        <td className="px-5 py-3 font-medium text-slate-200">{app.companyName}</td>
                                        <td className="px-5 py-3 text-slate-400">{app.role}</td>
                                        <td className="px-5 py-3">
                                            <span className={cn("px-2.5 py-0.5 rounded-full border text-[10px] uppercase font-bold tracking-wider", getStatusColor(app.status))}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500 font-mono">{app.dateApplied}</td>
                                        <td className="px-5 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="sm" className="action-btn h-7 w-7 p-0 rounded-md" onClick={() => setEditingApp(app)}>
                                                    <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="action-btn h-7 w-7 p-0 rounded-md hover:bg-rose-500/10" onClick={() => handleDelete(app.id)}>
                                                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* Expandable Details */}
                                    <AnimatePresence initial={false}>
                                        {expandedId === app.id && (
                                            <tr className="bg-slate-950/50 border-b border-slate-800/50">
                                                <td colSpan={6} className="p-0">
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-6 border-b border-slate-800/50 flex justify-between items-center bg-slate-900/30">
                                                            <div className="flex gap-4">
                                                                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider">General Notes</h4>
                                                                <p className="text-sm text-slate-300 max-w-lg truncate">{app.feedbackNotes || 'No specific notes recorded.'}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                {app.compatibilityScore !== undefined ? (
                                                                    <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-md border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                                                        <span className="text-xs font-mono uppercase text-blue-400">Match</span>
                                                                        <span className="text-sm font-bold text-blue-300">{app.compatibilityScore}%</span>
                                                                    </div>
                                                                ) : (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() => {
                                                                            // Trigger Mock Calculation
                                                                            const score = Math.floor(Math.random() * (95 - 45 + 1)) + 45;
                                                                            updateApplication(app.id, { compatibilityScore: score });
                                                                        }}
                                                                        disabled={!app.jobDescription || (!app.cv && !user?.generalInfo)}
                                                                        className="h-8 text-[11px] items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 disabled:opacity-50"
                                                                    >
                                                                        <Activity className="w-3.5 h-3.5" /> Analyze Compatibility
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="px-12 py-5 grid grid-cols-2 gap-8 text-slate-300">
                                                            <div>
                                                                <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Job Description</h4>
                                                                <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                                    {app.jobDescription || 'No targeted job description provided.'}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col gap-6">
                                                                <div>
                                                                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">CV / Resume Excerpt</h4>
                                                                    <div className="text-xs leading-relaxed font-mono italic text-slate-400 border-l-2 border-slate-800 pl-3 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                                        {app.cv || app.cvExcerpt || 'No targeted CV excerpt available for this application yet.'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Cover Letter Snippet</h4>
                                                                    <div className="text-xs leading-relaxed font-mono italic text-slate-400 border-l-2 border-slate-800 pl-3 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                                        {app.coverLetter || 'No cover letter attached.'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <ApplicationFormModal
                isOpen={!!editingApp}
                initialData={editingApp}
                onClose={() => setEditingApp(null)}
                onSubmit={(updatedApp) => updateApplication(editingApp!.id, updatedApp)}
            />
        </>
    );
}
