import React from "react";
import { MailIcon, GithubIcon, LinkedInIcon } from "../components/Icons";
import ContactForm from "../components/ContactForm";

export default function ContactSection({ contact, hero }) {
  return (
    <section
      id="contact"
      style={{ background: "var(--bg-alt)", padding: "5rem 0" }}
    >
      <div className="container">
        <div className="sec-head">
          <div className="sec-tag">Contact</div>
          <h2 className="sec-title">Let's Build Together</h2>
          <p className="sec-sub">
            Open to new engineering opportunities, full-time roles, or tech
            discussions.
          </p>
        </div>
        <div className="pf-contact-grid">
          {/* Info */}
          <div>
            {/* CTA banner */}
            <div
              style={{
                background: "var(--grad)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                color: "#fff",
                marginBottom: "1.5rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -30,
                  top: -30,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,.07)",
                }}
              />
              <div
                style={{
                  fontWeight: 900,
                  fontSize: "1.15rem",
                  marginBottom: ".375rem",
                }}
              >
                Ready to work together?
              </div>
              <div
                style={{
                  fontSize: ".875rem",
                  opacity: 0.85,
                  lineHeight: 1.65,
                }}
              >
                I'm currently open to full-time roles and high-impact engineering opportunities.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: ".75rem",
              }}
            >
              {[
                {
                  href: `mailto:${contact.email}`,
                  icon: <MailIcon />,
                  label: "Email",
                  val: contact.email,
                  color: "#3b82f6",
                },
                {
                  href: contact.github,
                  icon: <GithubIcon />,
                  label: "GitHub",
                  val: contact.github?.replace("https://github.com/", "@"),
                  color: "#6e5494",
                },
                {
                  href: contact.linkedin,
                  icon: <LinkedInIcon />,
                  label: "LinkedIn",
                  val: hero.name,
                  color: "#0077b5",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-link-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    textDecoration: "none",
                    color: "var(--text)",
                    transition: "all .2s",
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: `${item.color}18`,
                      border: `1.5px solid ${item.color}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: ".875rem" }}>
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontSize: ".78rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      {item.val}
                    </div>
                  </div>
                  <div
                    style={{ marginLeft: "auto", color: "var(--text-muted)" }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: "1.1rem",
                marginBottom: "1.5rem",
                letterSpacing: "-.3px",
              }}
            >
              Send a message ✉️
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
