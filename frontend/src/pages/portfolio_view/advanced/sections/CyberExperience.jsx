import React from "react";
import { motion } from "framer-motion";

export default function CyberExperience({ experience }) {
  const experiences = experience || [];

  return (
    <section
      id="cyber-experience"
      style={{
        padding: "clamp(50px, 7vw, 90px) clamp(24px, 5.5vw, 64px)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "clamp(36px, 5vw, 50px)" }}>
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
          // CAREER TRAJECTORY
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
          EXPERIENCE<span style={{ color: "#ff2e5b" }}>.</span>
        </motion.h2>
      </div>

      {/* Cyber Timeline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          position: "relative",
        }}
      >
        {experiences.map((exp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -25 : 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4, borderColor: "rgba(255, 46, 91, 0.65)" }}
            className="cyber-glass cyber-corner-box"
            style={{
              borderRadius: "14px",
              padding: "clamp(20px, 4vw, 28px)",
              border: "1px solid rgba(255, 46, 91, 0.25)",
              position: "relative",
              transition: "box-shadow 0.25s",
            }}
          >
            {/* Top Bar with Pulsing Beacon Node */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: "12px",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <motion.span
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#ff2e5b",
                      boxShadow: "0 0 10px #ff2e5b",
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "clamp(1.1rem, 2.5vw, 1.25rem)",
                      fontWeight: 800,
                      color: "#ffffff",
                    }}
                  >
                    {exp.role}{" "}
                    <span style={{ color: "#ff2e5b" }}>@ {exp.company}</span>
                  </h3>
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#94a3b8",
                    fontFamily: "'JetBrains Mono', monospace",
                    marginTop: "6px",
                    paddingLeft: "18px",
                  }}
                >
                  📍 {exp.location || "Hyderabad, India"}
                </div>
              </div>

              {/* Date Badge */}
              <div
                style={{
                  background: "rgba(255, 46, 91, 0.12)",
                  border: "1px solid rgba(255, 46, 91, 0.4)",
                  color: "#ff4d76",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                }}
              >
                {exp.startDate} - {exp.endDate}
              </div>
            </div>

            {/* Bullets with styled ticks */}
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {exp.bullets?.map((b, bIdx) => (
                <li
                  key={bIdx}
                  style={{
                    fontSize: "clamp(0.85rem, 1.8vw, 0.9rem)",
                    color: "#cbd5e1",
                    lineHeight: 1.6,
                  }}
                >
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
