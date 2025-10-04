export type Gender = 'Male' | 'Female';

export interface Character {
  id: string;
  name: string;
  // Step 1: Identity
  gender: Gender;
  age: string; // e.g., "Teen", "Adult", "Elderly"
  species: string;
  role: string; // e.g., "Protagonist", "Antagonist", "Mentor"
  // Step 2: Personality
  personalityArchetypes: string[];
  moralAlignment: string;
  motivations: string[];
  fears: string[];
  // Step 3: Appearance
  appearance: {
    height: string;
    build: string;
    hairColor: string;
    eyeColor: string;
    distinctiveFeatures: string;
  };
  // Step 4: Backstory
  backstory: string;
  // Step 5: Relationships
  relationships: string;
  // Step 6: Voice
  dialogueStyle: string;
}

export interface World {
  id: string;
  name:string;
  description: string;
  geography: string;
  culture: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  tensionLevel: 'low' | 'medium' | 'high' | 'climax';
}

export interface Story {
  id: string;
  title: string;
  genre: string;
  tone: string;
  outline: string;
  chapters: Chapter[];
  characters: Character[];
  worlds: World[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export enum View {
  STORY_EDITOR = 'STORY_EDITOR',
  CHARACTERS = 'CHARACTERS',
  WORLDS = 'WORLDS',
  TIMELINE = 'TIMELINE',
}

export type Locale = 'en' | 'ar' | 'ja';

export interface User {
  id: string;
  name?: string;
  email: string;
}