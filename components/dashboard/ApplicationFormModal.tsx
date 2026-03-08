"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { JobApplication, ApplicationStatus } from '@/store/useAppStore';
import { extractTextFromFile } from '@/lib/fileParser';

interface ApplicationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (app: Partial<JobApplication>) => void;
    initialData?: JobApplication | null;
}

export function ApplicationFormModal({ isOpen, onClose, onSubmit, initialData }: ApplicationFormModalProps) {
    const [formData, setFormData] = useState<Partial<JobApplication>>({
        companyName: '',
        role: '',
        status: ApplicationStatus.Applied,
        feedbackNotes: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                companyName: '',
                role: '',
                status: ApplicationStatus.Applied,
                feedbackNotes: '',
                jobDescription: '',
                cv: '',
                coverLetter: '',
            });
        }
    }, [initialData, isOpen]);

    const [isParsingCv, setIsParsingCv] = useState(false);
    const [isParsingCover, setIsParsingCover] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cv' | 'coverLetter') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (field === 'cv') setIsParsingCv(true);
        if (field === 'coverLetter') setIsParsingCover(true);

        try {
            const text = await extractTextFromFile(file);
            setFormData(prev => ({ ...prev, [field]: text }));
        } catch (error: any) {
            console.error("Failed to parse document", error);
            alert(`Could not parse file: ${error?.message || error}. Please ensure it's a valid text-based PDF/DOCX or convert to .txt.`);
        } finally {
            if (field === 'cv') setIsParsingCv(false);
            if (field === 'coverLetter') setIsParsingCover(false);
        }

        // Reset input so the same file can be uploaded again if needed
        e.target.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.companyName || !formData.role) return;

        onSubmit({
            ...formData,
            // If it's a new app, generate a mock ID and date
            id: initialData?.id || `app-${Date.now()}`,
            dateApplied: initialData?.dateApplied || new Date().toISOString().split('T')[0],
            feedbackCategory: initialData?.feedbackCategory || 'Pending',
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-glow w-full max-w-lg overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                                <h2 className="text-lg font-semibold text-slate-50">
                                    {initialData ? 'Edit Application' : 'Add New Application'}
                                </h2>
                                <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-8 h-8 p-0">
                                    <X className="w-4 h-4 text-slate-400" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Company Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Target Role</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                        placeholder="e.g. Senior Frontend Engineer"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
                                    >
                                        {Object.values(ApplicationStatus).map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Feedback / Notes</label>
                                    <textarea
                                        value={formData.feedbackNotes}
                                        onChange={(e) => setFormData({ ...formData, feedbackNotes: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y h-20 placeholder:text-slate-600"
                                        placeholder="Any interview feedback, recruiter notes, or specific context..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Job Description</label>
                                    <textarea
                                        value={formData.jobDescription || ''}
                                        onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y h-32 placeholder:text-slate-600 font-mono text-xs"
                                        placeholder="Paste the full job description here..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Submitted CV</label>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 text-[10px] gap-1.5 px-2 relative overflow-hidden"
                                            disabled={isParsingCv}
                                        >
                                            <input
                                                type="file"
                                                accept=".txt,.md,.csv,.pdf,.docx"
                                                onChange={(e) => handleFileUpload(e, 'cv')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                title="Upload File"
                                            />
                                            {isParsingCv ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                                            Upload File
                                        </Button>
                                    </div>
                                    <textarea
                                        value={formData.cv || ''}
                                        onChange={(e) => setFormData({ ...formData, cv: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y h-32 placeholder:text-slate-600 font-mono text-xs"
                                        placeholder="Paste or upload the resume/CV tailored for this application..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Cover Letter</label>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            className="h-7 text-[10px] gap-1.5 px-2 relative overflow-hidden"
                                            disabled={isParsingCover}
                                        >
                                            <input
                                                type="file"
                                                accept=".txt,.md,.csv,.pdf,.docx"
                                                onChange={(e) => handleFileUpload(e, 'coverLetter')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                title="Upload File"
                                            />
                                            {isParsingCover ? <Loader2 className="w-3 h-3 animate-spin" /> : <UploadCloud className="w-3 h-3" />}
                                            Upload File
                                        </Button>
                                    </div>
                                    <textarea
                                        value={formData.coverLetter || ''}
                                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y h-32 placeholder:text-slate-600 font-mono text-xs"
                                        placeholder="Paste or upload the cover letter submitted with this application..."
                                    />
                                </div>
                            </form>

                            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                <Button type="submit" variant="primary" onClick={handleSubmit}>
                                    {initialData ? 'Save Changes' : 'Add Pipeline'}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
