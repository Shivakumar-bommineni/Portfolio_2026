import React from "react";
import { SKILL_CATS, CAT_COLORS, LEVEL_PCT } from "../config/defaultConfig";

export default function SkillsSection({ skills }) {
  return (
    <section className="section" id="skills">
      <div className="container">
        <div className="sec-head">
          <div className="sec-tag">Tech Stack</div>
          <h2 className="sec-title">Skills & Tools</h2>
          <p className="sec-sub">
            Technologies I use to bring ideas to life, from database design to
            deployment.
          </p>
        </div>
        {SKILL_CATS.map((cat) => {
          const catSkills = (skills || []).filter((s) => s.cat === cat);
          if (!catSkills.length) return null;
          const col = CAT_COLORS[cat] || CAT_COLORS.Frontend;
          return (
            <div key={cat} style={{ marginBottom: "2.75rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: ".75rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div
                  style={{
                    height: 4,
                    width: 24,
                    borderRadius: 4,
                    background: col.color,
                    boxShadow: `0 0 10px ${col.color}88`,
                  }}
                />
                <span
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 900,
                    color: col.color,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  {cat}
                </span>
                <span
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    padding: ".12rem .55rem",
                  }}
                >
                  {catSkills.length} skills
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: `linear-gradient(90deg, var(--border), transparent)`,
                  }}
                />
              </div>
              <div className="pf-skills-subgrid">
                {catSkills.map((s) => (
                  <div
                    key={s.name}
                    className="skill-card-v2 edge-beam-card"
                    style={{
                      background: "var(--surface)",
                      border: `1px solid ${col.border}`,
                      borderRadius: "var(--radius-lg)",
                      padding: "1.3rem 1.15rem 1.15rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: ".875rem",
                      transition: "all .25s cubic-bezier(0.16, 1, 0.3, 1)",
                      cursor: "default",
                      position: "relative",
                      overflow: "hidden",
                      "--beam-color": col.color,
                    }}
                  >
                    {/* Traveling Edge Progress Beam */}
                    <div className="card-border-beam" aria-hidden="true" />

                    {/* Top subtle glow bar */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: `linear-gradient(90deg, transparent, ${col.color}, transparent)`,
                        opacity: 0.8,
                      }}
                    />

                    {/* Header with Icon Badge and Level Tag */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: ".85rem",
                        }}
                      >
                        <div
                          className="skill-icon-badge"
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: col.bg,
                            border: `1px solid ${col.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            transition: "transform .25s ease",
                            boxShadow: `0 4px 12px ${col.bg}`,
                          }}
                        >
                          {s.icon}
                        </div>
                        <span
                          style={{
                            fontSize: ".65rem",
                            fontWeight: 800,
                            letterSpacing: ".04em",
                            textTransform: "uppercase",
                            color: col.color,
                            background: col.bg,
                            border: `1px solid ${col.border}`,
                            padding: ".2rem .5rem",
                            borderRadius: 100,
                          }}
                        >
                          {s.level}
                        </span>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: ".92rem",
                          letterSpacing: "-.015em",
                          color: "var(--text)",
                        }}
                      >
                        {s.name}
                      </div>
                    </div>

                    {/* Bottom Proficiency with Animated Shimmer Bar */}
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: ".35rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: ".68rem",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                          }}
                        >
                          Proficiency
                        </span>
                        <span
                          style={{
                            fontSize: ".72rem",
                            fontWeight: 800,
                            fontVariantNumeric: "tabular-nums",
                            color: col.color,
                          }}
                        >
                          {LEVEL_PCT[s.level] || 70}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: 6,
                          background: "var(--surface-alt)",
                          borderRadius: 99,
                          overflow: "hidden",
                          position: "relative",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${LEVEL_PCT[s.level] || 70}%`,
                            background: `linear-gradient(90deg, ${col.color}, var(--primary))`,
                            borderRadius: 99,
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: `0 0 10px ${col.color}44`,
                            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <div className="progress-shimmer-highlight" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
