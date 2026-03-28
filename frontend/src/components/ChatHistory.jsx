import React, { useState, useEffect } from 'react';
import { Clock, Trash2, MessageSquare, X, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function ChatHistory({ currentSessionId, onLoadSession, onNewChat, isOpen, onToggle }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

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
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

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

  return (
    <>
      {/* Toggle Button - Moves with sidebar */}
      <button
        onClick={onToggle}
        className={`fixed top-32 z-50 bg-emerald-600 text-white p-3 rounded-r-xl shadow-lg hover:bg-emerald-700 transition-all duration-300 ${
          isOpen ? 'left-80' : 'left-0'
        }`}
        title={isOpen ? "Close History" : "Open History"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] w-80 bg-white shadow-2xl transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare size={24} />
                Chat History
              </h2>
              <button
                onClick={fetchSessions}
                disabled={loading}
                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh history"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            
            {/* New Chat Button */}
            <button
              onClick={() => {
                onNewChat();
                onToggle();
              }}
              className="w-full mt-2 bg-white text-emerald-600 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
            >
              + New Chat
            </button>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
                <p>No chat history yet</p>
                <p className="text-sm">Start chatting to see history</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.sessionId}
                  onClick={() => onLoadSession(session.sessionId)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                    session.sessionId === currentSessionId
                      ? 'bg-emerald-100 border-2 border-emerald-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {session.preview}
                        {session.preview.length >= 60 && '...'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{formatDate(session.lastMessageDate)}</span>
                        <span>•</span>
                        <span>{session.messageCount} msg{session.messageCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteSession(session.sessionId, e)}
                      disabled={deleting === session.sessionId}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
                      title="Delete chat"
                    >
                      {deleting === session.sessionId ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Showing {sessions.length} recent conversation{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Overlay - Click to close */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black bg-opacity-30 z-30 transition-opacity"
        ></div>
      )}
    </>
  );
}

export default ChatHistory;
