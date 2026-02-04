import React, { useState, useEffect } from 'react';
import { Reader } from './components/Reader';
import { fetchChunks } from './services/bookService';
import { getDayOfYearUTC } from './utils/time';

const App: React.FC = () => {
  const [chunks, setChunks] = useState<string[]>([]);
  const [currentChunk, setCurrentChunk] = useState<string | null>(null);
  const [dayOfYear, setDayOfYear] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const loadedChunks = await fetchChunks();
        setChunks(loadedChunks);
        
        const day = getDayOfYearUTC();
        setDayOfYear(day);
        
        // Handle leap years or missing data gracefully
        const chunkIndex = (day - 1) % loadedChunks.length;
        setCurrentChunk(loadedChunks[chunkIndex] || "The pages are silent today.");
      } catch (err) {
        console.error("Failed to load book:", err);
        setError("The book could not be opened.");
      } finally {
        setLoading(false);
      }
    };

    init();

    // Check for day change every minute
    const interval = setInterval(() => {
      const newDay = getDayOfYearUTC();
      setDayOfYear(prev => {
        if (newDay !== prev) {
           window.location.reload(); 
           return newDay;
        }
        return prev;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center opacity-0 animate-[fadeIn_2s_ease-in_forwards]">
        <span className="text-stone-400 italic font-light tracking-widest text-sm uppercase">Opening...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-900/50 italic">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-stone-200 selection:text-stone-900">
      <main className="flex-grow flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 w-full">
        {currentChunk && (
          <Reader 
            text={currentChunk} 
            dayOfYear={dayOfYear} 
            totalDays={chunks.length} 
          />
        )}
      </main>
    </div>
  );
};

export default App;