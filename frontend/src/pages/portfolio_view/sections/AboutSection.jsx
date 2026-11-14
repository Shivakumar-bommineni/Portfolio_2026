import React from "react";

export default function AboutSection({ about }) {
  return (
    <section
      className="section"
      id="about"
      style={{ background: "var(--bg-alt)" }}
    >
      <div className="container">
        <div className="sec-head">
          <div className="sec-tag">About Me</div>
          <h2 className="sec-title">Who am I?</h2>
          <p className="sec-sub">
            A full stack developer who cares about code quality, performance,
            and user experience.
          </p>
        </div>
        <div className="pf-about-grid">
          <div>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: ".975rem",
                  color: "var(--text-sec)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.85,
                }}
              >
                {p}
              </p>
            ))}
            {/* Mini stats */}
            <div className="pf-about-mini-stats">
              {[
                {
                  icon: "📍",
                  label: "Location",
                  val: "India · Remote Ready",
                },
                { icon: "💼", label: "Status", val: "Open to Work" },
                { icon: "⚙️", label: "Focus", val: "Full Stack Web Dev" },
                {
                  icon: "📚",
                  label: "Learning",
                  val: "System Design · TypeScript",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: ".875rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: ".7rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      marginBottom: ".2rem",
                    }}
                  >
                    {item.icon} {item.label}
                  </div>
                  <div style={{ fontSize: ".845rem", fontWeight: 700 }}>
                    {item.val}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: ".875rem",
            }}
          >
            {about.highlights.map((h) => (
              <div
                key={h.title}
                className="highlight-card-v2 edge-beam-card"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1.375rem 1.5rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1.125rem",
                  transition: "all .2s ease",
                  position: "relative",
                  overflow: "hidden",
                  "--beam-color": "var(--accent)",
                }}
              >
                <div className="card-border-beam" aria-hidden="true" />
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    background: "var(--primary-lt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {h.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: ".925rem",
                      marginBottom: ".25rem",
                    }}
                  >
                    {h.title}
                  </div>
                  <div
                    style={{
                      fontSize: ".82rem",
                      color: "var(--text-sec)",
                      lineHeight: 1.65,
                    }}
                  >
                    {h.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
