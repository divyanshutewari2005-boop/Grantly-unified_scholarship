import React, { useState } from 'react';
import { AppSidebar } from './AppSidebar.tsx';
import { AppTopbar } from './AppTopbar.tsx';
import { AppRightRail } from './AppRightRail.tsx';
import { CommandPalette } from './CommandPalette.tsx';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showRightRail?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showRightRail = true
}) => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col antialiased">
      <div className="flex flex-1 min-h-screen relative">
        {/* Desktop Fixed Left Sidebar */}
        <AppSidebar className="hidden lg:flex" />

        {/* Mobile Slide-over Drawer for Left Sidebar */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 h-full">
              <AppSidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Central Content Column & Right Rail */}
        <div className="flex-1 flex flex-col min-w-0">
          <AppTopbar
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />

          <main className="flex-1 p-3 sm:p-4 lg:p-5 max-w-[1800px] w-full mx-auto">
            <div className="flex flex-col xl:flex-row gap-5 items-start">
              {/* Main Page Area */}
              <div className="flex-1 min-w-0 w-full space-y-6">
                {children}
              </div>

              {/* Right Rail (Desktop & Tablet) */}
              {showRightRail && (
                <div className="w-full xl:w-[330px] 2xl:w-[360px] shrink-0">
                  <AppRightRail />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Ctrl + K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};
