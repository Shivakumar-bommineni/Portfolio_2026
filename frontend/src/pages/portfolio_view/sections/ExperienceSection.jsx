import React from "react";

export default function ExperienceSection({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section
      className="section"
      id="experience"
      style={{ background: "var(--bg-alt)" }}
    >
      <div className="container">
        <div className="sec-head">
          <div className="sec-tag">Experience</div>
          <h2 className="sec-title">Work History</h2>
          <p className="sec-sub">My professional journey as a developer.</p>
        </div>
        <div
          style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}
        >
          {/* timeline line */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 20,
              bottom: 20,
              width: 2,
              background: "var(--border)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {experience.map((exp, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "1.75rem",
                  position: "relative",
                }}
              >
                {/* dot */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "var(--grad)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    boxShadow:
                      "0 0 0 4px var(--bg-alt), 0 0 0 6px var(--primary)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.5"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <div
                  className="edge-beam-card"
                  style={{
                    flex: 1,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    borderLeft: "4px solid var(--primary)",
                    position: "relative",
                    overflow: "hidden",
                    "--beam-color": "var(--primary)",
                  }}
                >
                  <div className="card-border-beam" aria-hidden="true" />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: ".5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: "1.1rem",
                          letterSpacing: "-.3px",
                        }}
                      >
                        {exp.role}
                      </div>
                      <div
                        style={{
                          color: "var(--primary)",
                          fontWeight: 700,
                          fontSize: ".875rem",
                          marginTop: ".15rem",
                        }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: ".4rem",
                          background: "var(--primary-lt)",
                          color: "var(--primary)",
                          padding: ".25rem .75rem",
                          borderRadius: 100,
                          fontSize: ".73rem",
                          fontWeight: 700,
                        }}
                      >
                        {exp.startDate} – {exp.endDate}
                      </div>
                      {exp.location && (
                        <div
                          style={{
                            fontSize: ".75rem",
                            color: "var(--text-muted)",
                            marginTop: ".25rem",
                          }}
                        >
                          📍 {exp.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul
                      style={{
                        paddingLeft: "1.125rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: ".5rem",
                      }}
                    >
                      {exp.bullets.map((b, j) => (
                        <li
                          key={j}
                          style={{
                            fontSize: ".875rem",
                            color: "var(--text-sec)",
                            lineHeight: 1.65,
                          }}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
