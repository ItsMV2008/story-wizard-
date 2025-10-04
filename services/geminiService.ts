
import { GoogleGenAI, Chat, Type } from '@google/genai';
import { Character, World, Story, Chapter } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

export const generateCharacterProfile = async (description: string): Promise<Partial<Character>> => {
  try {
    const prompt = `Based on the following description, create a detailed character profile for a story.
    Description: "${description}"
    
    Return a JSON object with the full character structure. Populate all fields with creative and consistent details.
    - gender: Must be either 'Male' or 'Female'.
    - age: A general age range (e.g., "Young Adult", "Middle-Aged", "Ancient").
    - species: (e.g., "Human", "Elf", "Cyborg").
    - role: Their role in a story (e.g., "Protagonist", "Villain", "Comic Relief").
    - personalityArchetypes: An array of 3-4 descriptive words (e.g., "Brave", "Cynical", "Impulsive").
    - moralAlignment: A classic alignment (e.g., "Lawful Good", "Chaotic Neutral", "True Neutral").
    - motivations: An array of 1-2 core driving forces (e.g., "Seeks revenge", "Wants to protect family").
    - fears: An array of 1-2 significant fears (e.g., "Fears failure", "Afraid of being alone").
    - appearance: An object with height, build, hairColor, eyeColor, and distinctiveFeatures.
    - backstory: A 2-3 sentence summary.
    - relationships: A 1-2 sentence summary of their key relationships.
    - dialogueStyle: A short description of how they speak (e.g., "Speaks in short, direct sentences", "Uses witty and sarcastic language").`;

    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gender: { type: Type.STRING, enum: ['Male', 'Female'], description: "The character's gender." },
            age: { type: Type.STRING, description: "The character's age range." },
            species: { type: Type.STRING, description: "The character's species." },
            role: { type: Type.STRING, description: "The character's role in the story." },
            personalityArchetypes: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of personality traits.' },
            moralAlignment: { type: Type.STRING, description: 'The character\'s moral alignment.' },
            motivations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'The character\'s primary motivations.' },
            fears: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'The character\'s primary fears.' },
            appearance: {
                type: Type.OBJECT,
                properties: {
                    height: { type: Type.STRING },
                    build: { type: Type.STRING },
                    hairColor: { type: Type.STRING },
                    eyeColor: { type: Type.STRING },
                    distinctiveFeatures: { type: Type.STRING },
                },
                required: ['height', 'build', 'hairColor', 'eyeColor', 'distinctiveFeatures']
            },
            backstory: { type: Type.STRING, description: 'A brief backstory for the character.' },
            relationships: { type: Type.STRING, description: 'Key relationships the character has.' },
            dialogueStyle: { type: Type.STRING, description: 'The character\'s style of speaking.' },
          },
          required: ['gender', 'age', 'species', 'role', 'personalityArchetypes', 'moralAlignment', 'motivations', 'fears', 'appearance', 'backstory', 'relationships', 'dialogueStyle'],
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
            model: textModel,
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
        model: textModel,
        config: {
            systemInstruction
        }
    });
};

export const generateStorySynopsis = async (chapters: Chapter[]): Promise<string> => {
    if (chapters.length === 0) return "This story doesn't have any chapters yet.";
    
    const chapterSummaries = chapters.map((ch, i) => `Chapter ${i+1}: ${ch.title}\nSummary: ${ch.content || 'No summary provided.'}`).join('\n\n');
    const prompt = `Based on the following chapter summaries, write a compelling, one-paragraph synopsis for the entire story.\n\n${chapterSummaries}`;

    try {
        const response = await ai.models.generateContent({ model: textModel, contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error generating synopsis:", error);
        throw new Error("Failed to generate story synopsis.");
    }
}

export const generateItemImage = async (description: string): Promise<string> => {
    const prompt = `A cinematic, high-detail, studio-quality photograph of a single fantasy item on a neutral background: ${description}.`;
    try {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1'
            }
        });

        if (response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error('No image was generated.');
    } catch (error) {
        console.error("Error generating item image:", error);
        throw new Error("Failed to generate item image.");
    }
}

export const generateSceneIllustration = async (prompt: string): Promise<string> => {
    const fullPrompt = `An evocative, painterly, digital art illustration of the following scene, capturing the mood and atmosphere: "${prompt}"`;
     try {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: fullPrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9'
            }
        });

        if (response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }
        throw new Error('No image was generated.');
    } catch (error) {
        console.error("Error generating scene illustration:", error);
        throw new Error("Failed to generate scene illustration.");
    }
}