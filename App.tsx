
import React, { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AppProvider, useAppContext } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import StoryEditor from './pages/StoryEditor';
import CharacterCreator from './pages/CharacterCreator';
import WorldBuilder from './pages/WorldBuilder';
import Timeline from './pages/Timeline';
import { View } from './types';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ThemeProvider>
  );
};

const MainApp: React.FC = () => {
  const { theme } = useTheme();
  const { stories, activeStoryId } = useAppContext();
  const [activeView, setActiveView] = useState<View>(View.STORY_EDITOR);

  const activeStory = useMemo(() => {
    return stories.find(s => s.id === activeStoryId);
  }, [stories, activeStoryId]);

  const renderView = () => {
    if (!activeStory) {
        return <NoStorySelected />;
    }

    switch (activeView) {
      case View.STORY_EDITOR:
        return <StoryEditor story={activeStory} />;
      case View.CHARACTERS:
        return <CharacterCreator story={activeStory} />;
      case View.WORLDS:
        return <WorldBuilder story={activeStory} />;
      case View.TIMELINE:
        return <Timeline story={activeStory} />;
      default:
        return <StoryEditor story={activeStory} />;
    }
  };

  return (
    <div className={`${theme} font-sans`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};


const NoStorySelected: React.FC = () => {
    const { addStory } = useAppContext();
    const [title, setTitle] = useState('');

    const handleCreateStory = () => {
        if(title.trim()) {
            addStory(title.trim());
            setTitle('');
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-300 mb-4">Welcome to StoryWizard!</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                Begin your creative journey by creating your first story. Give it a title to start building your world.
            </p>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your story's title..."
                    className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                    onClick={handleCreateStory}
                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Create Story
                </button>
            </div>
        </div>
    );
};


export default App;
