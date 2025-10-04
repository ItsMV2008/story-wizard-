
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Story, Message } from '../types';
import { createChatSession } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';
import { Chat } from '@google/genai';
import Spinner from '../components/Spinner';

interface StoryEditorProps {
  story: Story;
}

const StoryEditor: React.FC<StoryEditorProps> = ({ story }) => {
  const { updateStory, updateChapter } = useAppContext();
  const [mainContent, setMainContent] = useState(story.chapters[0]?.content || '');

  // For this example, we'll edit the first chapter. A real app would have chapter selection.
  const activeChapterId = story.chapters.length > 0 ? story.chapters[0].id : null;
  
  useEffect(() => {
    // Basic auto-save logic
    const handler = setTimeout(() => {
      if(activeChapterId) {
        const chapter = story.chapters.find(c => c.id === activeChapterId);
        if(chapter && chapter.content !== mainContent) {
          updateChapter(story.id, {...chapter, content: mainContent});
        }
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [mainContent, story, activeChapterId, updateChapter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2 flex flex-col h-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">Manuscript</h3>
          </div>
          <textarea
            value={mainContent}
            onChange={(e) => setMainContent(e.target.value)}
            placeholder="Once upon a time..."
            className="w-full h-full p-4 bg-transparent resize-none focus:outline-none text-base leading-relaxed"
          />
        </div>
      </div>
      <AIChat story={story} onInsertText={(text) => setMainContent(prev => prev + '\n\n' + text)} />
    </div>
  );
};

interface AIChatProps {
  story: Story;
  onInsertText: (text: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ story, onInsertText }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChatSession(story);
    setMessages([]);
  }, [story]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading || !chatRef.current) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let fullResponse = '';
      const result = await chatRef.current.sendMessageStream({ message: input });
      
      const modelMessage: Message = { role: 'model', text: '' };
      setMessages(prev => [...prev, modelMessage]);

      for await (const chunk of result) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 ? { ...msg, text: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-full max-h-[85vh]">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Assistant</h3>
        {isLoading && <Spinner />}
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.role === 'model' && msg.text && (
                 <button onClick={() => onInsertText(msg.text)} className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                    Insert into Story
                </button>
              )}
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask AI to continue, rewrite, etc."
            className="flex-1 px-3 py-2 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryEditor;
