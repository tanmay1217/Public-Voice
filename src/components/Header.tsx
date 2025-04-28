import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, HelpCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white">
            <span className="font-bold text-xl">पव</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Public Voice
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          
        </div>
      </div>
    </header>
  );
};

export default Header;