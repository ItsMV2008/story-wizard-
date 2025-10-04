import { Story } from '../types';

export const communityStories: Story[] = [
  {
    id: 'community-1',
    title: 'The Crimson Cipher',
    author: 'Aria Vance',
    genre: 'Cyberpunk Mystery',
    tone: 'Noir, Tense',
    outline: 'In the rain-slicked metropolis of Neo-Alexandria, a disillusioned data-detective uncovers a conspiracy that reaches the highest echelons of the city\'s AI government when he investigates the disappearance of a famed bio-engineer.',
    chapters: [
      { id: 'c1-1', title: 'A Ghost in the Machine', content: 'Detective Kaelen is hired to find a missing person in the neon-drenched underbelly of the city.', tensionLevel: 'low' },
      { id: 'c1-2', title: 'Echoes of the Past', content: 'The case leads Kael to an abandoned data haven, where he finds cryptic clues left behind by the engineer.', tensionLevel: 'medium' },
    ],
    characters: [
      {
        id: 'char-c1-1', name: 'Kaelen "Kael" Rourke', gender: 'Male', age: '35', species: 'Human', role: 'Protagonist',
        personalityArchetypes: ['Cynical', 'Perceptive', 'Weary'], moralAlignment: 'Chaotic Good',
        motivations: ['Uncover the truth'], fears: ['His past catching up to him'],
        appearance: { height: '6\'1"', build: 'Lean', hairColor: 'Black', eyeColor: 'Grey', distinctiveFeatures: 'A cybernetic left eye that glows faintly.' },
        backstory: 'A former corporate enforcer who left the life after a job went wrong. Now he takes cases the city police won\'t touch.',
        relationships: 'Haunted by the memory of his former partner.', dialogueStyle: 'Short, sarcastic, and to the point.'
      }
    ],
    worlds: [
      { id: 'world-c1-1', name: 'Neo-Alexandria', description: 'A sprawling, vertical city governed by a council of AIs. Corporations hold immense power, and the gap between the rich and poor is a literal vertical mile.', geography: 'Built in the crater of an old asteroid impact, the city stretches from the toxic "Sump" to the pristine "Spire".', culture: 'A society obsessed with data, body modification, and virtual realities.' }
    ],
    items: [],
    illustrations: [],
  },
  {
    id: 'community-2',
    title: 'Whispers of the Sunstone',
    author: 'Elara Meadowlight',
    genre: 'High Fantasy',
    tone: 'Epic, Hopeful',
    outline: 'A young village healer discovers she is the last in a line of ancient guardians tasked with protecting a powerful artifact, the Sunstone, from a creeping shadow that threatens to consume the light from the world.',
    chapters: [
        { id: 'c2-1', title: 'An Unwanted Inheritance', content: 'Lyra\'s quiet life is shattered when a mysterious stranger reveals her true lineage.', tensionLevel: 'low' },
        { id: 'c2-2', title: 'The Shadow\'s Grasp', content: 'The village is attacked by shadow creatures, forcing Lyra to use her nascent powers to defend her home.', tensionLevel: 'high' }
    ],
    characters: [
      {
        id: 'char-c2-1', name: 'Lyra', gender: 'Female', age: '19', species: 'Human', role: 'Protagonist',
        personalityArchetypes: ['Kind', 'Determined', 'Insecure'], moralAlignment: 'Lawful Good',
        motivations: ['Protect her home', 'Live up to her legacy'], fears: ['Failure', 'The darkness within'],
        appearance: { height: '5\'6"', build: 'Slender', hairColor: 'Golden Blonde', eyeColor: 'Green', distinctiveFeatures: 'A faint birthmark on her wrist shaped like a sunburst.' },
        backstory: 'An orphan raised by the village elder, Lyra always felt like an outsider until she discovered her true purpose.',
        relationships: 'Views the village elder as a grandmother; is wary of the stranger who brought her the news.', dialogueStyle: 'Warm and empathetic, but firm when needed.'
      }
    ],
    worlds: [
      { id: 'world-c2-1', name: 'Aethelgard', description: 'A vibrant world of lush forests, ancient mountains, and shimmering rivers, all sustained by the light of the Sunstone.', geography: 'The story begins in the secluded village of Oakhaven, nestled in the heart of the Elderwood.', culture: 'A peaceful, nature-worshipping society that has forgotten the ancient evils of the past.' }
    ],
    items: [
        { id: 'item-c2-1', name: 'The Sunstone Pendant', description: 'A smooth, warm stone that emits a soft golden light. It is the key to holding back the encroaching Shadow.' }
    ],
    illustrations: [],
  },
   {
    id: 'community-3',
    title: 'Star-Crossed Odyssey',
    author: 'Jax Stardust',
    genre: 'Space Opera',
    tone: 'Adventurous, Humorous',
    outline: 'A down-on-his-luck cargo pilot and his snarky android co-pilot accidentally intercept a cryptic message that puts them in the crosshairs of a tyrannical galactic empire, forcing them on a wild journey across the cosmos.',
    chapters: [
        { id: 'c3-1', title: 'The Wrong Delivery', content: 'Captain Rex gets more than he bargained for when a simple cargo run turns out to be a pickup for a fugitive princess.', tensionLevel: 'medium' }
    ],
    characters: [
      {
        id: 'char-c3-1', name: 'Captain Rex "Rocket" Riggs', gender: 'Male', age: '28', species: 'Human', role: 'Protagonist',
        personalityArchetypes: ['Impulsive', 'Charismatic', 'Resourceful'], moralAlignment: 'Chaotic Good',
        motivations: ['Pay off his debts', 'Stick it to the Empire'], fears: ['Being alone', 'Running out of fuel'],
        appearance: { height: '5\'11"', build: 'Wiry', hairColor: 'Red', eyeColor: 'Blue', distinctiveFeatures: 'A charmingly crooked smile and a worn leather jacket.' },
        backstory: 'A former starfighter pilot for the rebellion, dishonorably discharged for "creative insubordination." Now he flies his rust-bucket ship, The Comet, for anyone who pays.',
        relationships: 'Constant bickering but deep loyalty with his android co-pilot, C-42.', dialogueStyle: 'Witty, fast-talking, and full of bravado.'
      }
    ],
    worlds: [
      { id: 'world-c3-1', name: 'The Outer Rim', description: 'A lawless expanse of space filled with asteroid fields, smugglers\' dens, and forgotten colonies, all under the iron fist of the Galthan Empire.', geography: 'The story starts on the grimy spaceport of Xylos.', culture: 'A melting pot of alien species, all trying to survive.' }
    ],
    items: [],
    illustrations: [],
  }
];
