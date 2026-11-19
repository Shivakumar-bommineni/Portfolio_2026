import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CyberServices({ scrollTo }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const services = [
    {
      num: "01",
      title: "Full-Stack Web Applications",
      timeline: "2-4 WEEKS",
      price: "$1,500+",
      desc: "End-to-end production web applications using React.js, Next.js, Node.js, and PostgreSQL. Includes responsive UI, REST/GraphQL APIs, secure authentication, and cloud deployment.",
      features: [
        "Custom React / Next.js Architecture",
        "Robust Node.js & Express REST APIs",
        "PostgreSQL / MongoDB Schemas",
        "CI/CD Cloud Deployment",
      ],
    },
    {
      num: "02",
      title: "AI-Powered Apps & Automation",
      timeline: "3-5 WEEKS",
      price: "$2,000+",
      desc: "Integrate LLMs, AI agents, document processing pipelines, intelligent search, and autonomous business workflows tailored to your product.",
      features: [
        "LLM & OpenAI/Gemini API Integration",
        "Vector Search & Retrieval Pipelines",
        "Autonomous Task Automations",
        "Interactive Chat Assistants",
      ],
    },
    {
      num: "03",
      title: "Backend APIs & Database Architecture",
      timeline: "1-2 WEEKS",
      price: "$800+",
      desc: "High-throughput, clean REST/WebSocket backends engineered for speed, reliability, connection pooling, and resilient transaction handling.",
      features: [
        "RESTful API & WebSocket Architecture",
        "Database Indexing & Query Optimization",
        "Rate Limiting & Defensive Middleware",
        "Comprehensive API Documentation",
      ],
    },
    {
      num: "04",
      title: "Business Websites & Landing Pages",
      timeline: "1 WEEK",
      price: "$600+",
      desc: "Blazing fast, SEO-optimized business websites and PWAs designed to convert visitors with animations, responsiveness, and clean branding.",
      features: [
        "Lighthouse 95+ Performance Scores",
        "Mobile-First Responsive Layouts",
        "Interactive Contact Forms & Mailers",
        "SEO Meta & Social Sharing Cards",
      ],
    },
    {
      num: "05",
      title: "Enterprise Security & Auth Systems",
      timeline: "2-3 WEEKS",
      price: "$1,200+",
      desc: "Hardened authentication architectures with multi-device session limits (MDM), JWT refresh rotation, RBAC privilege gates, and attack mitigation.",
      features: [
        "JWT + Refresh Token Cookie Rotation",
        "Multi-Device Session MDM (Max 3 Devices)",
        "Role-Based Access Control (RBAC)",
        "Account Lockout & Brute-Force Shield",
      ],
    },
  ];

  return (
    <section
      id="cyber-services"
      style={{
        padding: "clamp(50px, 7vw, 90px) clamp(24px, 5.5vw, 64px)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "clamp(32px, 5vw, 50px)" }}>
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
          // WHAT I DELIVER
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
          SERVICES & PRICING<span style={{ color: "#ff2e5b" }}>.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            color: "#94a3b8",
            fontSize: "clamp(0.88rem, 2vw, 0.95rem)",
            maxWidth: "500px",
            margin: "10px auto 0",
            lineHeight: 1.6,
          }}
        >
          Transparent scopes, clear timelines, and production-grade engineering deliverables.
        </motion.p>
      </div>

      {/* Services List with Staggered Entrance and Hover Laser Effects */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {services.map((s, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setExpandedIndex(isExpanded ? -1 : idx)}
              className="cyber-glass cyber-corner-box"
              style={{
                borderRadius: "14px",
                padding: "clamp(16px, 3.5vw, 24px) clamp(16px, 4vw, 28px)",
                border: isExpanded
                  ? "1px solid rgba(255, 46, 91, 0.7)"
                  : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: isExpanded
                  ? "0 12px 35px rgba(255, 46, 91, 0.25)"
                  : "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Laser sweep line on top */}
              {isExpanded && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "50%",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #ff2e5b, transparent)",
                    boxShadow: "0 0 10px #ff2e5b",
                  }}
                />
              )}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                {/* Number & Title */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: "1 1 240px" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "clamp(1.2rem, 2.5vw, 1.4rem)",
                      fontWeight: 800,
                      color: isExpanded ? "#ff2e5b" : "#94a3b8",
                      minWidth: "30px",
                      textShadow: isExpanded ? "0 0 15px rgba(255,46,91,0.6)" : "none",
                    }}
                  >
                    {s.num}
                  </span>
                  <span
                    style={{
                      fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
                      fontWeight: 700,
                      color: "#ffffff",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {s.title}
                  </span>
                </div>

                {/* Timeline & Pricing Badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      color: "#cbd5e1",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                    }}
                  >
                    ⏱ {s.timeline}
                  </span>

                  <span
                    style={{
                      background: isExpanded ? "rgba(255, 46, 91, 0.25)" : "rgba(255, 46, 91, 0.12)",
                      border: "1px solid rgba(255, 46, 91, 0.45)",
                      color: "#ff4d76",
                      padding: "4px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 700,
                      boxShadow: isExpanded ? "0 0 12px rgba(255, 46, 91, 0.3)" : "none",
                    }}
                  >
                    {s.price}
                  </span>

                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      color: "#ff2e5b",
                      fontSize: "0.95rem",
                      marginLeft: "4px",
                      display: "inline-block",
                    }}
                  >
                    ▼
                  </motion.span>
                </div>
              </div>

              {/* Expanded details with smooth height animation */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        marginTop: "20px",
                        paddingTop: "16px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "clamp(0.85rem, 1.8vw, 0.95rem)",
                          color: "#cbd5e1",
                          lineHeight: 1.6,
                          marginBottom: "18px",
                        }}
                      >
                        {s.desc}
                      </p>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(180px, 40vw, 260px), 1fr))",
                          gap: "10px",
                          marginBottom: "18px",
                        }}
                      >
                        {s.features.map((f, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "0.82rem",
                              color: "#94a3b8",
                              fontFamily: "'JetBrains Mono', monospace",
                            }}
                          >
                            <span style={{ color: "#ff2e5b" }}>✓</span>
                            {f}
                          </motion.div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollTo && scrollTo("cyber-contact");
                        }}
                        className="cyber-btn-primary"
                        style={{
                          padding: "10px 18px",
                          borderRadius: "6px",
                          border: "none",
                          fontSize: "0.8rem",
                          fontFamily: "'JetBrains Mono', monospace",
                          cursor: "pointer",
                          width: "100%",
                          maxWidth: "320px",
                        }}
                      >
                        DISCUSS SCOPE & ESTIMATE →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
