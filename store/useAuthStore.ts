import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    name: string;
    email: string;
    avatarSeed: number; // For consistently generating the same random avatar
    generalInfo?: string;
    skills?: string[];
    sectors?: string[];
}

interface AuthState {
    user: User | null;
    login: (name: string, email: string) => void;
    logout: () => void;
    updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (name, email) => set({
                user: {
                    name,
                    email: email.toLowerCase(),
                    avatarSeed: Math.floor(Math.random() * 1000)
                }
            }),
            logout: () => set({ user: null }),
            updateProfile: (updates: Partial<User>) => set((state) => ({
                user: state.user ? { ...state.user, ...updates } : null
            })),
        }),
        {
            name: 'careerpulse-auth',
        }
    )
);
