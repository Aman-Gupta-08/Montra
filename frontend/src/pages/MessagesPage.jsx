import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Paperclip, MoreVertical, Phone, Mail, 
  CheckCheck, ArrowLeft, ShieldCheck, Sparkles,
  DollarSign, Clock, Calendar
} from 'lucide-react';
import { ClientMessagesSidebar } from '../components/ui/message-design-card-list';
import { initialMessages } from '../demos/default';
import { AnimatedButton } from '../components/common/Button';

// Mock conversation histories for the demo clients
const CONVERSATION_HISTORY = {
  '1': [
    { sender: 'peter', text: 'Hello Aman, hope you are doing well.', time: '10:15 AM', isMe: false },
    { sender: 'me', text: 'Hi Peter! Doing great, thanks. I submitted the financial audit review.', time: '10:20 AM', isMe: true },
    { sender: 'peter', text: 'I got your first assignment. It was quite good. You can start work on next assignment.', time: '10:30 AM', isMe: false },
  ],
  '2': [
    { sender: 'david', text: 'Good morning Aman! Are we still on track for the payroll disbursement schedule?', time: '09:00 AM', isMe: false },
    { sender: 'me', text: 'Yes David, the calculation sheet is ready for review.', time: '09:12 AM', isMe: true },
    { sender: 'david', text: 'Hey tell me about progress of project? Waiting for your response', time: '09:45 AM', isMe: false },
  ],
  '3': [
    { sender: 'sophia', text: 'Hi! Quick question regarding the budget forecasting module.', time: 'Yesterday', isMe: false },
    { sender: 'sophia', text: 'When you start redesign of app? Previous project was perfect!', time: 'Yesterday', isMe: false },
  ],
  '4': [
    { sender: 'andrea', text: 'Hey tell me about progress of project? Waiting for your response', time: '18 July', isMe: false },
  ],
  '5': [
    { sender: 'john', text: 'I want some changes in previous work you sent me. Waiting for your reply...', time: '17 July', isMe: false },
  ],
  '6': [
    { sender: 'martin', text: 'I am really impressed from your work :-). Keep doing great work.', time: '10 July', isMe: false },
  ],
};

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [replyText, setReplyText] = useState('');
  const [conversations, setConversations] = useState(CONVERSATION_HISTORY);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Active message
  const activeMessage = messages.find((m) => m.isActive) || messages[0];

  const handleMessageClick = (clickedId) => {
    setMessages((prev) =>
      prev.map((msg) => ({
        ...msg,
        isActive: msg.id === clickedId,
      }))
    );
    setMobileShowChat(true);
  };

  const handleFavoriteToggle = (toggledId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === toggledId ? { ...msg, isFavorite: !msg.isFavorite } : msg
      )
    );
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!replyText.trim() || !activeMessage) return;

    const newReply = {
      sender: 'me',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setConversations((prev) => ({
      ...prev,
      [activeMessage.id]: [...(prev[activeMessage.id] || []), newReply],
    }));

    // Update snippet in message list
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === activeMessage.id
          ? { ...msg, text: `You: ${replyText.trim()}`, date: 'Just now' }
          : msg
      )
    );

    setReplyText('');
  };

  const currentThread = conversations[activeMessage?.id] || [];

  return (
    <div className="flex flex-col gap-3 sm:gap-5 max-w-7xl mx-auto w-full h-[calc(100dvh-12rem)] md:h-[calc(100vh-6.5rem)] min-h-[460px]">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Client Messages
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
              {messages.length} Active Threads
            </span>
          </h1>
          <p className="text-xs text-secondary-text mt-0.5">
            Collaborate, review client feedback, and track project assignments in real time.
          </p>
        </div>
      </div>

      {/* Main Glass Workspace */}
      <div className="flex-1 flex gap-5 min-h-0 overflow-hidden">
        {/* Left: Client Messages Sidebar */}
        <div
          className={`w-full md:w-96 flex-shrink-0 h-full flex flex-col ${
            mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          <ClientMessagesSidebar
            messages={messages}
            onMessageClick={handleMessageClick}
            onFavoriteToggle={handleFavoriteToggle}
            title="client messages"
            className="h-full"
          />
        </div>

        {/* Right: Active Conversation Detail */}
        <div
          className={`flex-1 flex flex-col glass-card glossy-panel rounded-3xl overflow-hidden shadow-xl border border-white/60 dark:border-white/10 ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeMessage ? (
            <>
              {/* Conversation Header */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between gap-3 glass-2 z-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <div className="relative">
                    <img
                      src={activeMessage.avatar}
                      alt={activeMessage.name}
                      className="w-11 h-11 rounded-2xl object-cover border-2 border-white dark:border-white/20 shadow-sm"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold capitalize text-gray-900 dark:text-white flex items-center gap-2">
                      {activeMessage.name}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Verified Client
                      </span>
                    </h2>
                    <p className="text-xs text-secondary-text flex items-center gap-1.5 mt-0.5">
                      <Clock size={12} className="text-violet-500" />
                      Active on Montra Platform
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    className="p-2 rounded-xl glass-1 hover:border-violet-300 text-gray-600 dark:text-gray-300 transition-colors"
                    title="Audio call"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl glass-1 hover:border-violet-300 text-gray-600 dark:text-gray-300 transition-colors"
                    title="Send Email"
                  >
                    <Mail size={16} />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-xl glass-1 hover:border-violet-300 text-gray-600 dark:text-gray-300 transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
                {/* Financial Context Banner */}
                <div className="p-3.5 rounded-2xl glass-1 border border-violet-500/20 flex items-center justify-between gap-3 text-xs mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Active Client Contract #MTR-2026</p>
                      <p className="text-[11px] text-secondary-text">Escrow Protected • Monthly Invoicing Enabled</p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full text-[11px] border border-emerald-500/20">
                    Payment Secured
                  </span>
                </div>

                {/* Messages list */}
                {currentThread.map((chat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col max-w-[75%] ${
                      chat.isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                        chat.isMe
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs shadow-violet-500/20'
                          : 'glass-2 text-gray-900 dark:text-white rounded-bl-xs border border-white/60 dark:border-white/10'
                      }`}
                    >
                      <p>{chat.text}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 px-1 flex items-center gap-1">
                      {chat.time}
                      {chat.isMe && <CheckCheck size={12} className="text-violet-400" />}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Reply Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 border-t border-gray-100 dark:border-white/10 glass-2 flex items-center gap-2"
              >
                <button
                  type="button"
                  className="p-2.5 rounded-xl glass-1 text-gray-500 hover:text-violet-600 dark:text-gray-400 dark:hover:text-violet-400 transition-colors"
                  title="Attach financial slip or document"
                >
                  <Paperclip size={18} />
                </button>

                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${activeMessage.name}...`}
                  className="flex-1 px-4 py-2.5 text-xs rounded-2xl glass-input text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <span>Send</span>
                  <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Sparkles className="size-10 text-violet-400 mb-3 opacity-60" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Select a conversation</h3>
              <p className="text-xs text-secondary-text mt-1 max-w-sm">
                Choose a client message from the sidebar to inspect the thread and reply.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
