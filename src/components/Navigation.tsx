
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Zap, TrendingUp, Save, Bookmark } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/ai-tools', icon: Zap, label: 'AI Tools' },
    { path: '/crypto', icon: TrendingUp, label: 'Crypto' },
    { path: '/creative', icon: Bookmark, label: 'Creative' },
    { path: '/saved', icon: Save, label: 'Saved' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto md:left-auto md:right-auto">
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden bg-gray-900/95 backdrop-blur-lg border-t cyber-border">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 transition-all duration-300 ${
                  isActive 
                    ? 'text-cyan-400 cyber-glow' 
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs mt-1 font-inter">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Side Navigation */}
      <div className="hidden md:block w-64 h-screen bg-gray-900/95 backdrop-blur-lg cyber-border border-r fixed left-0 top-0">
        <div className="p-6">
          <h1 className="text-2xl font-playfair font-bold cyber-text-gradient mb-8">
            CyberPress
          </h1>
          <div className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-cyan-400/10 text-cyan-400 cyber-glow' 
                      : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-400/5'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-inter font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="cyber-card p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400 font-inter">Live Feed Active</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
