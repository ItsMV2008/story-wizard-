
export interface Character {
  id: string;
  name: string;
  age: string;
  personality: string;
  backstory: string;
  relationships: string;
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
