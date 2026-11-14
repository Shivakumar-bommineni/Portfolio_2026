import React from "react";
import { GithubIcon, ExternalIcon } from "../components/Icons";

export default function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="section" id="projects">
      <div className="container">
        <div className="sec-head">
          <div className="sec-tag">Projects</div>
          <h2 className="sec-title">Featured Work</h2>
          <p className="sec-sub">
            Selected projects showcasing my skills in full stack development.
          </p>
        </div>
        <div className="pf-projects-grid">
          {projects.map((p, i) => (
            <div
              key={i}
              className="proj-card-v2 edge-beam-card"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "all .25s",
                position: "relative",
                "--beam-color": "var(--primary)",
              }}
            >
              <div className="card-border-beam" aria-hidden="true" />
              {/* Gradient top accent */}
              <div
                className="proj-top-bar"
                style={{
                  height: 4,
                  background: "var(--grad)",
                  opacity: 0.4,
                  transition: "opacity .2s",
                }}
              />
              {/* Number + title area */}
              <div style={{ padding: "1.75rem 1.75rem 1.25rem", flex: 1 }}>
                <div
                  style={{
                    display: "inline-block",
                    background: "var(--primary-lt)",
                    color: "var(--primary)",
                    borderRadius: 8,
                    padding: ".2rem .625rem",
                    fontSize: ".7rem",
                    fontWeight: 800,
                    letterSpacing: ".06em",
                    marginBottom: ".875rem",
                  }}
                >
                  Project {p.num || String(i + 1).padStart(2, "0")}
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    letterSpacing: "-.3px",
                    marginBottom: ".75rem",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    fontSize: ".875rem",
                    color: "var(--text-sec)",
                    lineHeight: 1.75,
                    marginBottom: "1.125rem",
                  }}
                >
                  {p.desc}
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}
                >
                  {p.tags?.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: "var(--surface-alt)",
                        border: "1px solid var(--border)",
                        color: "var(--text-sec)",
                        borderRadius: 7,
                        padding: ".2rem .625rem",
                        fontSize: ".73rem",
                        fontWeight: 700,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              {/* Links */}
              <div
                style={{
                  padding: "1rem 1.75rem",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: ".75rem",
                  alignItems: "center",
                }}
              >
                {p.github && p.github !== "#" && (
                  <a
                    href={p.github}
                    className="proj-link"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".4rem",
                      fontSize: ".8rem",
                      fontWeight: 700,
                      color: "var(--text-sec)",
                      border: "1.5px solid var(--border)",
                      padding: ".4rem .875rem",
                      borderRadius: 8,
                      textDecoration: "none",
                      background: "var(--surface)",
                      transition: "all .15s",
                    }}
                  >
                    <GithubIcon /> Code
                  </a>
                )}
                {p.live && p.live !== "#" && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".4rem",
                      fontSize: ".8rem",
                      fontWeight: 700,
                      color: "#fff",
                      background: "var(--grad)",
                      padding: ".4rem .875rem",
                      borderRadius: 8,
                      textDecoration: "none",
                      transition: "opacity .15s",
                    }}
                  >
                    <ExternalIcon /> Live Demo
                  </a>
                )}
                {(!p.github || p.github === "#") &&
                  (!p.live || p.live === "#") && (
                    <span
                      style={{
                        fontSize: ".77rem",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                      }}
                    >
                      🔒 Private / Coming soon
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
