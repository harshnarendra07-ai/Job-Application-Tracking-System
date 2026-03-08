"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Drawer } from '@/components/ui/Drawer';
import { useAppStore, OptimizationResult } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

function CircularGauge({ score }: { score: number }) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="transform -rotate-90 w-40 h-40 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <circle cx="80" cy="80" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    cx="80" cy="80" r="50" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={circumference}
                    className="text-blue-500 relative z-10"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-mono text-slate-50">{score}</span>
                <span className="text-xs text-slate-400 font-mono uppercase tracking-widest">Match</span>
            </div>
        </div>
    );
}

export default function OptimizePage() {
    const [jdText, setJdText] = useState('');
    const [cvText, setCvText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);
    const [activeTab, setActiveTab] = useState<'keywords' | 'tone' | 'rewrites'>('keywords');

    const setOptimizationResult = useAppStore(state => state.setOptimizationResult);
    const result = useAppStore(state => state.recentOptimization);

    const runAnalysis = () => {
        if (!jdText || !cvText) return;
        setIsAnalyzing(true);

        // Simulate AI Mock API Call
        setTimeout(() => {
            const mockResult: OptimizationResult = {
                matchScore: 82,
                keywordsMissing: ['GraphQL', 'Apollo Cache', 'Docker', 'CI/CD Pipelines'],
                toneFeedback: 'Too passive in describing achievements. The JD requires aggressive leadership traits. Missing focus on "scalable architecture" despite backend experience provided.',
                actionableRewrites: [
                    {
                        original: 'Worked on the data visualization component using React.',
                        suggested: 'Spearheaded the development of a high-performance data visualization engine in React, improving render times by 30%.'
                    },
                    {
                        original: 'Helped the team with REST API integrations.',
                        suggested: 'Architected robust REST API integrations bridging complex microservices with frontend UI.'
                    }
                ]
            };
            setOptimizationResult(mockResult);
            setIsAnalyzing(false);
            setShowDrawer(true);
        }, 3000);
    };

    return (
        <div className="min-h-screen flex flex-col">
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
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="text-slate-400">Back to Dashboard</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 relative max-w-[1600px] w-full mx-auto p-8 h-[calc(100vh-4rem)]">
                <div className="grid grid-cols-2 gap-8 h-full pb-16">
                    {/* Target Profile List */}
                    <Card className="flex flex-col h-full bg-slate-900 border-slate-800 shadow-xl overflow-hidden group">
                        <CardHeader className="bg-slate-900/50 border-b border-slate-800/50">
                            <CardTitle className="flex items-center gap-2 text-blue-400">
                                <TargetIcon className="w-5 h-5 stroke-[1.5]" />
                                Target Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative">
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder="Paste Job Description here..."
                                className="w-full h-full bg-transparent text-slate-200 text-sm font-sans p-6 resize-none focus:outline-none scrollbar-hide"
                            />
                        </CardContent>
                    </Card>

                    {/* Current Arsenal */}
                    <Card className="flex flex-col h-full bg-slate-900 border-slate-800 shadow-xl overflow-hidden group">
                        <CardHeader className="bg-slate-900/50 border-b border-slate-800/50">
                            <CardTitle className="flex items-center gap-2 text-emerald-400">
                                <FileText className="w-5 h-5 stroke-[1.5]" />
                                Current Arsenal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative group">
                            {!cvText && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-slate-500 pointer-events-none group-hover:bg-slate-800/20 transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-slate-800/50 flex flex-col items-center justify-center mb-4 border border-slate-700 border-dashed">
                                        <Upload className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-medium">Drag & Drop CV or Paste Text</p>
                                </div>
                            )}
                            <textarea
                                value={cvText}
                                onChange={(e) => setCvText(e.target.value)}
                                className="w-full h-full bg-transparent text-slate-200 text-sm font-sans p-6 resize-none focus:outline-none scrollbar-hide relative z-10 custom-scrollbar"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Floating Action Button */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                    <Button
                        size="lg"
                        onClick={runAnalysis}
                        disabled={!jdText || !cvText || isAnalyzing}
                        className="rounded-full shadow-glow disabled:shadow-none min-w-[240px] relative overflow-hidden"
                    >
                        {isAnalyzing ? (
                            <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4 animate-spin" />
                                Analyzing Pulse...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                Run Pulse Analysis
                            </span>
                        )}

                        {/* Scanning Animation overlay */}
                        {isAnalyzing && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent w-full"
                                animate={{ y: ['-100%', '200%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                        )}
                    </Button>
                </div>
            </main>

            {/* Results Drawer */}
            <Drawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Pulse Analysis Results"
            >
                {result && (
                    <div className="max-w-[1200px] mx-auto flex gap-12 h-full">
                        {/* Score Side */}
                        <div className="w-1/3 flex flex-col items-center justify-center pt-4">
                            <CircularGauge score={result.matchScore} />
                        </div>

                        {/* Details Side */}
                        <div className="w-2/3 flex flex-col h-full bg-slate-950/30 rounded-2xl border border-slate-800/50 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-slate-800/50 bg-slate-900/40">
                                {['keywords', 'tone', 'rewrites'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={cn(
                                            "flex-1 py-4 text-xs font-mono uppercase tracking-widest font-medium transition-colors border-b-2",
                                            activeTab === tab ? "border-blue-500 text-blue-400 bg-blue-500/5" : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                                        )}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            {/* Tab Content */}
                            <div className="flex-1 p-6 overflow-y-auto">
                                {activeTab === 'keywords' && (
                                    <div className="flex flex-wrap gap-2">
                                        {result.keywordsMissing.map((kw: string) => (
                                            <span key={kw} className="px-3 py-1.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-medium flex items-center gap-1.5">
                                                <AlertCircle className="w-4 h-4" /> {kw}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'tone' && (
                                    <ul className="space-y-4">
                                        {result.toneFeedback.split('. ').map((fb: string, i: number) => fb && (
                                            <li key={i} className="flex gap-3 text-slate-300 text-sm bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                                                <Activity className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                <span className="leading-relaxed">{fb}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {activeTab === 'rewrites' && (
                                    <div className="space-y-6">
                                        {result.actionableRewrites.map((rw, i) => (
                                            <div key={i} className="space-y-3 bg-slate-800/20 p-4 rounded-xl border border-slate-700/50">
                                                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-slate-400 text-sm line-through decoration-rose-500/50">
                                                    {rw.original}
                                                </div>
                                                <div className="flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-px h-6 bg-slate-700"></div>
                                                </div>
                                                <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20 text-slate-200 text-sm font-medium shadow-[rgba(59,130,246,0.1)_0px_0px_10px]">
                                                    {rw.suggested}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

function TargetIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}
