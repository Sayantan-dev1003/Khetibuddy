import React, { useEffect, useState, useRef } from 'react';
import { Mic, Send, Volume2, Sparkles, ChevronLeft, ChevronRight, StopCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatHistory from '../components/ChatHistory';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function Chatbot() {
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true); // Default open on desktop
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loading]);

  /* ---------------- VOICE HELPERS ---------------- */
  const getFemaleVoice = (langCode) => {
    const voices = window.speechSynthesis.getVoices();
    let femaleVoices = voices.filter(v => {
      const voiceLang = v.lang.toLowerCase();
      const voiceName = v.name.toLowerCase();
      const targetLang = langCode.toLowerCase();
      const langMatch = voiceLang.startsWith(targetLang) || voiceLang.includes(targetLang);
      const isFemale = voiceName.includes('female') || voiceName.includes('zira') || 
                       voiceName.includes('samantha') || voiceName.includes('natasha') || 
                       voiceName.includes('heera') || voiceName.includes('kalpana') || 
                       voiceName.includes('swara') || voiceName.includes('neerja') || 
                       voiceName.includes('google') || voiceName.includes('veena');
      return langMatch && isFemale && !voiceName.includes('hemant');
    });

    if (femaleVoices.length === 0) {
      femaleVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    }
    
    return femaleVoices.find(v => v.name.toLowerCase().includes('google')) || femaleVoices[0] || null;
  };

  /* ---------------- SESSION MANAGEMENT ---------------- */
  useEffect(() => {
    const savedSessionId = localStorage.getItem('chatSessionId');
    if (savedSessionId) {
      loadSession(savedSessionId);
    } else {
      createNewSession();
    }
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    // Handle initial sidebar state for mobile
    if (window.innerWidth < 1024) setHistoryOpen(false);
  }, []);

  const createNewSession = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/chat/session`, { method: 'POST', credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId);
        localStorage.setItem('chatSessionId', data.sessionId);
        setChatMessages([]);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (loadSessionId) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/chat/messages/${loadSessionId}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setSessionId(loadSessionId);
        localStorage.setItem('chatSessionId', loadSessionId);
        setChatMessages(data.data);
      } else {
        createNewSession();
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      createNewSession();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VOICE INPUT ---------------- */
  const handleVoiceInput = () => {
    if (!SpeechRecognition) return alert('Voice input not supported');
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-IN';
    setIsListening(true);
    recognition.start();
    recognition.onresult = (e) => setQuestion(prev => (prev ? `${prev} ${e.results[0][0].transcript}` : e.results[0][0].transcript));
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  /* ---------------- TTS ---------------- */
  const stopSpeaking = () => { window.speechSynthesis.cancel(); setIsSpeaking(false); };
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const hindiPattern = /[\u0900-\u097F]/;
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    let langCode = hindiPattern.test(text) ? 'hi' : malayalamPattern.test(text) ? 'ml' : 'en';
    utterance.lang = langCode === 'hi' ? 'hi-IN' : langCode === 'ml' ? 'ml-IN' : 'en-IN';
    utterance.voice = getFemaleVoice(langCode);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  /* ---------------- MESSAGE HANDLING ---------------- */
  const handleAskQuestion = async () => {
    if (!question.trim() || !sessionId || loading) return;
    const currentQuestion = question;
    setQuestion('');
    setChatMessages(prev => [...prev, { role: 'user', content: currentQuestion, createdAt: new Date().toISOString() }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sessionId, message: currentQuestion }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.data.assistant, createdAt: new Date().toISOString() }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Request failed. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white shadow-2xl overflow-hidden relative">
      <ChatHistory
        currentSessionId={sessionId}
        onLoadSession={loadSession}
        onNewChat={createNewSession}
        isOpen={historyOpen}
        onToggle={() => setHistoryOpen(!historyOpen)}
      />

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FDFB] relative pt-24">
        {/* Toggle Button for mobile/desktop */}
        <button
          onClick={() => setHistoryOpen(!historyOpen)}
          className={`absolute left-4 top-6 z-10 p-2 bg-white border border-emerald-100 text-emerald-600 rounded-xl shadow-sm hover:bg-emerald-50 transition-all ${
            historyOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {historyOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>

        {/* Chat Header */}
        <div className="p-6 border-b border-emerald-100/50 flex items-center justify-between bg-white/30">
          <div className="flex items-center gap-4 pl-10 lg:pl-12">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full border-2 transition-all p-0.5 ${isSpeaking || loading ? 'border-emerald-500 animate-pulse' : 'border-emerald-200'}`}>
                <img 
                  src={isSpeaking || loading ? '/avatars/avatar-talking.gif' : '/avatars/avatar-idle.png'} 
                  className="w-full h-full rounded-full object-cover" 
                  alt="Assistant"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                Smart Assistant <Sparkles size={16} className="text-emerald-500" />
              </h1>
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">AI Powered Farming Expert</p>
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-hide custom-scrollbar">
          {chatMessages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto opacity-80">
              <div className="w-24 h-24 mb-6 rounded-[2rem] bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
                 <Sparkles size={48} />
              </div>
              <h2 className="text-2xl font-black text-emerald-950 mb-3">Green Thinking Mode</h2>
              <p className="text-emerald-700/70 font-medium">Ask me about crop diseases, fertilizers, or local market prices. I'm here to help you grow!</p>
            </div>
          )}

          {chatMessages.map((msg, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-lg ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? '👤' : '🌾'}
              </div>
              <div className={`relative max-w-[80%] group ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`px-6 py-4 rounded-[2rem] shadow-xl shadow-emerald-900/5 inline-block border ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-emerald-700 text-white border-blue-400/20 rounded-tr-none' 
                    : 'bg-white text-slate-800 border-emerald-50 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">{msg.content}</p>
                  
                  {msg.role === 'assistant' && (
                    <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold hover:bg-emerald-100 transition-colors"
                      >
                        {isSpeaking ? <StopCircle size={14} /> : <Volume2 size={14} />}
                        {isSpeaking ? 'Stop' : 'Listen'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-[10px] mt-2 font-bold uppercase tracking-widest text-slate-400 px-2">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-100 shadow-inner">
                <div className="animate-spin h-5 w-5 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
              </div>
              <div className="px-6 py-4 rounded-[2rem] bg-white border border-emerald-50 text-emerald-600 font-bold italic shadow-lg">
                Seeding knowledge...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Area */}
        <div className="p-6 lg:p-10 pt-0">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] opacity-20 blur-lg group-focus-within:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white/90 backdrop-blur-2xl border border-emerald-100 rounded-[2.5rem] shadow-2xl overflow-hidden flex items-end p-2 pr-4 transition-all focus-within:ring-2 focus-within:ring-emerald-200">
              <button
                onClick={handleVoiceInput}
                disabled={loading}
                className={`p-4 rounded-3xl transition-all ${isListening ? 'bg-red-50 text-red-500 animate-pulse' : 'text-emerald-500 hover:bg-emerald-50'}`}
              >
                <Mic size={24} strokeWidth={2.5} />
              </button>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAskQuestion(); } }}
                placeholder="Ask your farming query..."
                className="flex-1 bg-transparent border-none focus:ring-0 py-4 px-2 text-slate-800 font-medium placeholder:text-emerald-300 resize-none max-h-32"
                rows={1}
              />
              <button
                onClick={handleAskQuestion}
                disabled={!question.trim() || loading}
                className="mb-1.5 p-4 bg-emerald-600 text-white rounded-[1.5rem] shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-30 disabled:translate-y-0 transition-all font-bold"
              >
                <Send size={20} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <p className="text-center mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-900/30">
            Powered by Khetibuddy AI Core v2.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
