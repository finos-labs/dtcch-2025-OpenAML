/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, User, Info, X, Menu, Bot, Settings, Gift } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { translations } from './i18n';
import { Language, Message } from './type';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [email, setEmail] = useState('');

  const t = (key: keyof typeof translations['en']) => translations[language][key];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const startNewChat = async () => {
    await fetch(`/api/reset`);
    setMessages([]);
    setInput('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const agentMessageId = (Date.now() + 1).toString();
    const agentMessage: Message = { id: agentMessageId, role: 'agent', content: '', status: t('connecting') };

    setMessages(prev => [...prev, userMessage, agentMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage.content }),
      });
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.replace('data: ', ''));

              setMessages(prev => prev.map(msg => {
                if (msg.id === agentMessageId) {
                  return {
                    ...msg,
                    status: data.status !== undefined ? data.status : msg.status,
                    content: data.token ? msg.content + data.token : msg.content
                  };
                }
                return msg;
              }));
            } catch (e) {
              console.error("Error parsing JSON from stream", e);
            }
          }
        });
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setMessages(prev => prev.map(msg => {
        if (msg.id === agentMessageId) {
          return {
            ...msg,
            status: 'Error',
            content: msg.content || t('error')
          };
        }
        return msg;
      }));
    } finally {
      setIsLoading(false);
      setMessages(prev => prev.map(msg => {
        if (msg.id === agentMessageId) {
          return { ...msg, status: undefined };
        }
        return msg;
      }));
    }
  };

  const handleSubmitWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    setIsWaitlistOpen(false);
    fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    setEmail('');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-950 border-r border-gray-800 flex flex-col overflow-hidden shrink-0`}>
        <div className="p-4">
          <button onClick={startNewChat} className="flex items-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-colors font-medium">
            <Plus size={18} />
            {t('newChat')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Chat history could go here */}
        </div>
        <div className="p-4 border-t border-gray-800 space-y-1">
          <button onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-gray-800/50">
            <Settings size={18} />
            <span className="font-medium">{t('settings')}</span>
          </button>
          <button onClick={() => setIsAboutOpen(true)} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-gray-800/50">
            <Info size={18} />
            <span className="font-medium">{t('about')}</span>
          </button>
          <button onClick={() => setIsWaitlistOpen(true)} className="flex gap-2 text-gray-400 hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-gray-800/50">
            <Gift size={18} />
            <span className="font-medium">{t('waitlist')}</span>
          </button>


        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="font-semibold text-xl tracking-tight text-white">OpenKYT</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 font-medium hidden sm:block">{t('guestUser')}</span>
            <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-300">
              <User size={16} />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6 pb-32">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 mt-32">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-gray-700">
                  <Bot size={32} className="text-gray-300" />
                </div>
                <div className="text-3xl font-bold mb-3 text-gray-200">OpenKYT</div>
                <p className="text-gray-400">{t('welcomeMessage')}</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'agent' && (
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0 mt-1 shadow-sm">
                      <span className="text-xs font-bold text-white">KYT</span>
                    </div>
                  )}
                  <div className={`max-w-[95%] sm:max-w-[75%] line-weight-140 rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-gray-800 text-white shadow-sm text-sm' : 'bg-transparent text-gray-200 text-sm'}`}>
                    {msg.role === 'agent' && msg.status && (
                      <div className="text-xs text-emerald-400 mb-2 font-mono flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        {msg.status}
                      </div>
                    )}

                    <div className="prose prose-invert max-w-none overflow-x-auto
                            prose-table:border-collapse prose-table:w-full prose-table:my-4 
                            prose-table:border prose-table:border-emerald-900/50
                            
                            prose-th:border prose-th:border-emerald-900/50 prose-th:bg-emerald-950/40 
                            prose-th:text-emerald-400 prose-th:font-mono prose-th:text-[10px] 
                            prose-th:uppercase prose-th:tracking-tighter prose-th:p-2
                            
                            prose-td:border prose-td:border-emerald-900/30 prose-td:p-2 
                            prose-td:text-[11px] prose-td:font-mono prose-td:text-gray-300 
                            prose-td:leading-none
                            prose-p:my-1.5 prose-p:leading-normal  
                            prose-headings:my-2 prose-headings:text-gray-100  
                            prose-table:my-2
                            ">
                      <Markdown remarkPlugins={[remarkGfm]}>{msg.content}</Markdown>
                    </div>
                    {msg.role === 'agent' && !msg.content && isLoading && msg.id === messages[messages.length - 1].id && (
                      <div className="flex gap-1.5 mt-2 h-6 items-center">
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent pt-6 pb-4 px-4">
          <div className="max-w-3xl mx-auto relative">
            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-gray-800 rounded-2xl border border-gray-700 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 transition-all p-2 shadow-xl">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={t('placeholder')}
                className="w-full max-h-48 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-gray-100 placeholder-gray-400 outline-none"
                rows={1}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-white text-black rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:bg-gray-700 disabled:text-gray-400 transition-colors mb-1 mr-1 shrink-0 flex items-center justify-center"
              >
                <Send size={18} className={input.trim() && !isLoading ? "text-black" : "text-gray-400"} />
              </button>
            </form>
            <div className="text-center text-xs text-gray-500 mt-3">
              {t('disclaimer')}
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          {/* Aumentado para max-w-2xl e adicionado max-h para telas menores */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            <button onClick={() => setIsAboutOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-xl hover:bg-gray-800 transition-all">
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-6 shrink-0">
              <div className="w-12 h-12 bg-blue-950/40 rounded-2xl flex items-center justify-center border border-blue-900/50">
                <Bot size={28} className="text-sky-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white leading-none">{t('aboutTitle')}</h2>
                <p className="text-sky-500/60 text-xs font-mono mt-1 uppercase tracking-widest">Open source Vibe Investigation</p>
              </div>
            </div>

            <div className="overflow-y-auto pr-2 custom-scrollbar text-gray-300 leading-relaxed">
              <div className="about-content prose prose-sm prose-invert max-w-none prose-p:text-gray-400 prose-strong:text-sky-400 prose-p:my-4">
                <Markdown remarkPlugins={[remarkGfm]}>
                  {t('aboutText')}
                </Markdown>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800 flex justify-between items-center text-[10px] font-mono uppercase tracking-tighter text-gray-500 shrink-0">
              <span>{t('version')}</span>
              <span className="text-blue-900/50">●</span>
              <span>{t('themeEdition')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsSettingsOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                <Settings size={24} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-white">{t('settingsTitle')}</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('languageLabel')}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {isWaitlistOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsWaitlistOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700">
                <Gift size={24} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white">{t('waitlistTitle')}</h3>
            </div>
            <p className="text-gray-400">{t('waitlistText')}</p>

            <div className="space-y-4">
              <div>

                <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 my-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500" />
              </div>
            </div>
            <button type="submit" onClick={handleSubmitWaitlist} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

