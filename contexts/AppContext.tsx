import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Story, Character, World, Chapter } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  stories: Story[];
  activeStoryId: string | null;
  addStory: (title: string) => void;
  updateStory: (story: Story) => void;
  deleteStory: (storyId: string) => void;
  setActiveStoryId: (storyId: string | null) => void;
  addCharacter: (storyId: string, character: Omit<Character, 'id'>) => void;
  updateCharacter: (storyId: string, character: Character) => void;
  deleteCharacter: (storyId: string, characterId: string) => void;
  addWorld: (storyId: string, world: Omit<World, 'id'>) => void;
  updateWorld: (storyId: string, world: World) => void;
  deleteWorld: (storyId: string, worldId: string) => void;
  addChapter: (storyId: string, chapter: Omit<Chapter, 'id'>) => void;
  updateChapter: (storyId: string, chapter: Chapter) => void;
  deleteChapter: (storyId: string, chapterId: string) => void;
  updateChaptersOrder: (storyId: string, chapters: Chapter[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    // This should not happen if AppProvider is used correctly within an authenticated context
    return <>{children}</>;
  }

  // User-specific keys for localStorage
  const storiesKey = `storywizard-stories-${user.id}`;
  const activeStoryIdKey = `storywizard-activeStoryId-${user.id}`;

  const [stories, setStories] = useLocalStorage<Story[]>(storiesKey, []);
  const [activeStoryId, setActiveStoryId] = useLocalStorage<string | null>(activeStoryIdKey, null);

  useEffect(() => {
    if(!activeStoryId && stories.length > 0) {
        setActiveStoryId(stories[0].id);
    }
    if(stories.length === 0) {
        setActiveStoryId(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stories, user.id]);

  const findStory = (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) throw new Error('Story not found');
    return story;
  }

  const updateStoryInList = (updatedStory: Story) => {
    setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
  }

  const addStory = (title: string) => {
    const newStory: Story = {
      id: crypto.randomUUID(),
      title,
      genre: '',
      tone: '',
      outline: '',
      chapters: [],
      characters: [],
      worlds: [],
    };
    setStories(prev => [...prev, newStory]);
    setActiveStoryId(newStory.id);
  };

  const updateStory = (story: Story) => {
    updateStoryInList(story);
  }

  const deleteStory = (storyId: string) => {
    setStories(prev => {
        const remainingStories = prev.filter(s => s.id !== storyId);
        if (activeStoryId === storyId) {
            setActiveStoryId(remainingStories.length > 0 ? remainingStories[0].id : null);
        }
        return remainingStories;
    });
  }

  const addCharacter = (storyId: string, characterData: Omit<Character, 'id'>) => {
    const story = findStory(storyId);
    const newCharacter: Character = { ...characterData, id: crypto.randomUUID() };
    const updatedStory = { ...story, characters: [...story.characters, newCharacter] };
    updateStoryInList(updatedStory);
  };
  
  const updateCharacter = (storyId: string, character: Character) => {
    const story = findStory(storyId);
    const updatedChars = story.characters.map(c => c.id === character.id ? character : c);
    updateStoryInList({ ...story, characters: updatedChars });
  };
  
  const deleteCharacter = (storyId: string, characterId: string) => {
    const story = findStory(storyId);
    const updatedChars = story.characters.filter(c => c.id !== characterId);
    updateStoryInList({ ...story, characters: updatedChars });
  };
  
  const addWorld = (storyId: string, worldData: Omit<World, 'id'>) => {
    const story = findStory(storyId);
    const newWorld: World = { ...worldData, id: crypto.randomUUID() };
    updateStoryInList({ ...story, worlds: [...story.worlds, newWorld] });
  };

  const updateWorld = (storyId: string, world: World) => {
    const story = findStory(storyId);
    const updatedWorlds = story.worlds.map(w => w.id === world.id ? world : w);
    updateStoryInList({ ...story, worlds: updatedWorlds });
  };
  
  const deleteWorld = (storyId: string, worldId: string) => {
    const story = findStory(storyId);
    const updatedWorlds = story.worlds.filter(w => w.id !== worldId);
    updateStoryInList({ ...story, worlds: updatedWorlds });
  };

  const addChapter = (storyId: string, chapterData: Omit<Chapter, 'id'>) => {
    const story = findStory(storyId);
    const newChapter: Chapter = { ...chapterData, id: crypto.randomUUID() };
    updateStoryInList({ ...story, chapters: [...story.chapters, newChapter] });
  };

  const updateChapter = (storyId: string, chapter: Chapter) => {
    const story = findStory(storyId);
    const updatedChapters = story.chapters.map(c => c.id === chapter.id ? chapter : c);
    updateStoryInList({ ...story, chapters: updatedChapters });
  };
  
  const deleteChapter = (storyId: string, chapterId: string) => {
    const story = findStory(storyId);
    const updatedChapters = story.chapters.filter(c => c.id !== chapterId);
    updateStoryInList({ ...story, chapters: updatedChapters });
  };

  const updateChaptersOrder = (storyId: string, chapters: Chapter[]) => {
    const story = findStory(storyId);
    updateStoryInList({...story, chapters: chapters});
  }

  const value = {
    stories, activeStoryId, addStory, updateStory, deleteStory, setActiveStoryId,
    addCharacter, updateCharacter, deleteCharacter,
    addWorld, updateWorld, deleteWorld,
    addChapter, updateChapter, deleteChapter, updateChaptersOrder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
