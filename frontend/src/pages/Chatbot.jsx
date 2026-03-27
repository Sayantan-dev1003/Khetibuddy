import React, { useEffect, useState } from 'react';
import { Mic, Send, Volume2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import ChatHistory from '../components/ChatHistory';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function Chatbot() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('english');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = React.useRef(null);

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'malayalam', label: 'Malayalam (മലയാളം)' },
  ];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loading]);

  /* ---------------- FEMALE VOICE ---------------- */
  const getFemaleVoice = (langCode) => {
    const voices = window.speechSynthesis.getVoices();
    
    console.log('🔍 Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    console.log('🎯 Looking for language:', langCode);
  
    // Try to find female voices for the specified language
    let femaleVoices = voices.filter(v => {
      const voiceLang = v.lang.toLowerCase();
      const voiceName = v.name.toLowerCase();
      const targetLang = langCode.toLowerCase();
      
      // Check if voice matches the language
      const langMatch = voiceLang.startsWith(targetLang) || voiceLang.includes(targetLang);
      
      // Check if it's likely a female voice
      const isFemale = 
        voiceName.includes('female') ||
        voiceName.includes('zira') ||      // Windows (en-US)
        voiceName.includes('samantha') ||  // macOS (en-US)
        voiceName.includes('natasha') ||   // Windows (en-GB)
        voiceName.includes('heera') ||     // Windows (hi-IN)
        voiceName.includes('kalpana') ||   // Windows (hi-IN)
        voiceName.includes('hemant') ||    // Windows (hi-IN) - actually male, exclude
        voiceName.includes('swara') ||     // Google (hi-IN)
        voiceName.includes('neerja') ||    // Google (hi-IN)
        voiceName.includes('google') ||    // Google voices (usually better quality)
        voiceName.includes('microsoft') ||
        // Malayalam
        voiceName.includes('veena');       // Windows (ml-IN)
      
      return langMatch && isFemale && !voiceName.includes('hemant');
    });

    console.log(`✅ Found ${femaleVoices.length} female voices for ${langCode}:`, 
      femaleVoices.map(v => v.name));
  
    // If no female voice found, try any voice for that language
    if (femaleVoices.length === 0) {
      console.log('⚠️ No female voice found, trying any voice for language');
      femaleVoices = voices.filter(v => 
        v.lang.toLowerCase().startsWith(langCode.toLowerCase())
      );
      console.log(`📢 Found ${femaleVoices.length} total voices:`, 
        femaleVoices.map(v => v.name));
    }
    
    // Prefer Google voices first (better quality)
    const googleVoice = femaleVoices.find(v => v.name.toLowerCase().includes('google'));
    if (googleVoice) {
      console.log('🎉 Using Google voice:', googleVoice.name);
      return googleVoice;
    }
  
    const selectedVoice = femaleVoices.length > 0 ? femaleVoices[0] : null;
    if (selectedVoice) {
      console.log('🎤 Selected voice:', selectedVoice.name);
    } else {
      console.log('❌ No voice found for language:', langCode);
    }
    
    return selectedVoice;
  };
  

  /* ---------------- CREATE SESSION ---------------- */
  useEffect(() => {
    createNewSession();
    
    // Load voices on component mount
    if ('speechSynthesis' in window) {
      // Load voices
      window.speechSynthesis.getVoices();
      
      // Some browsers need this event to load voices
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('✅ Voices loaded:', voices.length);
        console.log('Available languages:', [...new Set(voices.map(v => v.lang))].sort());
      };
    }
  }, []);

  // Create a new chat session
  const createNewSession = async () => {
    try {
      console.log('[Chatbot] Creating new session...');
      const res = await fetch(`${API_BASE}/api/chat/session`, { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        console.log('[Chatbot] New session created:', data.sessionId);
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
        setChatMessages([]);
      }
    } catch (error) {
      console.error('[Chatbot] Failed to create session:', error);
      alert('Failed to start chat session');
    }
  };

  // Load an existing session
  const loadSession = async (loadSessionId) => {
    try {
      console.log('[Chatbot] Loading session:', loadSessionId);
      const res = await fetch(`${API_BASE}/api/chat/messages/${loadSessionId}`);
      const data = await res.json();
      
      if (data.success) {
        console.log('[Chatbot] Loaded', data.data.length, 'messages');
        setSessionId(loadSessionId);
        localStorage.setItem('chatSessionId', loadSessionId);
        setChatMessages(data.data);
        setHistoryOpen(false);
      }
    } catch (error) {
      console.error('[Chatbot] Failed to load session:', error);
      alert('Failed to load chat session');
    }
  };

  /* ---------------- VOICE INPUT ---------------- */
  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'malayalam' ? 'ml-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(prev => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = () => {
      alert('Voice recognition failed.');
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
  };

  /* ---------------- TEXT TO SPEECH + GIF SYNC ---------------- */
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakText = (text) => {
    window.speechSynthesis.cancel(); // stop previous
  
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Auto-detect language from text
    const hindiPattern = /[\u0900-\u097F]/;
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    
    let detectedLang = 'en-IN';
    let langCode = 'en';
    
    if (hindiPattern.test(text)) {
      detectedLang = 'hi-IN';
      langCode = 'hi';
      console.log('🗣️ Detected Hindi text');
    } else if (malayalamPattern.test(text)) {
      detectedLang = 'ml-IN';
      langCode = 'ml';
      console.log('🗣️ Detected Malayalam text');
    } else {
      console.log('🗣️ Using English');
    }
    
    utterance.lang = detectedLang;
  
    // Get female voice for the detected language
    const femaleVoice = getFemaleVoice(langCode);
    
    if (!femaleVoice) {
      console.warn('⚠️ No voice available for', langCode);
      alert(`No ${langCode === 'hi' ? 'Hindi' : langCode === 'ml' ? 'Malayalam' : 'English'} voice available on this device. Please install language pack or use Chrome browser.`);
      return;
    }
  
    utterance.voice = femaleVoice;
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
  
    utterance.onstart = () => {
      console.log('🎤 Speaking started with voice:', femaleVoice.name);
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log('✅ Speaking ended');
      setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
      console.error('❌ Speech error:', e);
      setIsSpeaking(false);
    };
  
    window.speechSynthesis.speak(utterance);
  };
  

  /* ---------------- ASK QUESTION ---------------- */
  const handleAskQuestion = async () => {
    if (!question.trim()) return alert('Please enter a question');
    if (!sessionId) return alert('Session not ready');

    setLoading(true);

    // Add user message immediately to UI
    const userMessage = {
      role: 'user',
      content: question,
      createdAt: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, userMessage]);
    const currentQuestion = question;
    setQuestion('');

    try {
      console.log('[Chatbot] Sending message to session:', sessionId);
      const res = await fetch(`${API_BASE}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: currentQuestion }),
      });

      const data = await res.json();
      console.log('[Chatbot] Response received:', data);
      if (!data.success) throw new Error(data.message);

      // Add assistant response to UI
      const assistantMessage = {
        role: 'assistant',
        content: data.data.assistant,
        createdAt: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Something went wrong. Please try again.',
        createdAt: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat History Sidebar */}
      <ChatHistory
        currentSessionId={sessionId}
        onLoadSession={loadSession}
        onNewChat={createNewSession}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />

      <PageHeader
        title="Eco-Assistant"
        subtitle="Sow your questions, reap our wisdom. (English & Malayalam)"
        icon="🌿"
        className="mb-8"
      />

      {/* AI AVATAR - Show when there are messages */}
      <div className="flex justify-center mb-10">
        <div
          className={`w-48 h-48 rounded-[3rem] overflow-hidden border-8 ${
            isSpeaking ? 'border-[var(--secondary)] ring-8 ring-[var(--secondary)]/20 animate-pulse scale-105' : 'border-[var(--primary)]'
          } shadow-[0_20px_50px_rgba(93,64,55,0.3)] transition-all duration-500 hover:rotate-2`}
        >
          <img
            src={
              isSpeaking || loading
                ? '/avatars/avatar-talking.gif'
                : '/avatars/avatar-idle.png'
            }
            alt="AI Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
        
      {/* Chat Messages Display */}
      <div className="mb-8">
        {chatMessages.length > 0 ? (
          <div
            className="space-y-8 overflow-y-auto p-8 bg-[var(--bg-alt)]/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-[var(--primary-light)]/10 shadow-inner custom-scrollbar scroll-smooth"
            style={{ maxHeight: 'calc(100vh - 35rem)', minHeight: '450px' }}
          >
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${msg.role === 'user' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--primary)] text-white'}`}>
                  <span className="text-2xl">{msg.role === 'user' ? '👨‍🌾' : '🐢'}</span>
                </div>
                
                <div
                  className={`relative max-w-[80%] px-8 py-5 rounded-[2rem] shadow-xl border transition-all duration-300 hover:shadow-2xl ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-white rounded-br-none border-[var(--earth-deep)]'
                      : 'bg-white text-[var(--text-main)] rounded-bl-none border-[var(--primary-light)]/10'
                  }`}
                >
                  <p className="text-base font-bold opacity-60 mb-2 uppercase tracking-widest text-[10px]">
                    {msg.role === 'user' ? 'Your Seeds' : 'Buddy\'s Wisdom'}
                  </p>
                  <p className="whitespace-pre-wrap leading-relaxed font-medium text-lg">{msg.content}</p>
                  
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                      className="mt-4 flex items-center gap-2 text-sm font-black text-[var(--secondary)] hover:text-[var(--primary)] transition-all group"
                      aria-label={isSpeaking ? 'Stop reading aloud' : 'Read message aloud'}
                    >
                      <div className={`p-2 rounded-full ${isSpeaking ? 'bg-[var(--secondary)] text-white animate-pulse' : 'bg-[var(--secondary)]/10 text-[var(--secondary)]'} group-hover:scale-110 transition-transform`}>
                        <Volume2 size={18} />
                      </div>
                      <span>{isSpeaking ? 'Quiet Buddy' : 'Hear Wisdom'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-4 animate-pulse">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center">
                  <span className="text-2xl opacity-50">🐢</span>
                </div>
                <div className="px-8 py-5 rounded-[2rem] bg-white rounded-bl-none shadow-lg border border-[var(--primary-light)]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    <span className="text-[var(--text-muted)] font-black uppercase text-xs tracking-widest ml-2">Planting thoughts...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-[var(--primary-light)]/20">
            <div className="text-7xl mb-6">🌱</div>
            <h3 className="text-3xl font-black text-[var(--primary)] mb-2">Ready to Grow?</h3>
            <p className="text-[var(--text-muted)] font-bold text-lg">Ask me anything about your crops, soil, or climate.</p>
          </div>
        )}
      </div>

      {/* Question Input - Fixed at Bottom */}
      <Card className="!bg-white/80 backdrop-blur-md !border-t-4 !border-t-[var(--accent)] !rounded-[2.5rem]" padding="lg">
        <div className="flex items-center justify-between mb-6">
          <label className="text-[var(--primary)] text-xl font-black tracking-tight flex items-center gap-2">
            <Mic size={24} className="text-[var(--accent)]" />
            Sow Your Question
          </label>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none font-black text-xs px-6 py-2 pr-10 border-2 border-[var(--primary-light)]/20 rounded-full focus:outline-none focus:border-[var(--primary)] bg-white text-[var(--primary)] cursor-pointer hover:bg-[var(--bg-alt)] transition-all"
              >
                <option value="english">ENGLISH</option>
                <option value="malayalam">മലയാളം</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--primary)]">
                <Send size={12} className="rotate-90" />
              </div>
            </div>
            {sessionId && (
              <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter px-3 py-1 bg-[var(--bg-alt)] rounded-full">
                ID: {sessionId.substring(0, 8)}
              </span>
            )}
          </div>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            language === 'malayalam'
              ? 'നിങ്ങളുടെ ചോദ്യം ഇവിടെ ടൈപ്പ് ചെയ്യുക...'
              : 'What would you like to cultivate today?'
          }
          rows={3}
          className="w-full px-6 py-5 text-lg font-bold border-2 border-[var(--primary-light)]/10 bg-[var(--bg-main)]/50 rounded-3xl focus:outline-none focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 transition-all resize-none placeholder:text-[var(--text-muted)]/50"
        />

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <PrimaryButton
            onClick={handleVoiceInput}
            variant="outline"
            size="lg"
            icon={<Mic className={isListening ? 'animate-pulse text-red-500 scale-125' : 'group-hover:rotate-12 transition-transform'} />}
            disabled={isListening}
            className="flex-1 !rounded-[2rem] border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white group"
          >
            {isListening ? 'LEAFENING...' : 'VOICE SOWING'}
          </PrimaryButton>

          <PrimaryButton
            onClick={handleAskQuestion}
            variant="primary"
            size="lg"
            icon={<Send className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            loading={loading}
            className="flex-1 sm:flex-[2] !rounded-[2rem] shadow-[0_15px_30px_rgba(93,64,55,0.3)] group"
          >
            SEND QUESTION
          </PrimaryButton>
        </div>
      </Card>

      {/* Extra padding for mobile bottom navigation */}
      <div className="h-4 lg:hidden"></div>
    </div>
  );
}

export default Chatbot;
