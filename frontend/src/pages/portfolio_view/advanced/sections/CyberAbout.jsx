import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberAbout({ about }) {
  const [activeTab, setActiveTab] = useState("Technologies");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 12,
      y: (x / rect.width) * 12,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const tabData = {
    Technologies: {
      title: "Core Engineering Tooling",
      desc: "Deep hands-on expertise building production systems with modern JavaScript/TypeScript, React 18, Next.js, Node.js runtime, Express, PostgreSQL, and Socket.io for bidirectional communication.",
      pills: [
        "React.js",
        "Next.js",
        "Node.js",
        "TypeScript",
        "PostgreSQL",
        "MongoDB",
        "Socket.io",
        "Docker",
        "REST APIs",
      ],
    },
    Architecture: {
      title: "Clean Systems & Security",
      desc: "Specialized in Zero-Trust authentication architecture, Multi-Device Management (MDM) with concurrent session limiting, JWT refresh rotation, rate limiting, and role-based data isolation for enterprise LMS & HRIS applications.",
      pills: [
        "JWT Rotation",
        "RBAC Isolation",
        "Device MDM",
        "Bcrypt Hashing",
        "Rate Limiting",
        "Connection Pooling",
      ],
    },
    Philosophy: {
      title: "Engineering Mindset",
      desc: "Committed to maintainable code, test-driven validation, and resilient error recovery. Every feature is architected for speed, intuitive user experience, and effortless scalability as user loads multiply.",
      pills: [
        "Clean Code",
        "Agile / Scrum",
        "Git Flow",
        "High Availability",
        "User-Centric UI",
        "Continuous Learning",
      ],
    },
  };

  return (
    <section
      id="cyber-about"
      style={{
        padding: "clamp(50px, 7vw, 90px) clamp(24px, 5.5vw, 64px)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 45vw, 420px), 1fr))",
          gap: "clamp(36px, 6vw, 60px)",
          alignItems: "center",
        }}
      >
        {/* Left Column: Narrative & Interactive Animated Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
              letterSpacing: "3px",
              color: "#ff2e5b",
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            TRAINED. TESTED. READY. //
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "1px",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            ABOUT ME<span style={{ color: "#ff2e5b" }}>.</span>
          </h2>

          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.65,
              color: "#cbd5e1",
              marginBottom: "14px",
            }}
          >
            I'm <strong>Shivakumar Bommineni</strong>, a Full-Stack Engineer and developer who builds
            intelligent, secure, and production-ready web software.
          </p>

          <p
            style={{
              fontSize: "clamp(0.88rem, 1.8vw, 0.95rem)",
              lineHeight: 1.65,
              color: "#94a3b8",
              marginBottom: "28px",
            }}
          >
            From engineering enterprise Learning Management Systems (LMS) at CHRP-INDIA to building
            hospital OT scheduling systems (BookMyOT) and contactless QR visitor passes, I focus on
            clean backend architectures, lightning-fast interfaces, and bulletproof security.
          </p>

          {/* Interactive Tabs with Animated Active Indicator */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              paddingBottom: "10px",
              marginBottom: "18px",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              position: "relative",
            }}
          >
            {Object.keys(tabData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background:
                    activeTab === tab
                      ? "rgba(255, 46, 91, 0.18)"
                      : "transparent",
                  border:
                    activeTab === tab
                      ? "1px solid rgba(255, 46, 91, 0.6)"
                      : "1px solid transparent",
                  color: activeTab === tab ? "#ff4d76" : "#94a3b8",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "clamp(0.72rem, 1.8vw, 0.78rem)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.25s ease",
                  boxShadow:
                    activeTab === tab ? "0 0 12px rgba(255, 46, 91, 0.3)" : "none",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Box with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="cyber-glass cyber-corner-box"
              style={{
                padding: "clamp(16px, 3.5vw, 20px)",
                borderRadius: "10px",
                marginBottom: "28px",
                border: "1px solid rgba(255, 46, 91, 0.25)",
              }}
            >
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "6px",
                }}
              >
                {tabData[activeTab].title}
              </div>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  lineHeight: 1.55,
                  marginBottom: "14px",
                }}
              >
                {tabData[activeTab].desc}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {tabData[activeTab].pills.map((p, i) => (
                  <motion.span
                    key={p}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ scale: 1.05, borderColor: "#ff2e5b" }}
                    style={{
                      background: "rgba(255, 46, 91, 0.12)",
                      border: "1px solid rgba(255, 46, 91, 0.3)",
                      color: "#fca5a5",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      fontSize: "0.72rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      cursor: "default",
                    }}
                  >
                    #{p}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Areas of Focus */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "1.5px",
              color: "#94a3b8",
              marginBottom: "10px",
            }}
          >
            // AREAS OF FOCUS:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              "Full-Stack Web Applications",
              "Enterprise Security & Auth",
              "High-Throughput REST APIs",
              "Database Schema & Optimization",
            ].map((f, i) => (
              <motion.span
                key={f}
                whileHover={{ y: -2, borderColor: "#ff2e5b", color: "#ffffff" }}
                style={{
                  background: "rgba(18, 18, 28, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#e2e8f0",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  transition: "all 0.2s ease",
                  cursor: "default",
                }}
              >
                ⚡ {f}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Right Column: 3D Holographic Card with Laser Scanline Animation */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Ambient red aura */}
          <div
            style={{
              position: "absolute",
              inset: "-14px",
              background:
                "radial-gradient(circle, rgba(255, 46, 91, 0.5) 0%, rgba(255, 46, 91, 0.12) 50%, transparent 75%)",
              filter: "blur(28px)",
              borderRadius: "26px",
              zIndex: 0,
            }}
          />

          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="cyber-glass-red cyber-corner-box cyber-3d-card"
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: "380px",
              width: "100%",
              borderRadius: "16px",
              padding: "clamp(12px, 3vw, 16px)",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 46, 91, 0.25)",
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "clamp(280px, 40vh, 360px)",
                borderRadius: "12px",
                overflow: "hidden",
                position: "relative",
                background: "#08060c",
              }}
            >
              <img
                src="/shivakumar_profile.png"
                alt="Shivakumar B"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  filter: "contrast(1.06) brightness(1.02)",
                }}
              />

              {/* Holographic Scanning Laser Line */}
              <motion.div
                animate={{
                  y: ["0%", "360px", "0%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background:
                    "linear-gradient(90deg, transparent, #ff2e5b, #ffffff, #ff2e5b, transparent)",
                  boxShadow: "0 0 15px #ff2e5b, 0 0 25px #ff2e5b",
                  pointerEvents: "none",
                  zIndex: 3,
                }}
              />

              {/* Vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(7, 7, 11, 0.94) 0%, transparent 60%)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  bottom: "14px",
                  left: "14px",
                  right: "14px",
                  textAlign: "center",
                  zIndex: 4,
                }}
              >
                <div
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "0.5px",
                    whiteSpace: "nowrap",
                  }}
                >
                  SHIVAKUMAR_B
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#ff2e5b",
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: "1px",
                    marginTop: "2px",
                    fontWeight: 700,
                  }}
                >
                  FULL-STACK ENGINEER
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
