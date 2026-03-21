import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Flame, BarChart3, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = [
  { path: '/', icon: Flame, label: 'Streak' },
  { path: '/stats', icon: BarChart3, label: 'Stats' },
  { path: '/motivation', icon: Sparkles, label: 'Quotes' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

// Per-tab history stack — persists across renders
const tabHistories = {
  '/': ['/'],
  '/stats': ['/stats'],
  '/motivation': ['/motivation'],
  '/settings': ['/settings'],
};

function getTabRoot(pathname) {
  const tab = TABS.find(t => t.path !== '/' ? pathname.startsWith(t.path) : pathname === '/');
  return tab ? tab.path : '/';
}

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = getTabRoot(location.pathname);

  // When location changes, push to the correct tab history
  useEffect(() => {
    const root = getTabRoot(location.pathname);
    const stack = tabHistories[root];
    if (stack[stack.length - 1] !== location.pathname) {
      stack.push(location.pathname);
    }
  }, [location.pathname]);

  const handleTabPress = (tabPath) => {
    if (tabPath === activeTab) {
      // Already on this tab — pop to root (like iOS native tab bar)
      tabHistories[tabPath] = [tabPath];
      navigate(tabPath, { replace: true });
    } else {
      // Restore last visited page within that tab
      const stack = tabHistories[tabPath];
      navigate(stack[stack.length - 1]);
    }
  };

  return (
    <div
      className="bg-background flex flex-col"
      style={{ height: '100%', paddingTop: 'var(--sat)' }}
    >
      <main className="flex-1 overflow-y-auto overscroll-none relative" style={{ paddingBottom: 'calc(4rem + var(--sab))' }}>
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border z-50"
        style={{ paddingBottom: 'var(--sab)' }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {TABS.map((item) => {
            const isActive = activeTab === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleTabPress(item.path)}
                className="relative flex flex-col items-center gap-0.5 py-1 px-3 select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}