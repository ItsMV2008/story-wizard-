import React, { useState, useEffect, useCallback } from 'react';
import { Character, Gender } from '../types';
import { useLocalization } from '../contexts/LocalizationContext';
import { generateCharacterProfile } from '../services/geminiService';
import Spinner from './Spinner';

interface CharacterWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (character: Partial<Character>) => void;
    initialCharacter: Partial<Character> | null;
    storyCharacters: Character[];
}

const CharacterWizard: React.FC<CharacterWizardProps> = ({ isOpen, onClose, onSave, initialCharacter }) => {
    const { t } = useLocalization();
    const [step, setStep] = useState(1);
    const [character, setCharacter] = useState<Partial<Character>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // FIX: Ensure the character state is always initialized with a complete
        // appearance object to prevent type errors and runtime exceptions. This handles
        // both new characters and editing existing ones by merging with defaults.
        const defaultCharacter = {
            gender: 'Male' as Gender,
            personalityArchetypes: [],
            motivations: [],
            fears: [],
            appearance: {
                height: '',
                build: '',
                hairColor: '',
                eyeColor: '',
                distinctiveFeatures: '',
            }
        };

        const mergedCharacter: Partial<Character> = {
            ...defaultCharacter,
            ...initialCharacter,
            appearance: {
                ...defaultCharacter.appearance,
                ...(initialCharacter?.appearance),
            },
        };

        setCharacter(mergedCharacter);
        setStep(1);
    }, [initialCharacter]);
    
    const handleUpdate = useCallback((field: keyof Character, value: any) => {
        setCharacter(prev => ({...prev, [field]: value}));
    }, []);

    const handleNestedUpdate = useCallback((group: keyof Character, field: string, value: any) => {
        setCharacter(prev => ({
            ...prev,
            [group]: {
                // @ts-ignore
                ...prev[group],
                [field]: value,
            }
        }));
    }, []);

    const handleMultiSelect = useCallback((field: 'personalityArchetypes' | 'motivations' | 'fears', value: string, limit: number) => {
        setCharacter(prev => {
            const currentValues = prev[field] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            
            if (newValues.length > limit) {
                return prev; // Do not update if limit is exceeded
            }
            return {...prev, [field]: newValues};
        });
    }, []);

    const handleEnhance = async () => {
        if (!character.name) return;
        setIsLoading(true);
        try {
            const profile = await generateCharacterProfile(character.name);
            setCharacter(prev => ({ ...prev, ...profile }));
        } catch (error) {
            alert(t('enhance_character_error'));
        } finally {
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    const renderStep = () => {
        switch(step) {
            case 1: return <Step1 character={character} onUpdate={handleUpdate} onEnhance={handleEnhance} isLoading={isLoading} />;
            case 2: return <Step2 character={character} onUpdate={handleUpdate} onMultiSelect={handleMultiSelect} />;
            case 3: return <Step3 character={character} onNestedUpdate={handleNestedUpdate} />;
            case 4: return <Step4 character={character} onUpdate={handleUpdate} />;
            case 5: return <Step5 character={character} onUpdate={handleUpdate} />;
            case 6: return <Step6 character={character} onUpdate={handleUpdate} />;
            default: return null;
        }
    }

    const stepTitles = [
        t('wizard_step_1_title'), t('wizard_step_2_title'), t('wizard_step_3_title'), 
        t('wizard_step_4_title'), t('wizard_step_5_title'), t('wizard_step_6_title')
    ];
    const stepSubtitles = [
        t('wizard_identity_subtitle'), t('wizard_personality_subtitle'), t('wizard_appearance_subtitle'),
        t('wizard_backstory_subtitle'), t('wizard_relationships_subtitle'), t('wizard_voice_subtitle')
    ];

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold">{character.id ? t('edit_character') : t('create_character')}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stepTitles[step-1]} - {stepSubtitles[step-1]}</p>
                </div>
                <div className="p-6 flex-grow overflow-y-auto">
                    {renderStep()}
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div>
                        {step > 1 && <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-medium">{t('previous')}</button>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">{t('cancel')}</button>
                        {step < 6 && <button onClick={() => setStep(s => s + 1)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">{t('next')}</button>}
                        {step === 6 && <button onClick={() => onSave(character)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">{t('finish_and_save')}</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- WIZARD STEPS ---
const FormRow: React.FC<{ children: React.ReactNode}> = ({ children }) => <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">{children}</div>;
const FormField: React.FC<{ label: string, children: React.ReactNode}> = ({ label, children }) => <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>{children}</div>;
const Input = (props: React.ComponentProps<'input'>) => <input {...props} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" />;
const Select = (props: React.ComponentProps<'select'>) => <select {...props} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" />;
const Textarea = (props: React.ComponentProps<'textarea'>) => <textarea {...props} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none" />;
const MultiSelectButton: React.FC<{ label: string, isSelected: boolean, onClick: () => void }> = ({ label, isSelected, onClick }) => (
    <button type="button" onClick={onClick} className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${isSelected ? 'bg-primary-600 text-white border-primary-600' : 'bg-transparent dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>{label}</button>
);


const Step1: React.FC<{character: Partial<Character>, onUpdate: Function, onEnhance: () => void, isLoading: boolean}> = ({ character, onUpdate, onEnhance, isLoading }) => {
    const { t } = useLocalization();
    return (
        <div>
            <FormRow>
                <FormField label={t('name')}>
                    <Input type="text" value={character.name || ''} onChange={e => onUpdate('name', e.target.value)} />
                </FormField>
                <FormField label={t('gender')}>
                    <Select value={character.gender || 'Male'} onChange={e => onUpdate('gender', e.target.value as Gender)}>
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                    </Select>
                </FormField>
            </FormRow>
            <FormRow>
                 <FormField label={t('age_range')}>
                    <Input type="text" placeholder="e.g., Young Adult, 40s, Ancient" value={character.age || ''} onChange={e => onUpdate('age', e.target.value)} />
                </FormField>
                <FormField label={t('species')}>
                    <Input type="text" placeholder="e.g., Human, Elf, Android" value={character.species || ''} onChange={e => onUpdate('species', e.target.value)} />
                </FormField>
            </FormRow>
            <FormRow>
                <FormField label={t('character_role')}>
                    <Input type="text" placeholder="e.g., Protagonist, Mentor" value={character.role || ''} onChange={e => onUpdate('role', e.target.value)} />
                </FormField>
            </FormRow>
            <div className="mt-6 p-4 bg-primary-50 dark:bg-gray-700/50 rounded-lg flex items-center gap-4">
                 <button onClick={onEnhance} disabled={isLoading || !character.name} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:bg-purple-400 disabled:cursor-not-allowed">
                    {isLoading ? <Spinner /> : `✨ ${t('ai_enhance')}`}
                </button>
                <p className="text-sm text-purple-800 dark:text-purple-300">{t('enhance_with_ai_info')}</p>
            </div>
        </div>
    );
}

const Step2: React.FC<{character: Partial<Character>, onUpdate: Function, onMultiSelect: Function}> = ({ character, onUpdate, onMultiSelect }) => {
    const { t } = useLocalization();
    const archetypes = ["Brave", "Cunning", "Loyal", "Anxious", "Impulsive", "Wise", "Cynical", "Idealistic", "Grumpy", "Charismatic", "Reserved", "Ambitious"];
    const alignments = ["Lawful Good", "Neutral Good", "Chaotic Good", "Lawful Neutral", "True Neutral", "Chaotic Neutral", "Lawful Evil", "Neutral Evil", "Chaotic Evil"];
    const motivations = ["Revenge", "Redemption", "Discovery", "Love", "Survival", "Power", "Justice", "Freedom", "Knowledge"];
    const fears = ["Failure", "Abandonment", "Death", "Losing Control", "The Unknown", "Being Forgotten"];

    return (
        <div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('personality_archetypes')}</label>
                <div className="flex flex-wrap gap-2">{archetypes.map(a => <MultiSelectButton key={a} label={a} isSelected={character.personalityArchetypes?.includes(a) || false} onClick={() => onMultiSelect('personalityArchetypes', a, 3)} />)}</div>
            </div>
             <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('moral_alignment')}</label>
                <Select value={character.moralAlignment || ''} onChange={e => onUpdate('moralAlignment', e.target.value)}>
                    <option value="" disabled>Select...</option>
                    {alignments.map(a => <option key={a} value={a}>{a}</option>)}
                </Select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('motivations')}</label>
                <div className="flex flex-wrap gap-2">{motivations.map(m => <MultiSelectButton key={m} label={m} isSelected={character.motivations?.includes(m) || false} onClick={() => onMultiSelect('motivations', m, 2)} />)}</div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('fears')}</label>
                <div className="flex flex-wrap gap-2">{fears.map(f => <MultiSelectButton key={f} label={f} isSelected={character.fears?.includes(f) || false} onClick={() => onMultiSelect('fears', f, 2)} />)}</div>
            </div>
        </div>
    );
};

const Step3: React.FC<{character: Partial<Character>, onNestedUpdate: Function}> = ({ character, onNestedUpdate }) => {
    const { t } = useLocalization();
    // FIX: The character prop is a Partial<Character>, so appearance can be undefined.
    // Using optional chaining (`?.`) safely accesses nested properties to prevent type errors.
    const appearance = character.appearance;
    return (
         <div>
            <FormRow>
                <FormField label={t('height')}><Input value={appearance?.height || ''} onChange={e => onNestedUpdate('appearance', 'height', e.target.value)}/></FormField>
                <FormField label={t('build')}><Input value={appearance?.build || ''} onChange={e => onNestedUpdate('appearance', 'build', e.target.value)}/></FormField>
            </FormRow>
            <FormRow>
                <FormField label={t('hair_color')}><Input value={appearance?.hairColor || ''} onChange={e => onNestedUpdate('appearance', 'hairColor', e.target.value)}/></FormField>
                <FormField label={t('eye_color')}><Input value={appearance?.eyeColor || ''} onChange={e => onNestedUpdate('appearance', 'eyeColor', e.target.value)}/></FormField>
            </FormRow>
            <FormField label={t('distinctive_features')}><Textarea value={appearance?.distinctiveFeatures || ''} onChange={e => onNestedUpdate('appearance', 'distinctiveFeatures', e.target.value)} rows={3} /></FormField>
        </div>
    );
}
const Step4: React.FC<{character: Partial<Character>, onUpdate: Function}> = ({ character, onUpdate }) => {
    const { t } = useLocalization();
    return <FormField label={t('backstory')}><Textarea value={character.backstory || ''} onChange={e => onUpdate('backstory', e.target.value)} rows={10} /></FormField>
}
const Step5: React.FC<{character: Partial<Character>, onUpdate: Function}> = ({ character, onUpdate }) => {
    const { t } = useLocalization();
    return <FormField label={t('relationships')}><Textarea value={character.relationships || ''} onChange={e => onUpdate('relationships', e.target.value)} rows={10} placeholder="e.g., Fierce rivalry with Kael. Protective of their younger sister, Elara." /></FormField>
}
const Step6: React.FC<{character: Partial<Character>, onUpdate: Function}> = ({ character, onUpdate }) => {
    const { t } = useLocalization();
    return <FormField label={t('dialogue_style')}><Textarea value={character.dialogueStyle || ''} onChange={e => onUpdate('dialogueStyle', e.target.value)} rows={5} placeholder="e.g., Speaks formally, uses complex vocabulary. Or, tends to be sarcastic and witty." /></FormField>
}


export default CharacterWizard;