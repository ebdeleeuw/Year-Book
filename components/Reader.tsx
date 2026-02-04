import React from 'react';

interface ReaderProps {
  text: string;
  dayOfYear: number;
  totalDays: number;
}

// Helper to parse PG formatting
// _word_ -> italics
// =word= -> bold
const formatText = (text: string): React.ReactNode => {
  // Regex splits by markers but keeps them in the array via capturing group
  // Filters out empty strings to prevent empty spans
  const parts = text.split(/(_[^_]+_|=+[^=]+=)/g).filter(p => p !== '');

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('_') && part.endsWith('_')) {
          // Render italics, stripping delimiters
          return <em key={index} className="italic">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('=') && part.endsWith('=')) {
          // Render bold, stripping delimiters. Using semibold for better aesthetics.
          return <strong key={index} className="font-semibold text-stone-900">{part.slice(1, -1)}</strong>;
        }
        // Render plain text
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export const Reader: React.FC<ReaderProps> = ({ text, dayOfYear, totalDays }) => {
  // Normalize line endings to \n, then split. Filter removes empty lines.
  const paragraphs = text.replace(/\r\n/g, '\n').split('\n').filter(p => p.trim() !== '');
  
  // Strict UTC formatting for consistency
  const now = new Date();
  const utcMonth = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const utcDate = now.getUTCDate();

  return (
    <div className="relative w-full max-w-2xl mx-auto transition-opacity duration-1000 ease-in opacity-0 animate-[fadeIn_1.5s_ease-out_forwards]">
      
      {/* Date Indicator (Top Right - Floating) */}
      <div className="absolute -top-16 md:-top-24 right-0 flex flex-col items-end opacity-60">
        <span className="font-sans text-[10px] tracking-[0.25em] text-stone-500 uppercase">
          {utcMonth}
        </span>
        <span className="font-serif text-5xl md:text-7xl text-stone-300 font-thin leading-none -mr-1 mt-1">
          {utcDate}
        </span>
      </div>

      {/* Main Text Content */}
      <article className="prose prose-lg md:prose-xl prose-stone max-w-none text-justify leading-loose md:leading-[2.2] hyphens-auto">
        {paragraphs.map((p, idx) => (
          <p 
            key={idx} 
            // Apply Drop Cap styling to the first paragraph using first-letter pseudo-element
            className={`
              mb-8 text-stone-800 font-normal
              ${idx === 0 ? 'first-letter:text-6xl md:first-letter:text-7xl first-letter:font-normal first-letter:text-stone-900 first-letter:mr-3 first-letter:mt-[-6px] first-letter:float-left first-letter:leading-[0.8] first-letter:font-serif' : ''}
            `}
          >
            {formatText(p)}
          </p>
        ))}
      </article>

      {/* Footer / Folio */}
      <div className="mt-16 md:mt-24 border-t border-stone-200/60 pt-6 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity duration-700">
        <span className="font-sans text-[9px] tracking-[0.2em] text-stone-500 uppercase">
          Year of the Book
        </span>
        <span className="font-sans text-[9px] tracking-[0.2em] text-stone-500 uppercase">
          {dayOfYear} / {totalDays}
        </span>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hyphens-auto {
          -webkit-hyphens: auto;
          -ms-hyphens: auto;
          hyphens: auto;
        }
      `}</style>
    </div>
  );
};