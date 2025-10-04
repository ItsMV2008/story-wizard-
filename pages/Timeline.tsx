import React, { useState } from 'react';
import { Story, Chapter } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useLocalization } from '../contexts/LocalizationContext';

interface TimelineProps {
  story: Story;
}

const Timeline: React.FC<TimelineProps> = ({ story }) => {
    const { addChapter, updateChapter, deleteChapter } = useAppContext();
    const [editingChapter, setEditingChapter] = useState<Partial<Chapter> | null>(null);
    const { t } = useLocalization();

    const handleSave = () => {
        if (!editingChapter || !editingChapter.title) return;
        if(editingChapter.id){
            updateChapter(story.id, editingChapter as Chapter);
        } else {
            addChapter(story.id, { ...editingChapter, content: '', tensionLevel: 'low' } as Omit<Chapter, 'id'>);
        }
        setEditingChapter(null);
    }
    
    const tensionColorMap = {
        low: 'bg-blue-500',
        medium: 'bg-yellow-500',
        high: 'bg-orange-500',
        climax: 'bg-red-600',
    };

    const renderForm = () => {
        if (!editingChapter) return null;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setEditingChapter(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg animate-slide-in-left" onClick={e => e.stopPropagation()}>
              <h2 className="text-2xl font-bold mb-4">{editingChapter.id ? t('edit_chapter') : t('create_chapter')}</h2>
              <div className="space-y-4">
                <input type="text" placeholder={t('chapter_title')} value={editingChapter.title || ''} onChange={e => setEditingChapter(p => ({...p, title: e.target.value}))} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
                <select value={editingChapter.tensionLevel || 'low'} onChange={e => setEditingChapter(p => ({...p, tensionLevel: e.target.value as Chapter['tensionLevel']}))} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option value="low">{t('low_tension')}</option>
                    <option value="medium">{t('medium_tension')}</option>
                    <option value="high">{t('high_tension')}</option>
                    <option value="climax">{t('climax')}</option>
                </select>
                <textarea placeholder={t('chapter_summary_placeholder')} value={editingChapter.content || ''} onChange={e => setEditingChapter(p => ({...p, content: e.target.value}))} rows={5} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"/>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                 <button onClick={() => setEditingChapter(null)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
                 <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">{t('save')}</button>
              </div>
            </div>
          </div>
        );
    }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">{t('story_timeline')}</h1>
            <button onClick={() => setEditingChapter({})} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                + {t('add_chapter')}
            </button>
        </div>
      <div className="relative pl-8 py-4 border-l-4 border-gray-300 dark:border-gray-600">
        {story.chapters.length === 0 && (
            <p className="text-gray-500">{t('timeline_empty')}</p>
        )}
        {story.chapters.map((chapter, index) => (
          <div key={chapter.id} className="mb-10 relative">
            <div className={`absolute -left-[42px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full ${tensionColorMap[chapter.tensionLevel]} border-4 border-gray-100 dark:border-gray-900`}></div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-semibold text-primary-500">{t('chapter')} {index + 1}</span>
                    <h3 className="text-xl font-bold">{chapter.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{chapter.content}</p>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={() => setEditingChapter(chapter)} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">{t('edit')}</button>
                     <button onClick={() => deleteChapter(story.id, chapter.id)} className="text-sm text-red-500 hover:underline">{t('delete')}</button>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderForm()}
    </div>
  );
};

export default Timeline;
