import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function CyberHero({ hero, contact, scrollTo }) {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll-driven transforms for the Hero Split effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Responsive transforms
  const leftX = useTransform(scrollYProgress, [0, 0.7], [0, isMobile ? 0 : -180]);
  const leftY = useTransform(scrollYProgress, [0, 0.7], [0, isMobile ? -50 : 0]);
  const leftOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const rightX = useTransform(scrollYProgress, [0, 0.7], [0, isMobile ? 0 : 180]);
  const rightY = useTransform(scrollYProgress, [0, 0.7], [0, isMobile ? 50 : 0]);
  const rightOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const rightRotate = useTransform(scrollYProgress, [0, 0.7], [0, isMobile ? 0 : 8]);

  const plasmaScale = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, isMobile ? 1.4 : 1.9, 0]);
  const plasmaOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.35, 0.9, 0]);

  // 3D Mouse Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({
      x: -(y / rect.height) * 14,
      y: (x / rect.width) * 14,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      ref={containerRef}
      id="cyber-hero"
      className="cyber-grid-bg"
      style={{
        position: "relative",
        minHeight: isMobile ? "auto" : "90vh",
        display: "flex",
        alignItems: "center",
        padding: "clamp(40px, 6vw, 70px) clamp(24px, 5.5vw, 64px) clamp(60px, 8vw, 90px)",
        overflow: "hidden",
      }}
    >
      {/* Central Expanding Plasma Flare */}
      <motion.div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          width: "clamp(260px, 50vw, 420px)",
          height: "clamp(260px, 50vw, 420px)",
          marginLeft: "clamp(-130px, -25vw, -210px)",
          marginTop: "clamp(-130px, -25vw, -210px)",
          background:
            "radial-gradient(circle, rgba(255, 46, 91, 0.7) 0%, rgba(255, 46, 91, 0.2) 45%, transparent 70%)",
          filter: "blur(50px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
          scale: plasmaScale,
          opacity: plasmaOpacity,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(340px, 1fr))",
          alignItems: "center",
          gap: "clamp(36px, 6vw, 60px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Column: Typography, Eyebrow & Dual CTAs */}
        <motion.div
          style={{
            x: leftX,
            y: leftY,
            opacity: leftOpacity,
          }}
          transition={{ ease: "easeOut" }}
        >
          {/* Eyebrow badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 12px",
              borderRadius: "4px",
              background: "rgba(255, 46, 91, 0.12)",
              border: "1px solid rgba(255, 46, 91, 0.4)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
              fontWeight: 700,
              color: "#ff4d76",
              letterSpacing: "1.5px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#ff2e5b",
                boxShadow: "0 0 8px #ff2e5b",
              }}
            />
            SOFTWARE ENGINEER · FULL-STACK DEVELOPER
          </div>

          {/* Huge Main Headline */}
          <h1
            style={{
              fontSize: isMobile ? "clamp(1.45rem, 7.8vw, 2.6rem)" : "clamp(2.4rem, 5.5vw, 4.4rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: isMobile ? "-0.5px" : "-1px",
              color: "#ffffff",
              marginBottom: "14px",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              wordBreak: "keep-all",
            }}
          >
            SHIVAKUMAR<span
              style={{
                color: "#ff2e5b",
                textShadow: "0 0 25px rgba(255, 46, 91, 0.8), 0 0 50px rgba(255, 46, 91, 0.4)",
              }}
            >_B</span>
          </h1>

          {/* Subtitle / Role Tag */}
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)",
              fontWeight: 700,
              color: "#e2e8f0",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            FULL-STACK DEVELOPER //{" "}
            <span style={{ color: "#ff2e5b" }}>AI & REALTIME BUILDER</span>
          </div>

          {/* Bio statement */}
          <p
            style={{
              fontSize: "clamp(0.92rem, 2vw, 1.05rem)",
              lineHeight: 1.65,
              color: "#94a3b8",
              maxWidth: "560px",
              marginBottom: "28px",
            }}
          >
            {hero?.bio ||
              "Building high-performance web applications with Node.js, React.js, and Next.js. Passionate about clean architecture, secure systems, and great developer experiences."}
          </p>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <button
              onClick={() => scrollTo("cyber-projects")}
              className="cyber-btn-primary"
              style={{
                padding: "clamp(12px, 2.5vw, 15px) clamp(22px, 4vw, 32px)",
                borderRadius: "8px",
                fontSize: "clamp(0.82rem, 2vw, 0.92rem)",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                flex: isMobile ? "1 1 100%" : "none",
              }}
            >
              EXPLORE MY WORK
              <span>→</span>
            </button>

            <button
              onClick={() => scrollTo("cyber-contact")}
              className="cyber-btn-outline"
              style={{
                padding: "clamp(12px, 2.5vw, 15px) clamp(20px, 3.5vw, 28px)",
                borderRadius: "8px",
                fontSize: "clamp(0.82rem, 2vw, 0.92rem)",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                fontWeight: 600,
                flex: isMobile ? "1 1 100%" : "none",
                textAlign: "center",
              }}
            >
              GET IN TOUCH
            </button>
          </div>

          {/* Quick Tech Badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["React.js", "Node.js", "Next.js", "TypeScript", "PostgreSQL", "Socket.io"].map(
              (tech) => (
                <span
                  key={tech}
                  style={{
                    background: "rgba(18, 16, 26, 0.75)",
                    border: "1px solid rgba(255, 46, 91, 0.2)",
                    color: "#cbd5e1",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  ⚡ {tech}
                </span>
              )
            )}
          </div>
        </motion.div>

        {/* Right Column: 3D Holographic Avatar Card with Aura */}
        <motion.div
          style={{
            x: rightX,
            y: rightY,
            opacity: rightOpacity,
            rotate: rightRotate,
            display: "flex",
            justifyContent: "center",
            position: "relative",
            width: "100%",
          }}
          transition={{ ease: "easeOut" }}
        >
          {/* Intense Crimson Energy Fire Aura */}
          <div
            style={{
              position: "absolute",
              inset: "-14px",
              background:
                "radial-gradient(circle, rgba(255, 46, 91, 0.6) 0%, rgba(255, 46, 91, 0.15) 50%, transparent 80%)",
              filter: "blur(28px)",
              borderRadius: "26px",
              zIndex: 0,
            }}
          />

          {/* 3D Tilt Card Frame */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="cyber-corner-box"
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: "420px",
              borderRadius: "18px",
              padding: "clamp(10px, 2.5vw, 14px)",
              background: "rgba(14, 12, 20, 0.88)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 46, 91, 0.4)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 46, 91, 0.28)",
              transform: isMobile
                ? "none"
                : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 0.15s ease-out, box-shadow 0.3s ease",
            }}
          >
            {/* Top HUD Bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px 10px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.7rem",
                color: "#94a3b8",
              }}
            >
              <span>// FULL-STACK DEV · 2026</span>
              <span
                style={{
                  color: "#ff2e5b",
                  fontWeight: 800,
                  textShadow: "0 0 10px rgba(255,46,91,0.6)",
                }}
              >
                VERIFIED ✓
              </span>
            </div>

            {/* Profile Image Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "clamp(300px, 45vh, 390px)",
                borderRadius: "12px",
                overflow: "hidden",
                marginTop: "10px",
                backgroundColor: "#0d0b14",
              }}
            >
              <img
                src="/shivakumar_profile.png"
                alt="Shivakumar Bommineni"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  filter: "contrast(1.08) brightness(1.02)",
                }}
              />

              {/* Red cyber vignette overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(7, 7, 11, 0.95) 0%, rgba(255, 46, 91, 0.15) 50%, transparent 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Floating badges on photo */}
              <div
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  right: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(0, 0, 0, 0.8)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(16, 185, 129, 0.6)",
                      color: "#34d399",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 8px #10b981",
                      }}
                    />
                    OPEN TO WORK
                  </span>

                  <span
                    style={{
                      background: "rgba(0, 0, 0, 0.8)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255, 46, 91, 0.5)",
                      color: "#ffffff",
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    🔐 JWT & RBAC
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(12, 10, 18, 0.9)",
                    backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#ffffff" }}>
                      Shivakumar Bommineni
                    </div>
                    <div
                      style={{
                        fontSize: "0.68rem",
                        color: "#ff2e5b",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                      }}
                    >
                      Full Stack Developer · Hyderabad
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "6px" }}>
                    {contact?.github && (
                      <a
                        href={contact.github}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#cbd5e1",
                          fontSize: "1rem",
                          padding: "2px",
                        }}
                        title="GitHub"
                      >
                        ⚡
                      </a>
                    )}
                    {contact?.linkedin && (
                      <a
                        href={contact.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "#cbd5e1",
                          fontSize: "1rem",
                          padding: "2px",
                        }}
                        title="LinkedIn"
                      >
                        🔗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
