import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { Locale } from '../types';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { stories, activeStoryId } = useAppContext();
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useLocalization();

  const activeStory = stories.find(s => s.id === activeStoryId);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
        {activeStory ? activeStory.title : t('no_story_selected')}
      </h2>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
            {t('welcome')}, {user?.name || user?.email}
        </div>

        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value as Locale)}
          className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="ja">日本語</option>
        </select>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
        </button>

        <button onClick={logout} className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
            {t('sign_out')}
        </button>
      </div>
    </header>
  );
};

// SVG Icons
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default Header;
