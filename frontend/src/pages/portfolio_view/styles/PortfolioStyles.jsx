import React from "react";

export default function PortfolioStyles() {
  return (
    <style>{`
      @keyframes blobFloat {
        0%,100%{ transform:translate(0,0) scale(1); }
        33%{ transform:translate(40px,-40px) scale(1.08); }
        66%{ transform:translate(-30px,25px) scale(.94); }
      }
      @keyframes avatarRing {
        0%,100%{ box-shadow:0 0 0 6px var(--primary-lt),0 0 0 12px rgba(37,99,235,.08); }
        50%{ box-shadow:0 0 0 10px var(--primary-lt),0 0 0 20px rgba(37,99,235,.04); }
      }
      @keyframes badgePulse {
        0%,100%{ opacity:1; transform:scale(1); }
        50%{ opacity:.7; transform:scale(.9); }
      }
      @keyframes slideInLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
      @keyframes slideInRight { from{opacity:0;transform:translateX(30px)}  to{opacity:1;transform:translateX(0)} }
      @keyframes countUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      .pf-hero-left  { animation: slideInLeft  .7s ease both; }
      .pf-hero-right { animation: slideInRight .7s .2s ease both; }
      .pf-stat       { animation: countUp .5s ease both; }
      .pf-stat:nth-child(2){ animation-delay:.1s }
      .pf-stat:nth-child(3){ animation-delay:.2s }
      .skill-card-v2:hover { transform:translateY(-5px)!important; box-shadow: 0 12px 28px -6px rgba(0,0,0,0.12)!important; }
      .proj-card-v2:hover  { transform:translateY(-6px)!important; box-shadow:var(--shadow-lg)!important; }
      .proj-card-v2:hover .proj-top-bar { opacity:1!important; }
      .contact-link-item:hover { transform:translateX(6px)!important; border-color:var(--primary)!important; }
      
      .nav-link-underline { position: relative; display: inline-block; }
      .nav-link-underline::after {
        content: ''; position: absolute; width: 100%; transform: scaleX(0);
        height: 2.5px; bottom: -2px; left: 0; background: var(--primary);
        transform-origin: bottom right; transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        border-radius: 4px;
      }
      .nav-link-underline:hover { color: var(--primary) !important; }
      .nav-link-underline:hover::after { transform: scaleX(1); transform-origin: bottom left; }

      .p-mobile-menu-btn {
        display: none !important;
      }
      @media (max-width: 900px) {
        .p-mobile-menu-btn {
          display: flex !important;
        }
      }

      /* ── Portfolio Layout (Desktop Base & Responsive) ── */
      .pf-hero-container {
        position: relative;
        z-index: 1;
        max-width: 1140px;
        margin: 0 auto;
        padding: 4.5rem 2rem;
        width: 100%;
      }
      .pf-hero-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        gap: 4rem;
        width: 100%;
      }
      .pf-about-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: start;
      }
      .pf-about-mini-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1.5rem;
      }
      .pf-skills-subgrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        gap: 1rem;
      }
      .pf-projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
        gap: 1.5rem;
      }
      .pf-contact-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
      }

      @media (max-width: 900px) {
        .pf-hero-container {
          padding: 2.25rem 1rem 3.5rem 1rem !important;
        }
        .pf-hero-grid {
          grid-template-columns: 1fr !important;
          gap: 2.75rem !important;
          text-align: center !important;
        }
        .pf-about-grid {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
        }
        .pf-contact-grid {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
        }
      }

      .btn-hero-outline:hover { border-color:var(--primary)!important; background:var(--primary-lt)!important; color:var(--primary)!important; }
      .social-btn-v2:hover { border-color:var(--primary)!important; color:var(--primary)!important; transform:translateY(-3px)!important; }
      .highlight-card-v2:hover { border-color:var(--primary)!important; transform:translateY(-3px)!important; }

      /* ── Traveling Edge Progress Bar & Shimmer Motion ── */
      @keyframes edgeBeamSpin {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes progressShimmer {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(250%); }
      }

      .edge-beam-card {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      .card-border-beam {
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1.5px;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: exclude;
        pointer-events: none;
        z-index: 3;
        overflow: hidden;
        opacity: 0.85;
        transition: opacity 0.3s ease;
      }

      .card-border-beam::before {
        content: '';
        position: absolute;
        top: -150%;
        left: -150%;
        width: 400%;
        height: 400%;
        background: conic-gradient(
          from 0deg,
          transparent 0deg,
          transparent 270deg,
          var(--beam-color, var(--primary)) 330deg,
          #ffffff 355deg,
          var(--beam-color, var(--primary)) 360deg
        );
        animation: edgeBeamSpin 4.5s linear infinite;
        pointer-events: none;
      }

      .edge-beam-card:hover .card-border-beam {
        opacity: 1;
      }

      .edge-beam-card:hover .card-border-beam::before {
        animation-duration: 2.2s;
      }

      .progress-shimmer-highlight {
        position: absolute;
        inset: 0;
        width: 60%;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.75) 50%,
          transparent 100%
        );
        animation: progressShimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        pointer-events: none;
      }

      .skill-card-v2:hover .skill-icon-badge {
        transform: scale(1.1) rotate(4deg);
      }

      /* ── Hero Centerpiece Animations ── */
      @keyframes sbCardFloat {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-10px) rotate(1.2deg);
        }
      }

      @keyframes auraGlow {
        0%, 100% {
          opacity: 0.35;
          transform: scale(1);
          filter: blur(35px);
        }
        50% {
          opacity: 0.68;
          transform: scale(1.12);
          filter: blur(48px);
        }
      }

      @keyframes radarPulse {
        0% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.75);
        }
        70% {
          transform: scale(1);
          box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
        }
        100% {
          transform: scale(0.95);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
        }
      }

      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }

      @keyframes badgeFloat1 {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-7px); }
      }

      @keyframes badgeFloat2 {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(7px); }
      }

      .hero-grid-pattern {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(var(--border) 1.2px, transparent 1.2px);
        background-size: 32px 32px;
        mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 85%);
        -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 85%);
        pointer-events: none;
        opacity: 0.65;
      }

      .hero-tech-pill {
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-tech-pill:hover {
        transform: translateY(-3px) scale(1.05);
        border-color: var(--primary) !important;
        color: var(--primary) !important;
        box-shadow: 0 8px 18px -4px rgba(37,99,235,0.22);
      }

      .hero-stats-wrap {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 1rem !important;
        flex-wrap: wrap !important;
      }
      .hero-stat-card {
        flex: 0 0 auto !important;
        min-width: 125px !important;
        width: auto !important;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .hero-stat-card:hover {
        transform: translateY(-4px);
        border-color: var(--primary) !important;
        box-shadow: 0 10px 24px -6px rgba(37,99,235,0.25);
      }

      /* ── Footer ── */
      .pf-footer-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1.5rem;
      }
      .pf-footer-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        text-decoration: none;
        color: inherit;
        margin-left: 0 !important;
        padding: 0 !important;
      }
      .pf-footer-links {
        display: flex;
        align-items: center;
        gap: 1.75rem;
        flex-wrap: wrap;
      }
      .pf-footer-link {
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: .84rem;
        color: var(--text-muted);
        font-weight: 600;
        transition: color .15s;
        padding: 0;
      }
      .pf-footer-link:hover {
        color: var(--primary);
      }
      .pf-footer-social {
        display: flex;
        align-items: center;
        gap: .625rem;
      }
      .pf-footer-social-btn {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1.5px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        text-decoration: none;
        transition: all .15s;
        background: var(--surface);
      }
      .pf-footer-social-btn:hover {
        border-color: var(--primary);
        color: var(--primary);
        transform: translateY(-2px);
      }
      .pf-footer-bottom {
        border-top: 1px solid var(--border);
        margin-top: 1.75rem;
        padding-top: 1.25rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: .75rem;
        font-size: .75rem;
        color: var(--text-muted);
      }

      @media (max-width: 900px) {
        .hero-stats-wrap {
          justify-content: center !important;
        }
      }

      @media (max-width: 768px) {
        .pf-footer-top {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 1.25rem !important;
        }
        .pf-footer-brand {
          width: 100% !important;
        }
        .pf-footer-links {
          gap: 1.25rem !important;
          width: 100% !important;
        }
        .pf-footer-social {
          width: 100% !important;
        }
        .pf-footer-bottom {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: .5rem !important;
        }
      }

      @media (max-width: 480px) {
        .hero-stats-wrap {
          gap: .45rem !important;
          width: 100% !important;
          justify-content: space-between !important;
          flex-wrap: nowrap !important;
        }
        .hero-stat-card {
          min-width: 0 !important;
          flex: 1 1 calc(33.333% - .35rem) !important;
          padding: .65rem .4rem !important;
          text-align: center !important;
        }
        .pf-footer-links {
          gap: 1rem !important;
        }
        .pf-footer-link {
          font-size: .8rem !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .card-border-beam::before,
        .progress-shimmer-highlight,
        .pf-hero-right > div {
          animation: none !important;
        }
      }
    `}</style>
  );
}
