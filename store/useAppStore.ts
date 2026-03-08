import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum ApplicationStatus {
    Applied = 'Applied',
    Screening = 'HR Screen',
    Interview = 'Tech Interview',
    Offer = 'Offer',
    Rejected = 'Rejected',
}

export interface JobApplication {
    id: string;
    companyName: string;
    role: string;
    dateApplied: string;
    status: ApplicationStatus;
    feedbackCategory: string;
    feedbackNotes: string;
    cvExcerpt?: string;
    jobDescription?: string;
    cv?: string;
    coverLetter?: string;
    compatibilityScore?: number;
}

export interface OptimizationResult {
    matchScore: number;
    keywordsMissing: string[];
    toneFeedback: string;
    actionableRewrites: { original: string; suggested: string }[];
}

interface AppState {
    applications: Record<string, JobApplication[]>;
    recentOptimization: OptimizationResult | null;
    activeApplicationId: string | null;
    setActiveApplication: (id: string | null) => void;
    setOptimizationResult: (result: OptimizationResult) => void;
    getApplications: (email: string) => JobApplication[];
    addApplication: (email: string, app: JobApplication) => void;
    updateApplication: (email: string, id: string, updatedApp: Partial<JobApplication>) => void;
    deleteApplication: (email: string, id: string) => void;
}

// Robust mock dataset - available for any new user instance
const mockApplications: JobApplication[] = [
    {
        id: 'app-1',
        companyName: 'Acme Corp',
        role: 'Frontend Engineer',
        dateApplied: '2026-03-01',
        status: ApplicationStatus.Offer,
        feedbackCategory: 'Success',
        feedbackNotes: 'Exceeded expectations in technical round. Great communication.',
        cvExcerpt: 'Built a responsive dashboard using React and Tailwind CSS.',
    },
    {
        id: 'app-2',
        companyName: 'TechNova',
        role: 'Full-Stack Developer',
        dateApplied: '2026-02-15',
        status: ApplicationStatus.Rejected,
        feedbackCategory: 'Technical Skills',
        feedbackNotes: 'Missing production experience with GraphQL and Apollo.',
        cvExcerpt: 'Integrated REST APIs for data visualization component.',
    },
    {
        id: 'app-3',
        companyName: 'GlobalTech Solutions',
        role: 'UX/UI Architect',
        dateApplied: '2026-03-05',
        status: ApplicationStatus.Interview,
        feedbackCategory: 'Pending',
        feedbackNotes: 'Scheduled for final design challenge presentation.',
        cvExcerpt: 'Led design system overhaul increasing user retention by 25%.',
    },
    {
        id: 'app-4',
        companyName: 'Nexus Innovations',
        role: 'React Developer',
        dateApplied: '2026-02-10',
        status: ApplicationStatus.Rejected,
        feedbackCategory: 'Salary mismatch',
        feedbackNotes: 'Candidate expected higher compensation than budgeted.',
        cvExcerpt: 'Developed high-performance trading platform interfaces.',
    },
    {
        id: 'app-5',
        companyName: 'Quantum Data',
        role: 'Frontend Engineer',
        dateApplied: '2026-02-28',
        status: ApplicationStatus.Screening,
        feedbackCategory: 'Pending',
        feedbackNotes: 'HR reaching out next week.',
        cvExcerpt: 'Maintained internal analytics dashboard using Next.js.',
    },
    {
        id: 'app-6',
        companyName: 'Cloudflare',
        role: 'UI Engineer',
        dateApplied: '2026-02-18',
        status: ApplicationStatus.Rejected,
        feedbackCategory: 'Missing React experience',
        feedbackNotes: 'Preference for stronger React expertise over Vue.',
        cvExcerpt: 'Remote team lead managing 5 developers using Vue.js.',
    },
    {
        id: 'app-7',
        companyName: 'Vercel',
        role: 'Design Engineer',
        dateApplied: '2026-03-07',
        status: ApplicationStatus.Applied,
        feedbackCategory: 'Pending',
        feedbackNotes: 'Application submitted successfully.',
        cvExcerpt: 'Expert in Framer Motion and complex SVG animations.',
    }
];

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            applications: {},
            recentOptimization: null,
            activeApplicationId: null,

            setActiveApplication: (id) => set({ activeApplicationId: id }),
            setOptimizationResult: (result) => set({ recentOptimization: result }),

            getApplications: (email) => {
                const state = get();
                // If user has no record, initialize them with mock data to showcase the app
                if (!state.applications[email]) {
                    set((s) => ({
                        applications: {
                            ...s.applications,
                            [email]: mockApplications,
                        }
                    }));
                    return mockApplications;
                }
                return state.applications[email];
            },

            addApplication: (email, app) => set((state) => ({
                applications: {
                    ...state.applications,
                    [email]: [app, ...(state.applications[email] || [])]
                }
            })),

            updateApplication: (email, id, updatedApp) => set((state) => {
                const userApps = state.applications[email] || [];
                return {
                    applications: {
                        ...state.applications,
                        [email]: userApps.map(app =>
                            app.id === id ? { ...app, ...updatedApp } : app
                        )
                    }
                };
            }),

            deleteApplication: (email, id) => set((state) => {
                const userApps = state.applications[email] || [];
                return {
                    applications: {
                        ...state.applications,
                        [email]: userApps.filter(app => app.id !== id)
                    }
                };
            }),
        }),
        {
            name: 'careerpulse-storage',
        }
    )
);
