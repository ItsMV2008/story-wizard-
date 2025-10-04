import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Story, Character, World, Chapter, Item, Illustration } from '../types';
import { useAuth } from './AuthContext';

interface AppContextType {
  stories: Story[];
  activeStoryId: string | null;
  addStory: (title: string) => void;
  updateStory: (story: Story) => void;
  deleteStory: (storyId: string) => void;
  setActiveStoryId: (storyId: string | null) => void;
  cloneStory: (story: Story) => void; // Add cloneStory
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
  addItem: (storyId: string, item: Omit<Item, 'id'>) => void;
  updateItem: (storyId: string, item: Item) => void;
  deleteItem: (storyId: string, itemId: string) => void;
  addIllustration: (storyId: string, illustration: Omit<Illustration, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const storiesKey = user ? `storywizard-stories-${user.id}` : 'storywizard-stories-nouser';
  const activeStoryIdKey = user ? `storywizard-activeStoryId-${user.id}` : 'storywizard-activeStoryId-nouser';

  const [stories, setStories] = useLocalStorage<Story[]>(storiesKey, []);
  const [activeStoryId, setActiveStoryId] = useLocalStorage<string | null>(activeStoryIdKey, null);
  
  useEffect(() => {
    if (!user) {
        setStories([]);
        setActiveStoryId(null);
    }
  }, [user, setStories, setActiveStoryId]);


  useEffect(() => {
    if(user && !activeStoryId && stories.length > 0) {
        setActiveStoryId(stories[0].id);
    }
    if(user && stories.length === 0) {
        setActiveStoryId(null);
    }
  }, [stories, user, setActiveStoryId]);

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
      items: [],
      illustrations: [],
    };
    setStories(prev => [...prev, newStory]);
    setActiveStoryId(newStory.id);
  };
  
  const cloneStory = (storyToClone: Story) => {
    // Deep copy and assign new IDs to nested objects to prevent reference issues.
    const newStory: Story = {
      ...JSON.parse(JSON.stringify(storyToClone)),
      id: crypto.randomUUID(),
      author: undefined, // Remove community author
    };
    newStory.characters.forEach(c => c.id = crypto.randomUUID());
    newStory.worlds.forEach(w => w.id = crypto.randomUUID());
    newStory.chapters.forEach(c => c.id = crypto.randomUUID());
    newStory.items.forEach(i => i.id = crypto.randomUUID());
    newStory.illustrations = []; // Don't clone illustrations

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

  // Characters
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
  
  // Worlds
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

  // Chapters
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

  // Items
  const addItem = (storyId: string, itemData: Omit<Item, 'id'>) => {
    const story = findStory(storyId);
    const newItem: Item = { ...itemData, id: crypto.randomUUID() };
    updateStoryInList({ ...story, items: [...story.items, newItem] });
  };
  const updateItem = (storyId: string, item: Item) => {
    const story = findStory(storyId);
    const updatedItems = story.items.map(i => i.id === item.id ? item : i);
    updateStoryInList({ ...story, items: updatedItems });
  };
  const deleteItem = (storyId: string, itemId: string) => {
    const story = findStory(storyId);
    const updatedItems = story.items.filter(i => i.id !== itemId);
    updateStoryInList({ ...story, items: updatedItems });
  };

  // Illustrations
  const addIllustration = (storyId: string, illustrationData: Omit<Illustration, 'id'>) => {
    const story = findStory(storyId);
    const newIllustration: Illustration = { ...illustrationData, id: crypto.randomUUID() };
    updateStoryInList({ ...story, illustrations: [...story.illustrations, newIllustration] });
  };


  const value: AppContextType = {
    stories: user ? stories : [],
    activeStoryId: user ? activeStoryId : null,
    setActiveStoryId: user ? setActiveStoryId : () => {},
    addStory: user ? addStory : () => {},
    cloneStory: user ? cloneStory : () => {},
    updateStory: user ? updateStory : () => {},
    deleteStory: user ? deleteStory : () => {},
    addCharacter: user ? addCharacter : () => {},
    updateCharacter: user ? updateCharacter : () => {},
    deleteCharacter: user ? deleteCharacter : () => {},
    addWorld: user ? addWorld : () => {},
    updateWorld: user ? updateWorld : () => {},
    deleteWorld: user ? deleteWorld : () => {},
    addChapter: user ? addChapter : () => {},
    updateChapter: user ? updateChapter : () => {},
    deleteChapter: user ? deleteChapter : () => {},
    updateChaptersOrder: user ? updateChaptersOrder : () => {},
    addItem: user ? addItem : () => {},
    updateItem: user ? updateItem : () => {},
    deleteItem: user ? deleteItem : () => {},
    addIllustration: user ? addIllustration : () => {},
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