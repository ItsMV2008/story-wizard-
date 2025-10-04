
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { Character, World, Story } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export const generateCharacterProfile = async (description: string): Promise<Partial<Character>> => {
  try {
    const prompt = `Based on the following description, create a detailed character profile.
    Description: "${description}"
    
    Return a JSON object with the following fields: 'personality', 'backstory', and 'relationships'.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personality: { type: Type.STRING, description: 'The character\'s personality traits.' },
            backstory: { type: Type.STRING, description: 'A brief backstory for the character.' },
            relationships: { type: Type.STRING, description: 'Key relationships the character has.' },
          },
          required: ['personality', 'backstory', 'relationships'],
        }
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating character profile:', error);
    throw new Error('Failed to generate character profile.');
  }
};


export const generateWorldDetails = async (description: string): Promise<Partial<World>> => {
    try {
        const prompt = `Based on this description of a world, expand it with rich details.
        Description: "${description}"

        Return a JSON object with 'description', 'geography', and 'culture'.`;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: 'A detailed description of the world.'},
                        geography: { type: Type.STRING, description: 'The world\'s geography and key locations.'},
                        culture: { type: Type.STRING, description: 'The culture, factions, and societies.'},
                    },
                    required: ['description', 'geography', 'culture']
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error('Error generating world details:', error);
        throw new Error('Failed to generate world details.');
    }
};

export const createChatSession = (story: Story): Chat => {
    const systemInstruction = `You are a creative co-writer and storytelling assistant.
    The user is writing a story with the following context:
    Title: ${story.title}
    Genre: ${story.genre || 'Not specified'}
    Tone: ${story.tone || 'Not specified'}
    Outline: ${story.outline || 'Not specified'}
    
    Your role is to help them brainstorm, expand scenes, write dialogue, and overcome writer's block.
    Be encouraging, creative, and adhere to the established context of their story.
    When asked to continue a story, pick up from the last sentence and write the next few paragraphs.
    Keep your responses concise and focused on the user's request.`;

    return ai.chats.create({
        model,
        config: {
            systemInstruction
        }
    });
}
