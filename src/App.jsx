import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Trophy, 
  Award,
  BarChart3,
  Cpu,
  Zap,
  Layers,
  Clock,
  Crown,
  Monitor,
  Activity
} from 'lucide-react';

// --- CONFIGURATION: IFRAME CONTENT ---
// Using the exact /pubembed path from your snippet to ensure the correct version loads.
// Added rm=minimal to keep the UI clean and t=timestamp to bypass any caching issues.
const BASE_PPT_URL = "https://docs.google.com/presentation/d/e/2PACX-1vRRusCfhNFJUzzwp9HjWJw7ezxtv4crG4DtlDde2VfRATjEBCOp5Sp6gqzg-8xY6RiwD6EyLh3n7A5W/pubembed?start=false&loop=false&delayms=3000&rm=minimal&t=" + Date.now();

const SLIDE_URLS = [
  `${BASE_PPT_URL}&slide=id.p1`, 
  `${BASE_PPT_URL}&slide=id.p2`,
  `${BASE_PPT_URL}&slide=id.p3`,
  `${BASE_PPT_URL}&slide=id.p4`, 
  `${BASE_PPT_URL}&slide=id.p5`,
  `${BASE_PPT_URL}&slide=id.p6`,
  `${BASE_PPT_URL}&slide=id.p7`, 
  `${BASE_PPT_URL}&slide=id.p8`,
  `${BASE_PPT_URL}&slide=id.p9`,
  `${BASE_PPT_URL}&slide=id.p10` 
];

// --- QUIZ & LEADERBOARD DATA ---
const QUIZ_DATA = [
  {
    question: "The Samsung Galaxy A56 features an upgraded display. What is its peak refresh rate?",
    options: ["60Hz", "90Hz", "120Hz Super AMOLED", "144Hz Dynamic"],
    icon: <Layers className="text-blue-500" />
  },
  {
    question: "Which new processor powers the Galaxy A56's improved multitasking capabilities?",
    options: ["Exynos 1380", "Exynos 1580 (4nm)", "Snapdragon 6 Gen 1", "MediaTek Dimensity 900"],
    icon: <Cpu className="text-purple-500" />
  },
  {
    question: "What is the rated battery capacity for the Galaxy A56 to ensure 'All-Day' usage?",
    options: ["3,500 mAh", "4,200 mAh", "5,000 mAh", "6,000 mAh"],
    icon: <Zap className="text-amber-500" />
  }
];

const LEADERBOARD_STAGES = [
  [
    { name: "Sarah Jenkins", correct: 1, time: "1.24", rank: 1 },
    { name: "Mike Ross", correct: 1, time: "1.85", rank: 2 },
    { name: "Jessica Pearson", correct: 1, time: "2.10", rank: 3 },
    { name: "Harvey Specter", correct: 1, time: "2.45", rank: 4 },
  ],
  [
    { name: "Sarah Jenkins", correct: 2, time: "2.55", rank: 1 },
    { name: "Jessica Pearson", correct: 2, time: "3.42", rank: 2 },
    { name: "Mike Ross", correct: 2, time: "4.01", rank: 3 },
    { name: "Harvey Specter", correct: 1, time: "4.80", rank: 4 },
  ],
  [
    { name: "Sarah Jenkins", correct: 3, time: "4.12", rank: 1 },
    { name: "Jessica Pearson", correct: 3, time: "5.30", rank: 2 },
    { name: "Harvey Specter", correct: 3, time: "6.15", rank: 3 },
    { name: "Mike Ross", correct: 2, time: "7.05", rank: 4 },
  ]
];

// --- DECK STRUCTURE CONFIGURATION ---
const DECK_FLOW = [
  { type: 'start' },
  { pptRange: [0, 2], quizIdx: 0 }, 
  { pptRange: [3, 5], quizIdx: 1 }, 
  { pptRange: [6, 8], quizIdx: 2 }, 
  { pptRange: [9, 9] },             
  { type: 'winner' }
];

// --- COMPONENTS ---

const StartScreen = () => (
  <div className="h-full flex flex-col items-center justify-center bg-white text-black p-8 text-center animate-in fade-in zoom-in-95 duration-1000">
    <h1 className="text-7xl font-black mb-4 tracking-tighter uppercase italic text-black text-center leading-tight">Samsung Roadshow</h1>
    <p className="text-gray-400 text-2xl font-medium tracking-tight">Galaxy A56: The Next Generation</p>
  </div>
);

const PPTSlide = ({ src, title }) => (
  <div className="w-full h-full bg-white relative">
    <iframe 
      className="w-full h-full border-none"
      src={src} 
      allowFullScreen 
      title={title || "PowerPoint Content"}
    />
  </div>
);

