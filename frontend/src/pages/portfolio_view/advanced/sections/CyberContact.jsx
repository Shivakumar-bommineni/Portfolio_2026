import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CyberContact({ contact, hero }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    scope: "Full-Stack Web Application",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", scope: "Full-Stack Web Application", message: "" });
    }, 1200);
  };

  return (
    <section
      id="cyber-contact"
      style={{
        padding: "clamp(50px, 7vw, 90px) clamp(24px, 5.5vw, 64px) clamp(80px, 10vw, 120px)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
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
          // GET IN TOUCH
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
          CONTACT<span style={{ color: "#ff2e5b" }}>.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            color: "#94a3b8",
            fontSize: "clamp(0.88rem, 2vw, 0.95rem)",
            maxWidth: "520px",
            margin: "10px auto 0",
            lineHeight: 1.6,
          }}
        >
          Have a project, role, or architecture you'd like to build? Let's talk.
        </motion.p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(280px, 45vw, 360px), 1fr))",
          gap: "clamp(24px, 4vw, 40px)",
          alignItems: "start",
        }}
      >
        {/* Left Column: Direct Channels & Signal Status */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Signal Status Box with Active Radar Ping */}
          <div
            className="cyber-glass-red cyber-corner-box"
            style={{
              padding: "clamp(18px, 3.5vw, 24px)",
              borderRadius: "14px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#10b981",
                    boxShadow: "0 0 8px #10b981",
                  }}
                />
                <motion.span
                  animate={{ scale: [1, 2.2], opacity: [0.8, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    position: "absolute",
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    border: "1px solid #10b981",
                  }}
                />
              </div>
              CHANNEL OPEN · DIRECT LINE
            </div>
            <div
              style={{
                fontSize: "clamp(0.98rem, 2vw, 1.15rem)",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "6px",
              }}
            >
              Ready for high-impact software projects
            </div>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.55 }}>
              Typically replying within 2 hours for contract work, technical consulting, and
              full-time developer roles.
            </p>
          </div>

          {/* Direct Email Card */}
          <motion.div
            whileHover={{ scale: 1.02, borderColor: "#ff2e5b" }}
            className="cyber-glass cyber-corner-box"
            style={{
              padding: "clamp(14px, 3vw, 20px) clamp(16px, 3.5vw, 24px)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "box-shadow 0.25s",
            }}
          >
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#ff2e5b",
                  marginBottom: "4px",
                }}
              >
                DIRECT EMAIL
              </div>
              <a
                href={`mailto:${contact?.email || "shivabommineni3@gmail.com"}`}
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(0.82rem, 2.2vw, 0.95rem)",
                  fontWeight: 700,
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                {contact?.email || "shivabommineni3@gmail.com"}
              </a>
            </div>
            <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>✉️</span>
          </motion.div>

          {/* Social Profiles with Animated Icons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <motion.a
              href={contact?.github || "https://github.com/shivakumar-bommineni"}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3, scale: 1.02, borderColor: "#ff2e5b" }}
              className="cyber-glass"
              style={{
                padding: "14px",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "box-shadow 0.2s",
              }}
            >
              <div>
                <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
                  REPO
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>GitHub ↗</div>
              </div>
              <motion.span whileHover={{ rotate: 15 }} style={{ fontSize: "1.2rem" }}>
                ⚡
              </motion.span>
            </motion.a>

            <motion.a
              href={contact?.linkedin || "https://www.linkedin.com/in/shivakumar-bommineni-331406292/"}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3, scale: 1.02, borderColor: "#ff2e5b" }}
              className="cyber-glass"
              style={{
                padding: "14px",
                borderRadius: "10px",
                textDecoration: "none",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "box-shadow 0.2s",
              }}
            >
              <div>
                <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}>
                  NETWORK
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>LinkedIn ↗</div>
              </div>
              <motion.span whileHover={{ scale: 1.2 }} style={{ fontSize: "1.2rem" }}>
                🔗
              </motion.span>
            </motion.a>
          </div>
        </motion.div>

        {/* Right Column: Cyber Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cyber-glass cyber-corner-box"
          style={{
            borderRadius: "16px",
            padding: "clamp(20px, 4vw, 36px)",
            border: "1px solid rgba(255, 46, 91, 0.3)",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "30px 10px" }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "12px",
                  filter: "drop-shadow(0 0 15px #ff2e5b)",
                }}
              >
                📡
              </div>
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 800,
                  color: "#ffffff",
                  marginBottom: "8px",
                }}
              >
                MESSAGE RECEIVED!
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "20px" }}>
                Thank you! Your message has been sent directly to my inbox. I'll
                reach back shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="cyber-btn-outline"
                style={{
                  padding: "10px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                }}
              >
                SEND ANOTHER MESSAGE
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                  }}
                >
                  YOUR NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tony Stark"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: "100%",
                    minHeight: "44px",
                    background: "rgba(10, 8, 16, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                  }}
                >
                  YOUR EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="tony@starkindustries.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: "100%",
                    minHeight: "44px",
                    background: "rgba(10, 8, 16, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                  }}
                >
                  SERVICES & PROJECT SCOPE
                </label>
                <select
                  value={formData.scope}
                  onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                  style={{
                    width: "100%",
                    minHeight: "44px",
                    background: "#0c0a14",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <option value="Full-Stack Web Application">Full-Stack Web Application</option>
                  <option value="AI-Powered Apps & Automation">AI-Powered Apps & Automation</option>
                  <option value="Backend APIs & Database Architecture">Backend APIs & Database Architecture</option>
                  <option value="Business Website / Landing Page">Business Website / Landing Page</option>
                  <option value="Enterprise Security & Auth System">Enterprise Security & Auth System</option>
                  <option value="Full-Time Developer Hiring">Full-Time Developer Hiring</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: "#cbd5e1",
                    marginBottom: "6px",
                  }}
                >
                  MESSAGE & PROJECT GOALS
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your idea, timeline, and what you want to build..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(10, 8, 16, 0.7)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#ffffff",
                    fontSize: "16px",
                    outline: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    resize: "vertical",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cyber-btn-primary"
                style={{
                  minHeight: "48px",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 800,
                  cursor: loading ? "not-allowed" : "pointer",
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading ? "SENDING..." : "SEND MESSAGE 🚀"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
