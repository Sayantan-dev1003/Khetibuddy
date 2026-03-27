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
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = React.useRef(null);

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
    // Use browser default language; user speaks in whatever language they want
    recognition.lang = navigator.language || 'en-IN';
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
      alert('No voice available for this language on your device. Try using Chrome or install the language pack.');
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
        title="Smart Chatbot"
        subtitle="Ask any farming question in any language — auto-detected & answered accordingly"
        className="mb-6"
      />
{/* AI AVATAR - Show when there are messages */}
          <div className="flex justify-center mt-4">
            <div
              className={`w-44 h-44 rounded-full overflow-hidden border-4 ${
                isSpeaking ? 'border-emerald-500 ring-4 ring-emerald-300 animate-pulse' : 'border-emerald-400'
              } shadow-2xl transition-all duration-300`}
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
 {/* Chat Messages Display */}
<div className="mb-6">
  {chatMessages.length > 0 ? (
    <div
      className="space-y-6 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-inner scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-200 scroll-smooth"
      style={{ maxHeight: 'calc(100vh - 32rem)', minHeight: '400px' }}
    >
      {chatMessages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
        >
          {msg.role === 'assistant' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
              <span className="text-2xl">🤖</span>
            </div>
          )}
          <div
            className={`relative max-w-[75%] px-6 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
              msg.role === 'user'
                ? 'bg-emerald-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
            }`}
          >
            {/* Message Header */}
            <div className="flex justify-between items-center mb-2 ">
              <span className="text-sm font-semibold">
                {msg.role === 'user' ? 'You' : 'AI'}
              </span>
         
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            {msg.role === 'assistant' && (
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                aria-label={isSpeaking ? 'Stop reading aloud' : 'Read message aloud'}
              >
                <Volume2 size={16} className="transition-transform duration-200 hover:scale-110" />
                {isSpeaking ? 'Stop' : 'Read Aloud'}
              </button>
            )}
            {/* Bubble Tail */}
            <div
              className={`absolute bottom-0 w-0 h-0 border-8 border-transparent ${
                msg.role === 'user'
                  ? 'right-[-8px] border-l-emerald-600'
                  : 'left-[-8px] border-r-white'
              }`}
            ></div>
          </div>
          {msg.role === 'user' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
              <span className="text-2xl">👤</span>
            </div>
          )}
        </div>
      ))}
      {loading && (
        <div className="flex justify-start items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
            <span className="text-2xl">🤖</span>
          </div>
          <div className="relative max-w-[75%] px-6 py-4 rounded-2xl bg-white rounded-bl-none shadow-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
              <span className="text-gray-600">Thinking...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  ) : null}
</div>

      {/* Question Input - Fixed at Bottom */}
      <Card className="mb-6 lg:mb-4" padding="md">
        <div className="flex items-center justify-between mb-4">
          <label className="block text-gray-700 text-base font-semibold">
            Your Question
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-medium">🌐 Any language</span>
            {sessionId && (
              <span className="text-xs text-gray-400">
                {sessionId.substring(0, 8)}...
              </span>
            )}
          </div>
        </div>

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your farming question in any language... (Press Enter to send, Shift+Enter for new line)"
          rows={3}
          className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <PrimaryButton
            onClick={handleVoiceInput}
            variant="outline"
            size="lg"
            icon={<Mic className={isListening ? 'animate-pulse text-red-500' : ''} />}
            disabled={isListening}
            className="flex-1"
          >
            {isListening ? 'Listening...' : 'Voice Input'}
          </PrimaryButton>

          <PrimaryButton
            onClick={handleAskQuestion}
            variant="primary"
            size="lg"
            icon={<Send />}
            loading={loading}
            className="flex-1 sm:flex-[2]"
          >
            Ask Question
          </PrimaryButton>
        </div>
      </Card>

      {/* Extra padding for mobile bottom navigation */}
      <div className="h-4 lg:hidden"></div>
    </div>
  );
}

export default Chatbot;
