"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const user = useAuthStore(state => state.user);
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (!user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, pathname, router, isMounted]);

    // Prevent layout thrashing on initial load before Zustand hydration finishes
    if (!isMounted) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center" />;
    }

    // If there's no user and we're not on the login page, render nothing while redirecting
    if (!user && pathname !== '/login') {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center" />;
    }

    return <>{children}</>;
}