const PresentationQuestion = ({ data }) => (
  <div className="h-full w-full flex flex-col items-center justify-center p-12 bg-gray-50 text-gray-900 animate-in fade-in duration-700">
    <div className="w-full max-w-6xl">
      <h2 className="text-6xl font-black text-center mb-20 leading-tight tracking-tight text-gray-900">
        {data.question}
      </h2>
      <div className="grid grid-cols-2 gap-8 w-full">
        {data.options.map((option, idx) => (
          <div key={idx} className="flex items-center gap-6 p-10 rounded-[2.5rem] border-2 border-gray-200 bg-white shadow-xl shadow-gray-200/50">
            <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center text-3xl font-black shadow-lg">
              {String.fromCharCode(65 + idx)}
            </div>
            <span className="text-4xl font-bold text-gray-800">{option}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LeaderboardSlide = ({ stageIndex }) => {
  const rankings = LEADERBOARD_STAGES[stageIndex];
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-12 bg-gray-50 text-gray-900">
       <div className="w-full max-w-4xl bg-white p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-5xl font-black tracking-tighter text-black uppercase italic">Live Leaderboard</h2>
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm mt-2">Round {stageIndex + 1} Results • Quickest Finger</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100"><Trophy size={48} className="text-black" /></div>
          </div>
          <div className="space-y-4">
            {rankings.map((entry, idx) => (
                <div key={idx} className={`flex items-center justify-between p-8 rounded-3xl border-2 transition-all duration-500 ${idx === 0 ? "bg-black text-white border-black shadow-2xl scale-[1.05]" : "bg-white border-gray-100 text-gray-900"}`}>
                  <div className="flex items-center gap-8">
                    <span className={`text-4xl font-black ${idx === 0 ? "text-white" : "text-gray-300"}`}>{idx + 1}</span>
                    <span className="font-bold text-3xl">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-10">
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Correct</span>
                        <span className="text-2xl font-black">{entry.correct}</span>
                     </div>
                     <div className="flex flex-col items-end min-w-[120px]">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Time</span>
                        <span className={`text-2xl font-mono font-bold ${idx === 0 ? "text-white" : "text-black"}`}>{entry.time}s</span>
                     </div>
                  </div>
                </div>
              ))}
          </div>
       </div>
    </div>
  );
};

const WinnerScreen = () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white text-black p-12 text-center animate-in zoom-in-95 duration-1000">
        <Crown size={200} className="text-black mb-16 stroke-[1.5]" />
        <h1 className="text-[9rem] font-black italic uppercase tracking-tighter leading-none mb-4 text-black text-center">Sarah Jenkins</h1>
        <div className="h-2 w-48 bg-black mx-auto mb-10 rounded-full" />
        <h2 className="text-5xl font-black text-gray-400 uppercase tracking-[0.4em] mb-12">Grand Champion</h2>
        <div className="flex gap-12 bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem] shadow-sm">
            <div className="text-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Final Score</p>
                <p className="text-4xl font-black text-black">3/3</p>
            </div>
            <div className="w-px h-12 bg-gray-200 self-center" />
            <div className="text-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Best Time</p>
                <p className="text-4xl font-mono font-black text-black">4.12s</p>
            </div>
        </div>
    </div>
);

// --- MAIN APP ---

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);

  const deck = useMemo(() => {
    let masterDeck = [];
    DECK_FLOW.forEach(segment => {
      if (segment.type === 'start') {
        masterDeck.push({ type: 'start' });
      } else if (segment.type === 'winner') {
        masterDeck.push({ type: 'winner' });
      } else if (segment.pptRange) {
        const [start, end] = segment.pptRange;
        for (let i = start; i <= end; i++) {
          masterDeck.push({ type: 'ppt', url: SLIDE_URLS[i], title: `Part ${i}` });
        }
        if (segment.quizIdx !== undefined) {
          masterDeck.push({ type: 'quiz', quizIdx: segment.quizIdx });
          masterDeck.push({ type: 'leaderboard', quizIdx: segment.quizIdx });
        }
      }
    });
    return masterDeck;
  }, []);

  const nextSlide = useCallback(() => {
    if (slideIndex < deck.length - 1) setSlideIndex(prev => prev + 1);
  }, [slideIndex, deck.length]);

  const prevSlide = useCallback(() => {
    if (slideIndex > 0) setSlideIndex(prev => prev - 1);
  }, [slideIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const activeSlide = deck[slideIndex];

  const renderContent = () => {
    if (!activeSlide) return null;
    
    switch (activeSlide.type) {
      case 'start': return <StartScreen />;
      case 'ppt': return <PPTSlide src={activeSlide.url} title={activeSlide.title} />;
      case 'quiz': return <PresentationQuestion data={QUIZ_DATA[activeSlide.quizIdx]} index={activeSlide.quizIdx} />;
      case 'leaderboard': return <LeaderboardSlide stageIndex={activeSlide.quizIdx} />;
      case 'winner': return <WinnerScreen />;
      default: return null;
    }
  };

  return (
    <div className="w-screen h-screen bg-black select-none font-sans overflow-hidden cursor-none">
      <div className="fixed inset-y-0 left-0 w-24 z-[100] cursor-none" onClick={prevSlide} />
      <div className="fixed inset-y-0 right-0 w-24 z-[100] cursor-none" onClick={nextSlide} />

      <div className="w-full h-full transition-all duration-700 ease-in-out">
        {renderContent()}
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 h-1.5 bg-gray-200/20 w-full z-[110]">
        <div 
            className="h-full bg-black transition-all duration-500 ease-out" 
            style={{ width: `${((slideIndex + 1) / deck.length) * 100}%` }}
        />
      </div>
    </div>
  );
}