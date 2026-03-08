"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const user = useAuthStore(state => state.user);
    const updateProfile = useAuthStore(state => state.updateProfile);
    const [generalInfo, setGeneralInfo] = useState('');
    const [sectorsString, setSectorsString] = useState('');
    const [skillsString, setSkillsString] = useState('');

    const suggestionDictionary: Record<string, string[]> = {
        'technology': ['+ Built full-stack web applications', '+ Integrated RESTful APIs & GraphQL', '+ Automated CI/CD pipelines', '+ Led Agile development sprints'],
        'software': ['+ Designed scalable system architecture', '+ Optimized database queries', '+ Refactored legacy codebases', '+ Implemented TDD practices'],
        'healthcare': ['+ Ensured strict HIPAA compliance', '+ Managed digital patient records', '+ Improved clinical operational efficiency', '+ Liaised with medical staff'],
        'finance': ['+ Built secure fintech payment gateways', '+ Analyzed complex market datasets', '+ Automated financial reporting', '+ Ensured SOC2 data compliance'],
        'design': ['+ Created high-fidelity Figma prototypes', '+ Conducted extensive user research', '+ Built accessible UI components', '+ Established cohesive design systems'],
        'marketing': ['+ Executed data-driven SEO strategies', '+ Managed cross-channel ad campaigns', '+ Increased conversion rates by 20%', '+ Coordinated brand messaging']
    };

    // Derived suggestions based on current sector input
    const derivedSuggestions = React.useMemo(() => {
        if (!sectorsString) return [];
        const activeSectors = sectorsString.toLowerCase().split(',').map(s => s.trim());
        const suggestions = new Set<string>();

        activeSectors.forEach(sector => {
            // Check if any key in dictionary matches a substring of the sector or vice-versa
            Object.entries(suggestionDictionary).forEach(([key, list]) => {
                if (sector && (key.includes(sector) || sector.includes(key))) {
                    list.forEach(item => suggestions.add(item));
                }
            });
        });

        return Array.from(suggestions).slice(0, 5); // Return up to 5 unique suggestions
    }, [sectorsString]);

    useEffect(() => {
        if (isOpen && user) {
            setGeneralInfo(user.generalInfo || '');
            setSectorsString(user.sectors ? user.sectors.join(', ') : '');
            setSkillsString(user.skills ? user.skills.join(', ') : '');
        }
    }, [isOpen, user]);

    const handleSave = () => {
        const parsedSkills = skillsString.split(',').map(s => s.trim()).filter(Boolean);
        const parsedSectors = sectorsString.split(',').map(s => s.trim()).filter(Boolean);
        updateProfile({
            generalInfo,
            sectors: parsedSectors,
            skills: parsedSkills
        });
        onClose();
    };

    if (!user) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-glow overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900 z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                    <User className="w-5 h-5 text-blue-400 stroke-[1.5]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Profile Settings</h2>
                                    <p className="text-sm text-slate-400">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5 stroke-[1.5]" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto w-full flex-grow">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="sector" className="block text-sm font-medium text-slate-300 mb-2">
                                            Target Sectors
                                        </label>
                                        <p className="text-xs text-slate-500 mb-2">
                                            Comma-separated list of your core industries.
                                        </p>
                                        <input
                                            id="sector"
                                            type="text"
                                            value={sectorsString}
                                            onChange={(e) => setSectorsString(e.target.value)}
                                            placeholder="E.g., Software, Financial Technology"
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-2">
                                            Core Skills
                                        </label>
                                        <p className="text-xs text-slate-500 mb-2">
                                            Comma-separated list of your primary abilities.
                                        </p>
                                        <input
                                            id="skills"
                                            type="text"
                                            value={skillsString}
                                            onChange={(e) => setSkillsString(e.target.value)}
                                            placeholder="React, TypeScript, UI/UX..."
                                            className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="h-px bg-slate-800/80 w-full" />
                                <div>
                                    <label htmlFor="general-info" className="block text-sm font-medium text-slate-300 mb-2">
                                        General Information (Bio & Experience)
                                    </label>
                                    <p className="text-xs text-slate-500 mb-3">
                                        This information is used to evaluate your compatibility with different job descriptions in your application pipeline. Be as detailed as you like.
                                    </p>
                                    <textarea
                                        id="general-info"
                                        value={generalInfo}
                                        onChange={(e) => setGeneralInfo(e.target.value)}
                                        placeholder="E.g., Senior Full-Stack Engineer with 5 years of React and Node.js experience..."
                                        className="w-full h-40 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 resize-y transition-all"
                                    />
                                    {derivedSuggestions.length > 0 && (
                                        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                                            <p className="text-xs font-medium text-blue-400 mb-3 flex items-center gap-2">
                                                <Zap className="w-3.5 h-3.5" /> Sector-based Suggestions
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {derivedSuggestions.map((suggestion, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setGeneralInfo(prev => prev ? `${prev}\n${suggestion.replace('+ ', '• ')}` : suggestion.replace('+ ', '• '))}
                                                        className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-[11px] text-slate-300 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer text-left"
                                                    >
                                                        {suggestion}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-800/80 bg-slate-900/50 flex justify-end gap-3 shrink-0">
                            <Button onClick={onClose} variant="secondary">Cancel</Button>
                            <Button onClick={handleSave} className="gap-2 shrink-0 border border-blue-500/50 shadow-glow">
                                <Save className="w-4 h-4 stroke-[2]" /> Save Profile
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
