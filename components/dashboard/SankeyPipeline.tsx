"use client";

import { ResponsiveSankey } from '@nivo/sankey';
import { useAppStore, ApplicationStatus } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

const data = {
    nodes: [
        { id: 'Applied', nodeColor: '#3b82f6' },
        { id: 'HR Screen', nodeColor: '#8b5cf6' },
        { id: 'Tech Interview', nodeColor: '#f59e0b' },
        { id: 'Culture Fit', nodeColor: '#ec4899' },
        { id: 'Offer', nodeColor: '#10b981' },
        { id: 'Rejected', nodeColor: '#f43f5e' }
    ],
    links: [
        { source: 'Applied', target: 'HR Screen', value: 45 },
        { source: 'Applied', target: 'Rejected', value: 30 },
        { source: 'HR Screen', target: 'Tech Interview', value: 25 },
        { source: 'HR Screen', target: 'Rejected', value: 15 },
        { source: 'Tech Interview', target: 'Culture Fit', value: 15 },
        { source: 'Tech Interview', target: 'Rejected', value: 10 },
        { source: 'Culture Fit', target: 'Offer', value: 5 },
        { source: 'Culture Fit', target: 'Rejected', value: 10 }
    ]
};

export function SankeyPipeline() {
    return (
        <Card className="col-span-8 row-span-2 flex flex-col group transition-all duration-200 hover:border-slate-700">
            <CardHeader className="py-3 px-5">
                <CardTitle className="text-sm tracking-wider font-mono text-slate-400">Conversion Flow</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 pb-6 min-h-[200px] relative">
                <ResponsiveSankey
                    data={data}
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                    align="justify"
                    colors={(node: any) => node.nodeColor}
                    nodeOpacity={1}
                    nodeThickness={16}
                    nodeInnerPadding={3}
                    nodeSpacing={24}
                    nodeBorderWidth={0}
                    nodeBorderRadius={3}
                    linkOpacity={0.35}
                    linkHoverOthersOpacity={0.1}
                    linkContract={2}
                    enableLinkGradient={true}
                    labelPosition="outside"
                    labelOrientation="horizontal"
                    labelPadding={12}
                    labelTextColor={(node: any) => node.nodeColor}
                    theme={{
                        text: {
                            fontFamily: 'Inter, sans-serif'
                        },
                        labels: {
                            text: {
                                fontSize: 12,
                                fontWeight: 600,
                                fill: '#f8fafc'
                            }
                        },
                        tooltip: {
                            container: {
                                background: '#0f172a',
                                color: '#f8fafc',
                                fontSize: 12,
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                            }
                        }
                    }}
                />
            </CardContent>
        </Card>
    );
}
