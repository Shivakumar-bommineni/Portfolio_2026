import React from "react";

export default function CyberStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

      :root {
        --cyber-bg: #06060a;
        --cyber-card: rgba(14, 13, 22, 0.82);
        --cyber-card-border: rgba(255, 46, 91, 0.25);
        --cyber-red: #ff2e5b;
        --cyber-red-bright: #ff4772;
        --cyber-red-glow: rgba(255, 46, 91, 0.5);
        --cyber-text: #f8fafc;
        --cyber-muted: #94a3b8;
        --cyber-mono: 'JetBrains Mono', monospace;
        --cyber-sans: 'Plus Jakarta Sans', -apple-system, sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        max-width: 100vw;
        overflow-x: hidden;
      }

      .cyber-root,
      [data-theme="light"] .cyber-root,
      [data-theme="dark"] .cyber-root {
        font-family: var(--cyber-sans);
        background-color: #06060a !important;
        color: #f8fafc !important;
        min-height: 100vh;
        position: relative;
        max-width: 100vw;
        overflow-x: hidden;
        -webkit-tap-highlight-color: transparent;
      }

      .cyber-root ::selection {
        background: #ff2e5b;
        color: #ffffff;
      }

      /* Glowing Text & Boxes */
      .glow-text-red {
        text-shadow: 0 0 20px rgba(255, 46, 91, 0.7), 0 0 40px rgba(255, 46, 91, 0.35);
      }

      .glow-box-red {
        box-shadow: 0 0 25px rgba(255, 46, 91, 0.3), inset 0 0 15px rgba(255, 46, 91, 0.1);
      }

      /* Cyber Corner Ticks */
      .cyber-corner-box {
        position: relative;
      }
      .cyber-corner-box::before,
      .cyber-corner-box::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 10px;
        border-color: var(--cyber-red);
        pointer-events: none;
        z-index: 2;
        transition: all 0.3s ease;
      }
      .cyber-corner-box::before {
        top: -1px;
        left: -1px;
        border-top: 2px solid var(--cyber-red);
        border-left: 2px solid var(--cyber-red);
      }
      .cyber-corner-box::after {
        bottom: -1px;
        right: -1px;
        border-bottom: 2px solid var(--cyber-red);
        border-right: 2px solid var(--cyber-red);
      }
      .cyber-corner-box:hover::before {
        width: 16px;
        height: 16px;
        box-shadow: -2px -2px 10px #ff2e5b;
      }
      .cyber-corner-box:hover::after {
        width: 16px;
        height: 16px;
        box-shadow: 2px 2px 10px #ff2e5b;
      }

      /* Glassmorphism */
      .cyber-glass {
        background: rgba(14, 13, 22, 0.75);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .cyber-glass-red {
        background: rgba(16, 12, 22, 0.82);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 46, 91, 0.28);
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .cyber-glass-red:hover {
        border-color: rgba(255, 46, 91, 0.7);
        box-shadow: 0 16px 36px rgba(255, 46, 91, 0.25), inset 0 0 20px rgba(255, 46, 91, 0.1);
      }

      /* Cyber Primary Button */
      .cyber-btn-primary {
        background: linear-gradient(135deg, #ff2e5b 0%, #c4133b 100%);
        color: #ffffff;
        font-weight: 800;
        letter-spacing: 1px;
        box-shadow: 0 0 24px rgba(255, 46, 91, 0.55);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }

      .cyber-btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: 0.6s ease;
      }

      .cyber-btn-primary:hover {
        transform: translateY(-2px) scale(1.02);
        box-shadow: 0 0 35px rgba(255, 46, 91, 0.85);
      }

      .cyber-btn-primary:hover::before {
        left: 100%;
      }

      .cyber-btn-outline {
        background: rgba(18, 16, 26, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #ffffff;
        transition: all 0.25s ease;
      }
      .cyber-btn-outline:hover {
        border-color: var(--cyber-red);
        color: var(--cyber-red);
        box-shadow: 0 0 20px rgba(255, 46, 91, 0.35);
        transform: translateY(-2px);
      }

      /* Grid Background with Horizon Radial Flare */
      .cyber-grid-bg {
        background-image: 
          radial-gradient(circle at 50% 20%, rgba(255, 46, 91, 0.18) 0%, transparent 65%),
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
        background-size: 100% 100%, 48px 48px, 48px 48px;
      }

      /* Custom Cyber Scrollbar */
      .cyber-root::-webkit-scrollbar {
        width: 6px;
      }
      .cyber-root::-webkit-scrollbar-track {
        background: #060609;
      }
      .cyber-root::-webkit-scrollbar-thumb {
        background: #28101a;
        border: 1px solid rgba(255, 46, 91, 0.4);
        border-radius: 4px;
      }
      .cyber-root::-webkit-scrollbar-thumb:hover {
        background: #ff2e5b;
      }

      /* Mobile Responsive Tweaks & Performance Guards */
      @media (max-width: 768px) {
        .cyber-btn-primary, .cyber-btn-outline {
          padding: 12px 20px !important;
          font-size: 0.85rem !important;
        }

        .cyber-3d-card:hover {
          transform: none !important;
        }

        input, textarea, select {
          font-size: 16px !important; /* Prevents iOS auto-zoom */
        }
      }

      @media (max-width: 480px) {
        .cyber-corner-box::before, .cyber-corner-box::after {
          width: 6px;
          height: 6px;
        }
      }
    `}</style>
  );
}
