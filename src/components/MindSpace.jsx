import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Search, Heart, Wind, BookOpen, Music } from 'lucide-react';

const MindSpace = () => {
  // --- STATE MANAGEMENT ---
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [entries, setEntries] = useState([]);

  const [isBreathing, setIsBreathing] = useState(false);
  const [breathePhase, setBreathePhase] = useState('Ready');
  const [breatheTimer, setBreatheTimer] = useState(4);

  // Audio Player State
  const tracks = [
    { title: 'Midnight Lo-Fi', src: '/midnight-lofi.mp3' },
    { title: 'Rain Drops', src: '/rain-drops.mp3' },
    { title: 'Forest Ambience', src: '/forest-ambience.mp3' }
  ];
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [audioElement, setAudioElement] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // --- MOCK DATA ---
  const moods = ['Anxious', 'Grateful', 'Overwhelmed', 'Calm', 'Excited'];
  const resources = [
    { id: 1, title: '5 Grounding Techniques', category: 'Anxiety', icon: <Heart size={18} /> },
    { id: 2, title: 'Understanding Burnout', category: 'Stress', icon: <BookOpen size={18} /> },
    { id: 3, title: 'Sleep Hygiene 101', category: 'Habits', icon: <Music size={18} /> },
    { id: 4, title: 'Journaling for Beginners', category: 'Mindfulness', icon: <BookOpen size={18} /> },
  ];

  // --- AUDIO LOGIC EFFECT ---
  useEffect(() => {
    // Create audio element instance if it doesn't exist
    const audio = audioElement || new Audio(currentTrack.src);
    if (!audioElement) setAudioElement(audio);

    // If the track source changed, update it
    if (audio.src !== window.location.origin + currentTrack.src) {
      audio.src = currentTrack.src;
      if (isPlaying) audio.play().catch(e => console.log("Audio play interrupted"));
    }

    // Play or Pause execution
    if (isPlaying) {
      audio.play().catch(e => console.log("Playback interaction required first"));
    } else {
      audio.pause();
    }

    // Sync volume level slider
    audio.volume = volume / 100;

    return () => {
      if (!audioElement) audio.pause();
    };
  }, [isPlaying, currentTrack, volume]);

  // --- JOURNAL ENTRY HANDLER ---
  const handleSaveEntry = () => {
    if (journalText.trim() === '' || !selectedMood) return;
    const newEntry = {
      id: Date.now(),
      text: journalText,
      mood: selectedMood,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setEntries([newEntry, ...entries]);
    setJournalText('');
    setSelectedMood('');
  };

  // --- BREATHING TIMER CYCLE ---
  useEffect(() => {
    let interval;
    if (isBreathing) {
      const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
      let phaseIndex = 0;
      let time = 4;

      setBreathePhase(phases[phaseIndex]);
      setBreatheTimer(time);

      interval = setInterval(() => {
        time -= 1;
        if (time <= 0) {
          phaseIndex = (phaseIndex + 1) % 4;
          time = 4;
          setBreathePhase(phases[phaseIndex]);
        }
        setBreatheTimer(time);
      }, 1000);
    } else {
      setBreathePhase('Ready');
      setBreatheTimer(4);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const filteredResources = resources.filter(res => 
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    res.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-teal-50 text-slate-800 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-teal-800 flex items-center gap-2">
              <Wind className="text-teal-500" /> MindSpace
            </h1>
            <p className="text-teal-600 mt-1">Your safe digital sanctuary.</p>
          </div>
        </header>

        {/* Dynamic Grid Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column One: Journal & Breathing */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Feature 1: Interactive Journaling */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 transition-all hover:shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-slate-700">How are you feeling?</h2>
              <textarea
                className="w-full p-4 bg-teal-50/50 border border-teal-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 resize-none transition-all"
                rows="4"
                placeholder="Pour your thoughts here..."
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
              />
              <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        selectedMood === mood 
                        ? 'bg-teal-500 text-white shadow-md' 
                        : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleSaveEntry}
                  className="bg-slate-800 text-white px-6 py-2 rounded-full hover:bg-slate-700 transition-colors font-medium cursor-pointer"
                >
                  Save Entry
                </button>
              </div>

              {/* Saved Entry History Logs */}
              {entries.length > 0 && (
                <div className="mt-8 pt-6 border-t border-teal-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Entries</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entries.map((entry) => (
                      <div key={entry.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-semibold bg-white px-2 py-1 rounded shadow-sm text-teal-600 border border-teal-50">
                            {entry.mood}
                          </span>
                          <span className="text-xs text-slate-400">{entry.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">{entry.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Feature 2: Box Breathing Widget */}
            <section className="bg-indigo-50 p-6 rounded-2xl shadow-sm border border-indigo-100 flex flex-col items-center justify-center py-12 transition-all hover:shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-indigo-900">Box Breathing (4-4-4-4)</h2>
              <p className="text-indigo-600 mb-8 text-sm">Calm your nervous system in minutes.</p>
              
              <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                {/* Visual Scale Animation Ring */}
                <div 
                  className="absolute bg-indigo-200 rounded-full opacity-50 transition-all duration-1000 ease-in-out"
                  style={{
                    width: '100%',
                    height: '100%',
                    transform: isBreathing && breathePhase === 'Inhale' ? 'scale(1.35)' : 
                               isBreathing && breathePhase === 'Exhale' ? 'scale(0.75)' : 'scale(1)'
                  }}
                />
                <div className="absolute w-32 h-32 bg-indigo-400 rounded-full flex flex-col items-center justify-center text-white shadow-lg z-10">
                  <span className="text-2xl font-bold tracking-wide">{isBreathing ? breathePhase : 'Start'}</span>
                  {isBreathing && <span className="text-lg opacity-90">{breatheTimer}s</span>}
                </div>
              </div>

              <button 
                onClick={() => setIsBreathing(!isBreathing)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full hover:bg-indigo-700 transition-colors shadow-md font-medium cursor-pointer"
              >
                {isBreathing ? 'Stop Exercise' : 'Begin Breathing'}
              </button>
            </section>
          </div>

          {/* Column Two: Sidebar Controls */}
          <div className="space-y-8">
            
            {/* Feature 3: Live Audio Player */}
            <section className="bg-slate-800 p-6 rounded-2xl shadow-sm text-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-700 rounded-lg"><Music size={20} className="text-teal-300"/></div>
                <h2 className="text-lg font-semibold">Calming Beats</h2>
              </div>
              
              <div className="mb-6">
                <p className="text-xs text-slate-400 mb-1">Now Playing</p>
                <p className="font-medium text-teal-300 text-base">{currentTrack.title}</p>
              </div>

              <div className="flex items-center justify-between mb-6 gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 bg-teal-500 rounded-full hover:bg-teal-400 transition-colors text-slate-900 cursor-pointer"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
                
                {/* Volume Slider Control */}
                <div className="flex items-center gap-2 text-slate-400 flex-1 justify-end">
                  <Volume2 size={18} />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                </div>
              </div>

              {/* Dynamic Mock Playback Progress Bar */}
              <div className="w-full h-1 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div className={`h-full bg-teal-400 transition-all duration-300 ${isPlaying ? 'w-1/3' : 'w-1/12'}`} />
              </div>

              <div className="space-y-1">
                {tracks.map(track => (
                  <button 
                    key={track.title}
                    onClick={() => { setCurrentTrack(track); setIsPlaying(true); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                      currentTrack.title === track.title ? 'bg-slate-700 text-teal-300 font-medium' : 'text-slate-400 hover:bg-slate-700/50'
                    }`}
                  >
                    {track.title}
                  </button>
                ))}
              </div>
            </section>

            {/* Feature 4: Filterable Resource Hub */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100">
              <h2 className="text-lg font-semibold mb-4 text-slate-700">Resource Hub</h2>
              
              <div className="relative mb-4">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search tips or categories..."
                  className="w-full pl-10 pr-4 py-2 bg-teal-50/70 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-1">
                {filteredResources.length > 0 ? (
                  filteredResources.map(res => (
                    <div 
                      key={res.id} 
                      className="flex items-center p-3 hover:bg-teal-50/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-teal-100"
                    >
                      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg mr-3 shrink-0">
                        {res.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-700 line-clamp-1">{res.title}</h3>
                        <p className="text-xs text-slate-400 font-medium">{res.category}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No matching resources found.</p>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MindSpace;
