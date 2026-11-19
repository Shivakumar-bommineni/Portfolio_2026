import React from "react";
import { motion } from "framer-motion";

export default function CyberSkills({ skills }) {
  const domains = [
    {
      title: "Full-Stack Development",
      desc: "React.js, Next.js, responsive SPAs, component systems, state management, and performance tuning.",
      level: "95%",
    },
    {
      title: "Backend Engineering",
      desc: "Node.js, Express, REST APIs, WebSocket real-time feeds, background jobs, and defensive middleware.",
      level: "98%",
    },
    {
      title: "Databases & ORM",
      desc: "PostgreSQL, MongoDB, connection pooling, schema migrations, and high-speed indexing.",
      level: "90%",
    },
    {
      title: "Security & Authentication",
      desc: "JWT rotation, Multi-Device MDM sessions, bcrypt, RBAC isolation, and CSRF/CORS hardening.",
      level: "96%",
    },
    {
      title: "Cloud & DevOps",
      desc: "Docker containerization, Git/GitHub actions, Linux server environments, and Hostinger/Vercel deploys.",
      level: "85%",
    },
    {
      title: "System Architecture",
      desc: "Microservices principles, clean code structure, error resilience, and enterprise LMS/ATS systems.",
      level: "92%",
    },
  ];

  const techStack = [
    { name: "React.js", symbol: "⚛️", level: "EXPERT" },
    { name: "Next.js", symbol: "▲", level: "ADVANCED" },
    { name: "Node.js", symbol: "🟢", level: "EXPERT" },
    { name: "TypeScript", symbol: "🔷", level: "ADVANCED" },
    { name: "PostgreSQL", symbol: "🐘", level: "EXPERT" },
    { name: "MongoDB", symbol: "🍃", level: "ADVANCED" },
    { name: "Socket.io", symbol: "⚡", level: "EXPERT" },
    { name: "Docker", symbol: "🐋", level: "INTERMEDIATE" },
  ];

  return (
    <section
      id="cyber-skills"
      style={{
        padding: "clamp(50px, 7vw, 90px) clamp(24px, 5.5vw, 64px)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header 1: Technical Skills Domain */}
      <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 48px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
            letterSpacing: "3px",
            color: "#ff2e5b",
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          // CAPABILITIES & MASTERY
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          TECHNICAL SKILLS<span style={{ color: "#ff2e5b" }}>.</span>
        </motion.h2>
      </div>

      {/* Domain Matrix Grid with Animated Progress Bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(260px, 45vw, 340px), 1fr))",
          gap: "clamp(16px, 3vw, 24px)",
          marginBottom: "clamp(48px, 6vw, 70px)",
        }}
      >
        {domains.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{ y: -4, borderColor: "rgba(255, 46, 91, 0.6)" }}
            className="cyber-glass cyber-corner-box"
            style={{
              padding: "clamp(18px, 3.5vw, 24px)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "box-shadow 0.25s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3
                style={{
                  fontSize: "clamp(0.98rem, 2vw, 1.1rem)",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {d.title}
              </h3>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#ff2e5b",
                  textShadow: "0 0 10px rgba(255,46,91,0.5)",
                }}
              >
                {d.level}
              </span>
            </div>

            <p
              style={{
                fontSize: "clamp(0.8rem, 1.8vw, 0.86rem)",
                color: "#94a3b8",
                lineHeight: 1.55,
                marginBottom: "14px",
              }}
            >
              {d.desc}
            </p>

            {/* Glowing progress line that animates filling up on scroll */}
            <div
              style={{
                height: "4px",
                width: "100%",
                background: "rgba(255, 255, 255, 0.08)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: d.level }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #ff2e5b, #ff7192)",
                  boxShadow: "0 0 12px #ff2e5b",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header 2: 3D Tech Stack Glass Cards */}
      <div style={{ textAlign: "center", marginBottom: "clamp(24px, 4vw, 40px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "clamp(0.72rem, 1.8vw, 0.82rem)",
            letterSpacing: "3px",
            color: "#ff2e5b",
            marginBottom: "8px",
            fontWeight: 700,
          }}
        >
          // CORE TECHNOLOGIES & TOOLS
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "clamp(1.6rem, 3.8vw, 2.5rem)",
            fontWeight: 800,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          MY TECH STACK<span style={{ color: "#ff2e5b" }}>.</span>
        </motion.h3>
      </div>

      {/* 3D Glass Tech Stack Cards with Continuous Floating & 3D Tilt Animations */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(95px, 20vw, 140px), 1fr))",
          gap: "clamp(10px, 2vw, 20px)",
        }}
      >
        {techStack.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            animate={{
              y: [0, -6, 0],
            }}
            whileHover={{
              y: -12,
              scale: 1.05,
              borderColor: "#ff2e5b",
              boxShadow: "0 15px 35px rgba(255, 46, 91, 0.4), inset 0 0 15px rgba(255, 46, 91, 0.2)",
            }}
            className="cyber-glass cyber-corner-box"
            style={{
              borderRadius: "14px",
              padding: "clamp(16px, 2.5vw, 24px) clamp(8px, 1.5vw, 16px)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid rgba(255, 46, 91, 0.22)",
              cursor: "pointer",
              transition: "border-color 0.25s, box-shadow 0.25s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Tech Icon / Symbol with hover scale */}
            <motion.div
              whileHover={{ scale: 1.25, rotate: 5 }}
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
                marginBottom: "10px",
                filter: "drop-shadow(0 0 10px rgba(255, 46, 91, 0.4))",
                transition: "transform 0.2s ease",
              }}
            >
              {t.symbol}
            </motion.div>

            {/* Name */}
            <div
              style={{
                fontSize: "clamp(0.78rem, 1.8vw, 0.95rem)",
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: "4px",
                wordBreak: "break-word",
              }}
            >
              {t.name}
            </div>

            {/* Level Badge */}
            <span
              style={{
                fontSize: "clamp(0.6rem, 1.5vw, 0.68rem)",
                fontFamily: "'JetBrains Mono', monospace",
                color: "#ff4d76",
                background: "rgba(255, 46, 91, 0.12)",
                border: "1px solid rgba(255, 46, 91, 0.25)",
                padding: "2px 6px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {t.level}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
