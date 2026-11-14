import React from 'react';

export default function ChatStyles() {
  return (
    <style>{`
      @keyframes chatDot {
        0%,60%,100% { transform: translateY(0); opacity:.4; }
        30% { transform: translateY(-5px); opacity:1; }
      }
      @keyframes chatCursor {
        0%,100% { opacity:1; } 50% { opacity:0; }
      }
      @keyframes chatSlideUp {
        from { opacity:0; transform:translateY(24px) scale(.97); }
        to   { opacity:1; transform:translateY(0) scale(1); }
      }
      @keyframes chatPulse {
        0%,100%{ box-shadow: 0 0 0 0 rgba(59,130,246,.5); }
        50%    { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
      }
      .chat-panel { animation: chatSlideUp .22s ease both; }
      .chat-fab { animation: chatPulse 2.5s ease infinite; }
      .chat-send:hover { opacity:.88 !important; transform: scale(1.05); }
      .chat-msg-input:focus { outline:none; border-color: var(--primary) !important; box-shadow: 0 0 0 3px var(--primary-lt); }
      .sugg-chip:hover { background: var(--primary-lt) !important; color: var(--primary) !important; border-color: var(--primary) !important; }
    `}</style>
  );
}
