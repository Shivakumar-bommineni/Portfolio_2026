import React from "react";
import { GithubIcon, LinkedInIcon } from "../components/Icons";

export default function Footer({ hero, contact, scrollTo }) {
  return (
    <footer
      className="pf-footer"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        padding: "2.5rem 0",
      }}
    >
      <div className="pf-footer-container" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
        <div className="pf-footer-top">
          <a
            href="#hero"
            className="p-nav-brand pf-footer-brand"
          >
            <div
              className="sb-mark"
              style={{
                width: 42,
                height: 42,
                fontSize: ".9rem",
                borderRadius: 12,
                flexShrink: 0,
              }}
            >
              <span className="sb-mark-text">{hero.avatarText || "SB"}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".55rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: "1.06rem",
                    letterSpacing: "-0.3px",
                    color: "var(--text)",
                  }}
                >
                  ShivaKumar<span className="p-brand-accent">_B</span>
                </span>
                <span className="p-brand-badge" style={{ fontSize: ".68rem", padding: "2px 8px" }}>
                  <span className="p-brand-pulse" />
                  Full Stack Dev
                </span>
              </div>
              <div
                style={{
                  fontSize: ".76rem",
                  color: "var(--text-muted)",
                  marginTop: ".25rem",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {hero.name} · Full Stack Developer · {new Date().getFullYear()}
              </div>
            </div>
          </a>
          <div className="pf-footer-links">
            {[
              ["About", "about"],
              ["Skills", "skills"],
              ["Projects", "projects"],
              ["Contact", "contact"],
            ].map(([l, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="pf-footer-link"
              >
                {l}
              </button>
            ))}
          </div>
          <div className="pf-footer-social">
            {[contact.github, contact.linkedin].map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="pf-footer-social-btn"
                aria-label={i === 0 ? "GitHub" : "LinkedIn"}
              >
                {i === 0 ? <GithubIcon /> : <LinkedInIcon />}
              </a>
            ))}
          </div>
        </div>
        <div className="pf-footer-bottom">
          <span>
            © {new Date().getFullYear()} {hero.name}. All rights reserved.
          </span>
          <span>
            Built with React.js + Node.js · Powered by Ollama AI
          </span>
        </div>
      </div>
    </footer>
  );
}
