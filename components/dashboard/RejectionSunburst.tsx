"use client";

import { ResponsiveSunburst } from '@nivo/sunburst';
import { useAppStore, ApplicationStatus } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export function RejectionSunburst() {
    const user = useAuthStore(state => state.user);
    const getApplications = useAppStore(state => state.getApplications);
    const applications = user ? getApplications(user.email) : [];

    const rejectedApplications = applications.filter(app => app.status === ApplicationStatus.Rejected);

    // Helper function to count occurrences of a reason
    const countReason = (category: string) => {
        return rejectedApplications.filter(app => app.feedbackCategory === category).length;
    };

    // Dynamic Data structure for the sunburst chart
    const data = {
        name: "Rejections",
        children: [
            {
                name: "Technical",
                color: "#3b82f6", // blue-500
                children: [
                    { name: "Technical Skills", loc: countReason("Technical Skills") || 1, color: "#60a5fa" },
                    { name: "Missing React exp.", loc: countReason("Missing React experience") || 1, color: "#93c5fd" },
                    { name: "System Design", loc: countReason("System Design") || 1, color: "#bfdbfe" }
                ]
            },
            {
                name: "Culture",
                color: "#f43f5e", // rose-500
                children: [
                    { name: "Salary mismatch", loc: countReason("Salary mismatch") || 1, color: "#fb7185" },
                    { name: "Remote policy", loc: countReason("Remote policy") || 1, color: "#fda4af" },
                    { name: "Availability", loc: countReason("Availability") || 1, color: "#fecdd3" }
                ]
            }
        ]
    };

    return (
        <Card className="col-span-4 row-span-3 flex flex-col group transition-all duration-200 hover:border-slate-700">
            <CardHeader className="py-3 px-5 border-b border-slate-800">
                <CardTitle className="text-sm tracking-wider font-mono text-slate-400">Post-Mortem Analysis</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 min-h-[350px]">
                <ResponsiveSunburst
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    id="name"
                    value="loc"
                    cornerRadius={4}
                    borderWidth={1}
                    borderColor="#0f172a"
                    colors={(node: any) => node.data.color || node.color}
                    childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
                    enableArcLabels={true}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor="#ffffff"
                    theme={{
                        text: { fontFamily: 'Inter, sans-serif' },
                        labels: { text: { fontSize: 11, fontWeight: 600 } },
                        tooltip: {
                            container: {
                                background: '#0f172a',
                                color: '#f8fafc',
                                fontSize: 12,
                                borderRadius: '8px',
                            }
                        }
                    }}
                />
            </CardContent>
        </Card>
    );
}
