import React, { useState } from 'react';
import { Story, Character } from '../types';
import { useAppContext } from '../contexts/AppContext';
import CharacterWizard from '../components/CharacterWizard';
import { useLocalization } from '../contexts/LocalizationContext';

interface CharacterCreatorProps {
  story: Story;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ story }) => {
  const { addCharacter, updateCharacter, deleteCharacter } = useAppContext();
  const [editingCharacter, setEditingCharacter] = useState<Partial<Character> | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { t } = useLocalization();

  const handleOpenWizard = (character?: Character) => {
    setEditingCharacter(character || {});
    setIsWizardOpen(true);
  }

  const handleCloseWizard = () => {
    setEditingCharacter(null);
    setIsWizardOpen(false);
  }

  const handleSaveCharacter = (characterData: Partial<Character>) => {
    if (!characterData || !characterData.name) return;

    // Impact Analysis: Warn user if editing an existing character
    if (characterData.id) {
        if (!confirm(t('impact_analysis_warning'))) {
            return;
        }
      updateCharacter(story.id, characterData as Character);
    } else {
      addCharacter(story.id, characterData as Omit<Character, 'id'>);
    }
    handleCloseWizard();
  };

  const handleDeleteCharacter = (characterId: string) => {
    if (confirm(t('confirm_delete_character'))) {
        deleteCharacter(story.id, characterId);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('characters')}</h1>
        <button onClick={() => handleOpenWizard()} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            + {t('add_character')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {story.characters.map(char => (
          <div key={char.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col transition-transform hover:scale-105">
            <h3 className="text-xl font-bold mb-2">{char.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1"><span className="font-semibold">{t('role')}:</span> {char.role}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex-grow"><span className="font-semibold">{t('personality')}:</span> {char.personalityArchetypes?.join(', ')}</p>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button onClick={() => handleOpenWizard(char)} className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">{t('edit')}</button>
              <button onClick={() => handleDeleteCharacter(char.id)} className="text-sm text-red-500 hover:underline">{t('delete')}</button>
            </div>
          </div>
        ))}
      </div>

      {isWizardOpen && (
        <CharacterWizard 
            isOpen={isWizardOpen}
            onClose={handleCloseWizard}
            onSave={handleSaveCharacter}
            initialCharacter={editingCharacter}
            storyCharacters={story.characters}
        />
      )}
    </div>
  );
};

export default CharacterCreator;