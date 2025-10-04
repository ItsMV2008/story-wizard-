import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { communityStories } from '../data/communityStories';
import { Story } from '../types';
import { useAppContext } from '../contexts/AppContext';

const CommunityPage: React.FC = () => {
    const { t } = useLocalization();
    const { cloneStory } = useAppContext();

    const handleClone = (story: Story) => {
        if (confirm(`Are you sure you want to clone "${story.title}" to your library?`)) {
            cloneStory(story);
            alert(`"${story.title}" has been added to your stories!`);
        }
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">{t('community_showcase')}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl mx-auto">{t('community_subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {communityStories.map(story => (
                    <div key={story.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col group transition-transform hover:scale-105">
                        <div className="p-6 flex-grow">
                            <p className="text-sm text-primary-500 font-semibold">{story.genre}</p>
                            <h2 className="text-2xl font-bold mt-1">{story.title}</h2>
                            {story.author && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('by_author').replace('{author}', story.author)}</p>}
                            <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm flex-grow line-clamp-4">{story.outline}</p>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 mt-auto">
                           <button 
                                onClick={() => handleClone(story)}
                                className="w-full px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                           >
                                {t('clone_to_library')}
                           </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityPage;
