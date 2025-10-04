
import React, { useState } from 'react';
import { Story, Character } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { generateCharacterProfile } from '../services/geminiService';
import Spinner from '../components/Spinner';

interface CharacterCreatorProps {
  story: Story;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ story }) => {
  const { addCharacter, updateCharacter, deleteCharacter } = useAppContext();
  const [editingCharacter, setEditingCharacter] = useState<Partial<Character> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!editingCharacter || !editingCharacter.name) return;

    if (editingCharacter.id) {
      updateCharacter(story.id, editingCharacter as Character);
    } else {
      addCharacter(story.id, editingCharacter as Omit<Character, 'id'>);
    }
    setEditingCharacter(null);
  };

  const handleEnhance = async () => {
    if (!editingCharacter || !editingCharacter.name) return;
    setIsLoading(true);
    try {
      const profile = await generateCharacterProfile(editingCharacter.name);
      setEditingCharacter(prev => ({ ...prev, ...profile }));
    } catch (error) {
      alert('Failed to enhance character. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const renderForm = () => {
    if (!editingCharacter) return null;

    const setField = (field: keyof Character, value: string) => {
        setEditingCharacter(prev => ({...prev, [field]: value}));
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setEditingCharacter(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl animate-slide-in-left" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4">{editingCharacter.id ? 'Edit' : 'Create'} Character</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <input type="text" placeholder="Name" value={editingCharacter.name || ''} onChange={e => setField('name', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <input type="text" placeholder="Age" value={editingCharacter.age || ''} onChange={e => setField('age', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <textarea placeholder="Personality" value={editingCharacter.personality || ''} onChange={e => setField('personality', e.target.value)} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <textarea placeholder="Backstory" value={editingCharacter.backstory || ''} onChange={e => setField('backstory', e.target.value)} rows={6} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <textarea placeholder="Relationships" value={editingCharacter.relationships || ''} onChange={e => setField('relationships', e.target.value)} rows={3} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button onClick={handleEnhance} disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:bg-purple-400">
              {isLoading ? <Spinner /> : '✨ AI Enhance'}
            </button>
            <div className="flex gap-2">
                <button onClick={() => setEditingCharacter(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Characters</h1>
            <button onClick={() => setEditingCharacter({})} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                + Add Character
            </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {story.characters.map(char => (
          <div key={char.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{char.name}, {char.age}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">Personality</p>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 flex-grow">{char.personality.substring(0, 100)}...</p>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button onClick={() => setEditingCharacter(char)} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">Edit</button>
              <button onClick={() => deleteCharacter(story.id, char.id)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {renderForm()}
    </div>
  );
};

export default CharacterCreator;
