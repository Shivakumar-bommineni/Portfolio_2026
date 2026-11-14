import React from "react";
import { ArrowRight, GithubIcon, LinkedInIcon, MailIcon } from "../components/Icons";

export default function HeroSection({ hero, skills, contact, scrollTo }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        paddingTop: "var(--nav-h)",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle developer grid pattern */}
      <div className="hero-grid-pattern" aria-hidden="true" />

      {/* Ambient top light beam */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 400,
          top: 0,
          left: 0,
          background:
            "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(37,99,235,0.18), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Animated dynamic atmospheric blobs */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,.15), transparent 70%)",
          top: -200,
          right: -150,
          pointerEvents: "none",
          animation: "blobFloat 9s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,58,237,.14), transparent 70%)",
          bottom: -100,
          left: -100,
          pointerEvents: "none",
          animation: "blobFloat 12s ease-in-out infinite reverse",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16,185,129,.10), transparent 70%)",
          top: "40%",
          left: "35%",
          pointerEvents: "none",
          animation: "blobFloat 15s ease-in-out infinite",
        }}
      />

      <div className="pf-hero-container">
        <div className="pf-hero-grid">
          {/* Left Column */}
          <div className="pf-hero-left">
            {/* Status badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".55rem",
                background: "rgba(16,185,129,.12)",
                border: "1px solid rgba(16,185,129,.3)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                borderRadius: 100,
                padding: ".4rem 1.1rem",
                marginBottom: "1.5rem",
                fontSize: ".78rem",
                fontWeight: 700,
                color: "var(--success)",
                boxShadow: "0 2px 10px rgba(16,185,129,0.12)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--success)",
                  boxShadow: "0 0 10px var(--success)",
                  animation: "radarPulse 2s ease-in-out infinite",
                }}
              />
              {hero.eyebrow}
            </div>

            {/* Name */}
            <h1
              style={{
                fontSize: "clamp(2.5rem,5.5vw,4.25rem)",
                fontWeight: 950,
                letterSpacing: "-2px",
                lineHeight: 1.06,
                marginBottom: ".75rem",
              }}
            >
              {hero.name.includes(" ") ? (
                <>
                  <span style={{ color: "var(--text)" }}>
                    {hero.name.split(" ")[0]}
                  </span>
                  <br />
                  <span
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary) 0%, var(--accent) 60%, #ec4899 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {hero.name.split(" ").slice(1).join(" ")}
                  </span>
                </>
              ) : (
                hero.name
              )}
            </h1>

            {/* Role */}
            <div
              style={{
                fontSize: "clamp(1.15rem,2vw,1.45rem)",
                fontWeight: 700,
                color: "var(--text-sec)",
                marginBottom: "1.25rem",
                letterSpacing: "-.02em",
              }}
            >
              {hero.title}
            </div>

            {/* Authentic Developer Terminal Prompt */}
            <div
              style={{
                fontFamily:
                  "'SF Mono','Fira Code','Cascadia Code',ui-monospace,monospace",
                fontSize: ".875rem",
                color: "var(--text-muted)",
                marginBottom: "1.75rem",
                display: "inline-flex",
                alignItems: "center",
                gap: ".75rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: ".55rem 1rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#ef4444",
                  }}
                />
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                />
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />
              </div>
              <div
                style={{ height: 14, width: 1, background: "var(--border)" }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".45rem",
                }}
              >
                <span style={{ color: "var(--success)", fontWeight: 700 }}>
                  ~
                </span>
                <span style={{ color: "var(--primary)" }}>$</span>
                <span>whoami</span>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                  {hero.handle}
                </span>
                <span
                  style={{
                    width: 2,
                    height: 14,
                    background: "var(--primary)",
                    display: "inline-block",
                    animation: "cursorBlink 1s infinite",
                  }}
                />
              </div>
            </div>

            <p
              style={{
                fontSize: "1.05rem",
                color: "var(--text-sec)",
                maxWidth: 520,
                lineHeight: 1.8,
                marginBottom: "2.25rem",
              }}
            >
              {hero.bio}
            </p>

            {/* CTAs */}
            <div className="hero-ctas">
              <button
                className="btn btn-primary"
                onClick={() => scrollTo("projects")}
                style={{
                  padding: ".85rem 2.25rem",
                  fontSize: ".95rem",
                  boxShadow: "0 8px 24px -4px rgba(37,99,235,0.45)",
                }}
              >
                View My Work <ArrowRight />
              </button>
              <button
                className="btn-hero-outline"
                onClick={() => scrollTo("contact")}
                style={{
                  padding: ".85rem 2.25rem",
                  fontSize: ".95rem",
                  fontWeight: 700,
                  border: "2px solid var(--border)",
                  borderRadius: "var(--radius)",
                  background: "var(--surface)",
                  color: "var(--text)",
                  cursor: "pointer",
                  transition: "all .2s cubic-bezier(0.16, 1, 0.3, 1)",
                  fontFamily: "inherit",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                Let's Talk
              </button>
            </div>

            {/* Stats row with interactive cards */}
            <div
              className="hero-stats-wrap"
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {[
                { num: "3+", label: "Years Coding" },
                { num: "10+", label: "Projects Built" },
                { num: "5+", label: "Tech Mastered" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="hero-stat-card edge-beam-card pf-stat"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    padding: ".85rem 1.25rem",
                    minWidth: 115,
                    position: "relative",
                    "--beam-color": "var(--primary)",
                  }}
                >
                  <div className="card-border-beam" aria-hidden="true" />
                  <div
                    style={{
                      fontSize: "1.65rem",
                      fontWeight: 950,
                      letterSpacing: "-.5px",
                      background: "var(--grad)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1.1,
                      marginBottom: ".25rem",
                    }}
                  >
                    {s.num}
                  </div>
                  <div
                    style={{
                      fontSize: ".74rem",
                      color: "var(--text-muted)",
                      fontWeight: 700,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column — Animated Centerpiece Avatar */}
          <div
            className="pf-hero-right"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.65rem",
              position: "relative",
            }}
          >
            {/* Floating Main Avatar Assembly */}
            <div
              style={{
                position: "relative",
                animation: "sbCardFloat 6s ease-in-out infinite",
              }}
            >
              {/* Animated Radial Aura Glow */}
              <div
                style={{
                  position: "absolute",
                  inset: -24,
                  borderRadius: 50,
                  background: "var(--grad)",
                  animation: "auraGlow 5s ease-in-out infinite",
                  zIndex: 0,
                }}
              />

              {/* Floating Satellite Chip 1 (Top Left): "⚡ High Performance" */}
              <div
                className="satellite-chip satellite-chip-1"
                style={{
                  position: "absolute",
                  top: -16,
                  left: -32,
                  zIndex: 10,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  padding: ".35rem .75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontSize: ".72rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  boxShadow: "var(--shadow)",
                  animation: "badgeFloat1 4s ease-in-out infinite",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <span style={{ color: "#f59e0b" }}>⚡</span> High Performance
              </div>

              {/* Floating Satellite Chip 2 (Bottom Left): "🔐 JWT & RBAC" */}
              <div
                className="satellite-chip satellite-chip-2"
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: -40,
                  zIndex: 10,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  padding: ".35rem .75rem",
                  display: "flex",
                  alignItems: "center",
                  gap: ".4rem",
                  fontSize: ".72rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  boxShadow: "var(--shadow)",
                  animation: "badgeFloat2 5s ease-in-out infinite",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <span style={{ color: "var(--primary)" }}>🔐</span> JWT & RBAC
              </div>

              {/* The SB Card Itself */}
              <div
                className="edge-beam-card edge-beam-card-avatar"
                style={{
                  width: 250,
                  height: 250,
                  borderRadius: 36,
                  background:
                    "linear-gradient(145deg, #1d4ed8 0%, #2563eb 35%, #7c3aed 70%, #9333ea 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 2,
                  overflow: "hidden",
                  boxShadow:
                    "0 24px 60px -12px rgba(37,99,235,0.45), 0 0 0 1px rgba(255,255,255,0.18) inset",
                  "--beam-color": "#ffffff",
                }}
              >
                {/* Traveling edge border beam */}
                <div className="card-border-beam" aria-hidden="true" />

                {/* Specular glass reflection diagonal sheen */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 45%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Decorative developer watermark in card corner */}
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 18,
                    fontFamily: "monospace",
                    fontSize: ".7rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: ".08em",
                  }}
                >
                  {"<dev:portfolio />"}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 18,
                    fontFamily: "monospace",
                    fontSize: ".65rem",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  {"v2026.1"}
                </div>

                {hero.avatarUrl ? (
                  <img
                    src={hero.avatarUrl}
                    alt={hero.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="sb-avatar-text"
                    style={{
                      fontSize: "5.5rem",
                      fontWeight: 950,
                      letterSpacing: "-2px",
                      color: "#ffffff",
                      userSelect: "none",
                      textShadow: "0 8px 30px rgba(0,0,0,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: 1,
                    }}
                  >
                    {hero.avatarText || "SB"}
                  </div>
                )}

                {/* "Open to Work" Live Beacon Pill */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 14,
                    right: 14,
                    zIndex: 4,
                    background: "rgba(15, 23, 42, 0.85)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: "1px solid rgba(16, 185, 129, 0.45)",
                    borderRadius: 100,
                    padding: ".3rem .75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: ".45rem",
                    fontSize: ".72rem",
                    fontWeight: 800,
                    color: "#34d399",
                    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#10b981",
                      animation: "radarPulse 2s ease-in-out infinite",
                    }}
                  />
                  Open to Work
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div
              style={{
                display: "flex",
                gap: ".875rem",
                marginTop: ".25rem",
              }}
            >
              {[
                {
                  href: contact.github,
                  icon: <GithubIcon />,
                  title: "GitHub",
                },
                {
                  href: contact.linkedin,
                  icon: <LinkedInIcon />,
                  title: "LinkedIn",
                },
                {
                  href: `mailto:${contact.email}`,
                  icon: <MailIcon />,
                  title: "Email",
                },
              ].map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-btn-v2"
                  title={s.title}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    border: "1.5px solid var(--border)",
                    background: "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-sec)",
                    textDecoration: "none",
                    transition: "all .2s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Interactive Tech Stack Capsules */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: ".45rem",
                justifyContent: "center",
                maxWidth: 290,
              }}
            >
              {skills.slice(0, 6).map((s) => (
                <span
                  key={s.name}
                  className="hero-tech-pill"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: ".3rem .7rem",
                    fontSize: ".75rem",
                    fontWeight: 700,
                    color: "var(--text-sec)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".35rem",
                    cursor: "default",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <span>{s.icon}</span> {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: ".35rem",
          color: "var(--text-muted)",
          fontSize: ".72rem",
          fontWeight: 600,
          animation: "blobFloat 2.5s ease-in-out infinite",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
