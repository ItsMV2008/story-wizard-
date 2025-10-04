import React from 'react';
import { View } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { stories, activeStoryId, setActiveStoryId, addStory, deleteStory } = useAppContext();
  const { t } = useLocalization();

  const handleCreateStory = () => {
    const title = prompt(t('enter_story_title_prompt'));
    if (title) {
        addStory(title);
    }
  }

  const handleDeleteStory = () => {
    if (activeStoryId && confirm(t('confirm_delete_story'))) {
        deleteStory(activeStoryId);
    }
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <BookIcon className="h-8 w-8 text-primary-500" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">StoryWizard</h1>
      </div>

      <div className="mb-4">
        <label htmlFor="story-select" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{t('current_story')}</label>
        <div className="flex items-center gap-2">
            <select
              id="story-select"
              value={activeStoryId || ''}
              onChange={(e) => setActiveStoryId(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {stories.map(story => (
                <option key={story.id} value={story.id}>{story.title}</option>
              ))}
            </select>
            {activeStoryId && (
                <button onClick={handleDeleteStory} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" title={t('delete_story')}>
                    <TrashIcon className="h-4 w-4" />
                </button>
            )}
        </div>
      </div>
      <button onClick={handleCreateStory} className="w-full mb-6 py-2 px-4 bg-primary-600 text-white rounded-md text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
        <PlusIcon className="h-4 w-4" /> {t('new_story')}
      </button>

      <nav className="flex-1 space-y-2">
        <NavItem icon={<PencilIcon className="h-5 w-5" />} label={t('story_editor')} view={View.STORY_EDITOR} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<UsersIcon className="h-5 w-5" />} label={t('characters')} view={View.CHARACTERS} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<GlobeIcon className="h-5 w-5" />} label={t('worlds')} view={View.WORLDS} activeView={activeView} onClick={setActiveView} />
        <NavItem icon={<ListIcon className="h-5 w-5" />} label={t('timeline')} view={View.TIMELINE} activeView={activeView} onClick={setActiveView} />
      </nav>
      
      <div className="mt-auto text-center text-xs text-gray-400 dark:text-gray-500">
        <p>&copy; 2024 StoryWizard</p>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  view: View;
  activeView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, view, activeView, onClick }) => {
  const isActive = activeView === view;
  return (
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(view); }}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
};

// SVG Icons
const BookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
  
  const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
  
  const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
  
  const GlobeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
  
  const ListIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );

  const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );

  const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );

export default Sidebar;
