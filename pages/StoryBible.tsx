import React, { useState } from 'react';
import { Story, Item } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';
import { generateStorySynopsis, generateItemImage } from '../services/geminiService';
import Spinner from '../components/Spinner';

interface StoryBibleProps {
  story: Story;
}

const StoryBible: React.FC<StoryBibleProps> = ({ story }) => {
    // FIX: Add useLocalization hook call to define `t` function.
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState('synopsis');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('story_bible')}</h1>
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                {/* FIX: Pass explicit `id` to TabButton and use setActiveTab directly for robust logic. */}
                <TabButton id="synopsis" name={t('ai_synopsis')} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="characters" name={t('cast_of_characters')} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="worlds" name={t('worlds_and_settings')} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="items" name={t('key_items_and_artifacts')} activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton id="gallery" name={t('illustration_gallery')} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div>
                {activeTab === 'synopsis' && <SynopsisPanel story={story} />}
                {activeTab === 'characters' && <CharactersPanel story={story} />}
                {activeTab === 'worlds' && <WorldsPanel story={story} />}
                {activeTab === 'items' && <ItemsPanel story={story} />}
                {activeTab === 'gallery' && <GalleryPanel story={story} />}
            </div>
        </div>
    );
};

// FIX: Refactored TabButton to be more robust.
// It now takes an `id` and compares it directly, avoiding i18n issues and fixing broken logic.
const TabButton: React.FC<{ name: string; id: string; activeTab: string; setActiveTab: (id: string) => void; }> = ({ name, id, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;
    
    return (
        <button 
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
            {name}
        </button>
    );
}

const SynopsisPanel: React.FC<{ story: Story }> = ({ story }) => {
    const { t } = useLocalization();
    const [synopsis, setSynopsis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateStorySynopsis(story.chapters);
            setSynopsis(result);
        } catch (error) {
            alert('Failed to generate synopsis.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t('ai_synopsis')}</h2>
                <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-primary-400 flex items-center gap-2">
                    {isLoading ? <Spinner /> : '✨'}
                    {isLoading ? t('generating') : t('generate_synopsis')}
                </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {synopsis || t('synopsis_placeholder')}
            </p>
        </div>
    );
};

const CharactersPanel: React.FC<{ story: Story }> = ({ story }) => {
    const { t } = useLocalization();
    return (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {story.characters.map(char => (
              <div key={char.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
                <h3 className="text-xl font-bold mb-2">{char.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold">{t('role')}:</span> {char.role}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex-grow"><span className="font-semibold">{t('personality')}:</span> {char.personalityArchetypes?.join(', ')}</p>
              </div>
            ))}
        </div>
    );
};

const WorldsPanel: React.FC<{ story: Story }> = ({ story }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {story.worlds.map(world => (
              <div key={world.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col">
                <h3 className="text-xl font-bold mb-2">{world.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-3 flex-grow">{world.description.substring(0, 150)}...</p>
              </div>
            ))}
        </div>
    );
};

const ItemsPanel: React.FC<{ story: Story }> = ({ story }) => {
    const { addItem, updateItem, deleteItem } = useAppContext();
    const [editingItem, setEditingItem] = useState<Partial<Item> | null>(null);
    const { t } = useLocalization();
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    const handleSave = () => {
        if (!editingItem || !editingItem.name) return;
        if(editingItem.id) {
            updateItem(story.id, editingItem as Item);
        } else {
            addItem(story.id, editingItem as Omit<Item, 'id'>);
        }
        setEditingItem(null);
    };

    const handleGenerateImage = async () => {
        if (!editingItem || !editingItem.description) return;
        setIsGeneratingImage(true);
        try {
            const imageBytes = await generateItemImage(editingItem.description);
            setEditingItem(prev => ({ ...prev, imageUrl: imageBytes }));
        } catch(error) {
            alert(t('generate_item_image_error'));
        } finally {
            setIsGeneratingImage(false);
        }
    }

    const renderForm = () => {
        if(!editingItem) return null;
        return (
             <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setEditingItem(null)}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg animate-slide-in-left" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-4">{editingItem.id ? t('edit_item') : t('create_item')}</h2>
                    <div className="space-y-4">
                        <input type="text" placeholder={t('item_name')} value={editingItem.name || ''} onChange={e => setEditingItem(p => ({...p, name: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        <textarea placeholder={t('item_description_placeholder')} value={editingItem.description || ''} onChange={e => setEditingItem(p => ({...p, description: e.target.value}))} rows={5} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        {editingItem.imageUrl && <img src={`data:image/jpeg;base64,${editingItem.imageUrl}`} alt={editingItem.name} className="w-32 h-32 object-cover rounded-lg mx-auto" />}
                    </div>
                     <div className="mt-6 flex justify-between items-center">
                        <button onClick={handleGenerateImage} disabled={isGeneratingImage || !editingItem.description} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:bg-purple-400">
                           {isGeneratingImage ? <Spinner /> : '🎨'} {t('generate_image')}
                        </button>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingItem(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{t('save')}</button>
                        </div>
                    </div>
                </div>
             </div>
        )
    }

    return (
        <div>
             <div className="flex justify-end mb-4">
                <button onClick={() => setEditingItem({})} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    + {t('add_item')}
                </button>
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {story.items.map(item => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col group">
                    {item.imageUrl && <img src={`data:image/jpeg;base64,${item.imageUrl}`} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />}
                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 flex-grow">{item.description}</p>
                    <div className="pt-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <button onClick={() => setEditingItem(item)} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">{t('edit')}</button>
                        <button onClick={() => { if(confirm(t('confirm_delete_item'))) deleteItem(story.id, item.id) }} className="text-sm text-red-500 hover:underline">{t('delete')}</button>
                    </div>
                  </div>
                ))}
            </div>
            {renderForm()}
        </div>
    );
};

const GalleryPanel: React.FC<{ story: Story }> = ({ story }) => {
    const { t } = useLocalization();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    if (story.illustrations.length === 0) {
        return <p className="text-gray-500 dark:text-gray-400">{t('gallery_empty')}</p>;
    }

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {story.illustrations.map(illus => (
                    <div key={illus.id} className="group relative cursor-pointer" onClick={() => setSelectedImage(illus.imageUrl)}>
                        <img 
                            src={`data:image/jpeg;base64,${illus.imageUrl}`} 
                            alt={illus.prompt}
                            className="w-full h-full object-cover rounded-lg aspect-video"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 rounded-lg">
                            <p className="text-white text-xs line-clamp-2">{illus.prompt}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <img 
                        src={`data:image/jpeg;base64,${selectedImage}`} 
                        alt="Selected illustration"
                        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};

export default StoryBible;
