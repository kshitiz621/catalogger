"use client";

import { useState, useEffect } from "react";
import { 
  Menu, 
  X,
} from "lucide-react";

import LogoutButton from "@/components/LogoutButton";
import { cn } from "@/lib/utils";
import SidebarContent from "./SidebarContent";

export default function DashboardLayoutClient({
  children,
  store,
  session
}: {
  children: React.ReactNode;
  store: any;
  session: any;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen w-full bg-[#fafafa] overflow-hidden font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-shrink-0 z-30">
        <SidebarContent 
          store={store} 
          userName={session.user?.name || ""} 
          userEmail={session.user?.email || ""} 
          logoUrl={store?.logoUrl}
        />
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[280px] z-50 lg:hidden transform transition-transform duration-300 ease-in-out bg-white",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {isMobileMenuOpen && (
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 -right-12 p-2 bg-white rounded-lg shadow-lg lg:hidden border border-border/50 transition-all hover:bg-secondary focus:ring-2 focus:ring-primary/20"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        )}
        <SidebarContent 
          store={store} 
          userName={session.user?.name || ""} 
          userEmail={session.user?.email || ""} 
          logoUrl={store?.logoUrl}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
        />
      </aside>

      {/* Main UI Body */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Superior Header */}
        <header className="flex h-16 items-center justify-between border-b border-border/40 bg-white/80 backdrop-blur-md px-4 md:px-8 sticky top-0 z-20 transition-all">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">Dashboard</h2>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Dynamic header content could go here */}
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="mx-auto max-w-6xl w-full p-5 md:p-10 pb-20 md:pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
