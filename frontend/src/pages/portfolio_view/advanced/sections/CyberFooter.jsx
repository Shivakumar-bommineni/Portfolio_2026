import React from "react";

export default function CyberFooter({ onSwitchToNormal }) {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 46, 91, 0.2)",
        backgroundColor: "#06060a",
        padding: "40px clamp(24px, 5.5vw, 64px) 60px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#ff2e5b" }}>//</span> SHIVAKUMAR BOMMINENI
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
            Designed & Engineered with React, Next.js & Node.js © 2026
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Switch to normal mode */}
          <button
            onClick={onSwitchToNormal}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#cbd5e1",
              fontSize: "0.75rem",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            ✦ Switch to Classic View
          </button>

          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              background: "rgba(255, 46, 91, 0.1)",
              border: "1px solid rgba(255, 46, 91, 0.3)",
              color: "#ff2e5b",
              fontSize: "0.8rem",
              padding: "6px 12px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            ▲ TOP
          </button>
        </div>
      </div>
    </footer>
  );
}
