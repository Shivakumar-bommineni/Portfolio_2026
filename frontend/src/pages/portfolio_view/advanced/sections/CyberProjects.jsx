import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberProjects({ projects }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);

  const filterCategories = ["ALL", "FULL-STACK", "ENTERPRISE", "REALTIME"];

  const allProjects = [
    ...(projects || []),
    {
      num: "04",
      title: "Schneider Electric Enterprise LMS",
      desc: "Architected enterprise learning platform with React, Node.js, and PostgreSQL for Admin, Trainer, and Learner tiers with dynamic reporting and role-based data isolation.",
      tags: ["React.js", "Node.js", "PostgreSQL", "RBAC", "Enterprise LMS"],
      category: "ENTERPRISE",
      github: "https://github.com/shivakumar-bommineni",
      live: "#",
    },
    {
      num: "05",
      title: "Internal ATS & Resume Screening Platform",
      desc: "Full-cycle recruitment ATS with candidate validation, interview scheduling, inline DOCX/PDF resume preview, and HR privilege management.",
      tags: ["React.js", "Express.js", "REST APIs", "ATS", "PDF Parser"],
      category: "ENTERPRISE",
      github: "https://github.com/shivakumar-bommineni",
      live: "#",
    },
  ];

  const filtered = activeFilter === "ALL"
    ? allProjects
    : allProjects.filter((p) => p.category === activeFilter || p.tags?.some((t) => t.toUpperCase().includes(activeFilter)));

  const nextDeck = () => {
    setActiveDeckIndex((prev) => (prev + 1) % allProjects.length);
  };

  const prevDeck = () => {
    setActiveDeckIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length);
  };

  const currentDeckProject = allProjects[activeDeckIndex];

  return (
    <section
      id="cyber-projects"
      style={{
        padding: "clamp(50px, 7vw, 90px) clamp(24px, 5.5vw, 64px)",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 50px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
            letterSpacing: "3px",
            color: "#ff2e5b",
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          // FEATURED WORK
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          PROJECTS<span style={{ color: "#ff2e5b" }}>.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            color: "#94a3b8",
            fontSize: "clamp(0.88rem, 2vw, 0.98rem)",
            maxWidth: "540px",
            margin: "10px auto 0",
            lineHeight: 1.6,
          }}
        >
          Interactive 3D showcase of production web applications, hospital systems, and enterprise platforms.
        </motion.p>
      </div>

      {/* 3D Perspective Card Showcase */}
      <div
        style={{
          perspective: "1200px",
          maxWidth: "840px",
          margin: "0 auto clamp(40px, 6vw, 60px)",
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDeckIndex}
            initial={{ opacity: 0, scale: 0.9, rotateX: 10, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, rotateX: -8, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="cyber-glass-red cyber-corner-box"
            style={{
              borderRadius: "18px",
              padding: "clamp(20px, 4.5vw, 36px)",
              border: "1px solid rgba(255, 46, 91, 0.45)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 46, 91, 0.3)",
              background: "rgba(16, 12, 22, 0.92)",
              backdropFilter: "blur(24px)",
            }}
          >
            {/* Top Deck Card HUD Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                    fontWeight: 900,
                    color: "#ff2e5b",
                    lineHeight: 1,
                  }}
                >
                  {currentDeckProject.num || `0${activeDeckIndex + 1}`}
                </span>
                <span
                  style={{
                    fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#94a3b8",
                  }}
                >
                  / 0{allProjects.length} [SPOTLIGHT]
                </span>
              </div>

              {/* Deck Navigation Buttons */}
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={prevDeck}
                  title="Previous Project"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 46, 91, 0.3)",
                    color: "#ffffff",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ←
                </button>
                <button
                  onClick={nextDeck}
                  title="Next Project"
                  style={{
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 46, 91, 0.3)",
                    color: "#ffffff",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  →
                </button>
              </div>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.85rem)",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "12px",
                lineHeight: 1.25,
              }}
            >
              {currentDeckProject.title}
            </h3>

            {/* Description */}
            <p
              style={{
                fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)",
                color: "#cbd5e1",
                lineHeight: 1.65,
                marginBottom: "20px",
              }}
            >
              {currentDeckProject.desc}
            </p>

            {/* Interactive Animated SVG Circuit/Waveform */}
            <div
              style={{
                height: "auto",
                minHeight: "50px",
                background: "rgba(10, 8, 16, 0.8)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 46, 91, 0.25)",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#ff2e5b",
                    boxShadow: "0 0 8px #ff2e5b",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    color: "#ff4d76",
                    fontWeight: 700,
                  }}
                >
                  PRODUCTION DEPLOYMENT
                </span>
              </div>

              {/* Pulsing Animated Waveform SVG */}
              <div style={{ width: "clamp(100px, 30vw, 180px)", height: "24px" }}>
                <svg width="100%" height="100%" viewBox="0 0 200 32" preserveAspectRatio="none">
                  <path
                    d="M0 16 H40 L50 4 L60 28 L70 8 L80 24 L90 16 H200"
                    stroke="#ff2e5b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Tech Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                marginBottom: "24px",
              }}
            >
              {currentDeckProject.tags?.map((t) => (
                <span
                  key={t}
                  style={{
                    background: "rgba(255, 46, 91, 0.12)",
                    border: "1px solid rgba(255, 46, 91, 0.3)",
                    color: "#fca5a5",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Bottom Action Buttons */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <a
                href={currentDeckProject.github && currentDeckProject.github !== "#" ? currentDeckProject.github : "https://github.com/shivakumar-bommineni"}
                target="_blank"
                rel="noreferrer"
                className="cyber-btn-outline"
                style={{
                  flex: "1 1 180px",
                  textAlign: "center",
                  padding: "11px 16px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                VIEW SOURCE CODE ↗
              </a>

              <a
                href={currentDeckProject.live && currentDeckProject.live !== "#" ? currentDeckProject.live : "#"}
                target="_blank"
                rel="noreferrer"
                className="cyber-btn-primary"
                style={{
                  flex: "1 1 180px",
                  textAlign: "center",
                  padding: "11px 16px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  textDecoration: "none",
                  fontWeight: 800,
                }}
              >
                LAUNCH PREVIEW ↗
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Grid of All Projects */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
            color: "#ffffff",
            fontWeight: 700,
          }}
        >
          // ALL SYSTEMS ({allProjects.length})
        </div>

        {/* Filter Badges */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {filterCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                background:
                  activeFilter === cat
                    ? "rgba(255, 46, 91, 0.2)"
                    : "rgba(255, 255, 255, 0.04)",
                border:
                  activeFilter === cat
                    ? "1px solid #ff2e5b"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                color: activeFilter === cat ? "#ff4d76" : "#94a3b8",
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "0.7rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              [ {cat} ]
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 45vw, 360px), 1fr))",
          gap: "clamp(16px, 3vw, 24px)",
        }}
      >
        {filtered.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="cyber-glass-red cyber-corner-box cyber-3d-card"
            style={{
              borderRadius: "14px",
              padding: "clamp(18px, 3vw, 24px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => {
              setActiveDeckIndex(allProjects.indexOf(p));
              const el = document.getElementById("cyber-projects");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    color: "rgba(255, 46, 91, 0.8)",
                  }}
                >
                  {p.num || `0${idx + 1}`}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#10b981",
                  }}
                >
                  ● VERIFIED
                </span>
              </div>

              <h4
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                {p.title}
              </h4>

              <p
                style={{
                  fontSize: "0.82rem",
                  color: "#94a3b8",
                  lineHeight: 1.55,
                  marginBottom: "16px",
                }}
              >
                {p.desc}
              </p>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginBottom: "14px",
                }}
              >
                {p.tags?.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    style={{
                      background: "rgba(255, 46, 91, 0.08)",
                      color: "#fca5a5",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontSize: "0.68rem",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#ff2e5b",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                }}
              >
                CLICK TO FOCUS IN 3D DECK ↑
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
