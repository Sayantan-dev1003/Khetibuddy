import React, { useState, useEffect } from 'react';
import { Clock, Trash2, MessageSquare, X, RefreshCw, PlusCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ChatHistory({ currentSessionId, onLoadSession, onNewChat, isOpen, onToggle }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch chat sessions
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions`, { credentials: 'include' });
      const data = await res.json();
      
      if (data.success) {
        setSessions(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a session
  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    setDeleting(sessionId);
    try {
      const res = await fetch(`${API_BASE}/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSessions(sessions.filter(s => s.sessionId !== sessionId));
        
        // If deleted session is current, create new session
        if (sessionId === currentSessionId) {
          onNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete chat');
    } finally {
      setDeleting(null);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const filteredSessions = sessions.filter(s => 
    s.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-emerald-950/20 backdrop-blur-sm z-[110] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-[120] w-[320px] bg-white border-r border-emerald-100/50 shadow-2xl transition-all duration-500 transform lg:static lg:z-0 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full bg-[#fdfdfd] pt-24 lg:pt-28">
          {/* Header */}
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <MessageSquare size={22} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-950 leading-none">History</h2>
                  <span className="text-xs text-emerald-600 font-medium">{sessions.length} conversations</span>
                </div>
              </div>
              <button
                onClick={fetchSessions}
                disabled={loading}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            
            <button
              onClick={() => {
                onNewChat();
                if (window.innerWidth < 1024) onToggle();
              }}
              className="w-full group flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3.5 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              New Chat
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={16} />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-emerald-300"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar space-y-2">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-sm text-emerald-600 font-medium">Loading history...</p>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-emerald-200" />
                </div>
                <h3 className="text-emerald-900 font-bold mb-1">No chats found</h3>
                <p className="text-xs text-emerald-600/70">Start a new conversation to get growing!</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={session.sessionId}
                  onClick={() => {
                    onLoadSession(session.sessionId);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`group relative p-4 rounded-2xl cursor-pointer transition-all border ${
                    session.sessionId === currentSessionId
                      ? 'bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100'
                      : 'bg-transparent border-transparent hover:bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold line-clamp-1 mb-1 ${
                        session.sessionId === currentSessionId ? 'text-emerald-900' : 'text-slate-700'
                      }`}>
                        {session.preview || "Untitled Chat"}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        <Clock size={10} strokeWidth={2.5} />
                        <span>{formatDate(session.lastMessageDate)}</span>
                        <span>•</span>
                        <span>{session.messageCount} messages</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteSession(session.sessionId, e)}
                      disabled={deleting === session.sessionId}
                      className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-500 disabled:opacity-50"
                      title="Delete chat"
                    >
                      {deleting === session.sessionId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer Card */}
          <div className="p-6 border-t border-emerald-100/50 bg-white/50">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-1">KhetiBuddy Tip</p>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-medium">
                Keep your history organized to track crop performance over seasons.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default ChatHistory;
