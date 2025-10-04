
import React, { useState } from 'react';
import { Story, World } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { generateWorldDetails } from '../services/geminiService';
import Spinner from '../components/Spinner';

interface WorldBuilderProps {
  story: Story;
}

const WorldBuilder: React.FC<WorldBuilderProps> = ({ story }) => {
  const { addWorld, updateWorld, deleteWorld } = useAppContext();
  const [editingWorld, setEditingWorld] = useState<Partial<World> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    if (!editingWorld || !editingWorld.name) return;
    if (editingWorld.id) {
      updateWorld(story.id, editingWorld as World);
    } else {
      addWorld(story.id, editingWorld as Omit<World, 'id'>);
    }
    setEditingWorld(null);
  };

  const handleGenerate = async () => {
    if (!editingWorld || !editingWorld.name) return;
    setIsLoading(true);
    try {
      const details = await generateWorldDetails(editingWorld.name);
      setEditingWorld(prev => ({ ...prev, ...details }));
    } catch (error) {
      alert('Failed to generate world details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderForm = () => {
    if (!editingWorld) return null;

    const setField = (field: keyof World, value: string) => {
        setEditingWorld(prev => ({...prev, [field]: value}));
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setEditingWorld(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl animate-slide-in-left" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4">{editingWorld.id ? 'Edit' : 'Create'} World</h2>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <input type="text" placeholder="World Name (e.g., 'Ancient desert kingdom')" value={editingWorld.name || ''} onChange={e => setField('name', e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <textarea placeholder="Description" value={editingWorld.description || ''} onChange={e => setField('description', e.target.value)} rows={6} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <textarea placeholder="Geography" value={editingWorld.geography || ''} onChange={e => setField('geography', e.target.value)} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
            <textarea placeholder="Culture & Factions" value={editingWorld.culture || ''} onChange={e => setField('culture', e.target.value)} rows={4} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:bg-purple-400">
              {isLoading ? <Spinner /> : '🌍 AI Generate Details'}
            </button>
            <div className="flex gap-2">
                <button onClick={() => setEditingWorld(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
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
        <h1 className="text-3xl font-bold">Worlds & Settings</h1>
        <button onClick={() => setEditingWorld({})} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
          + Add World
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {story.worlds.map(world => (
          <div key={world.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
            <h3 className="text-xl font-bold mb-2">{world.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 flex-grow">{world.description.substring(0, 150)}...</p>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button onClick={() => setEditingWorld(world)} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">Edit</button>
              <button onClick={() => deleteWorld(story.id, world.id)} className="text-sm text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {renderForm()}
    </div>
  );
};

export default WorldBuilder;
