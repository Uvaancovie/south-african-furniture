import { PublicHeader } from '@/components/public-header';
import { PublicFooter } from '@/components/public-footer';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function CatalogLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <PublicHeader />
            <div className="flex flex-1">
                <AppShell variant="sidebar">
                    <AppSidebar />
                    <AppContent variant="sidebar" className="overflow-x-hidden">
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        {children}
                    </AppContent>
                </AppShell>
            </div>
            <PublicFooter />
        </div>
    );
}
