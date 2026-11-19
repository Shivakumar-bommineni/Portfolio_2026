import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export default function CyberNavbar({
  scrollTo,
  onSwitchToNormal,
  user,
  navigate,
  showScrollTop = false,
  theme = "dark",
  toggle,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "ABOUT", id: "cyber-about" },
    { label: "SKILLS", id: "cyber-skills" },
    { label: "EXPERIENCE", id: "cyber-experience" },
    { label: "PROJECTS", id: "cyber-projects" },
    { label: "SERVICES", id: "cyber-services" },
    { label: "CONTACT", id: "cyber-contact" },
  ];

  const handleNav = (id) => {
    scrollTo(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(7, 7, 11, 0.8)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255, 46, 91, 0.15)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "14px clamp(24px, 5.5vw, 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ff2e5b, #960f2d)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#ffffff",
              boxShadow: "0 0 15px rgba(255, 46, 91, 0.4)",
            }}
          >
            SB
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#ffffff",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#ff2e5b" }}>//</span> SHIVAKUMAR_B
            </span>
            <span
              style={{
                fontSize: "0.68rem",
                color: "#94a3b8",
                letterSpacing: "1.5px",
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
                  display: "inline-block",
                }}
              />
              SYSTEM ONLINE
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: "none",
            gap: "28px",
            alignItems: "center",
          }}
          className="desktop-links"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#cbd5e1",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "1.5px",
                cursor: "pointer",
                padding: "6px 2px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ff2e5b";
                e.currentTarget.style.textShadow = "0 0 10px rgba(255,46,91,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#cbd5e1";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Actions: Animated Theme Toggle, Top Button & Owner Login */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          {/* TOP button when scrolled past hero */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: -6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: -6 }}
                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                title="Scroll to Top"
                style={{
                  background: "rgba(20, 10, 18, 0.9)",
                  border: "1px solid rgba(255, 46, 91, 0.6)",
                  boxShadow: "0 0 16px rgba(255, 46, 91, 0.35)",
                  color: "#ff2e5b",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.2s ease",
                  fontFamily: "'JetBrains Mono', monospace",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 0 24px rgba(255, 46, 91, 0.7)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(255, 46, 91, 0.35)";
                }}
              >
                <span style={{ fontSize: "0.7rem", color: "#ff2e5b" }}>▲</span>
                <span>TOP</span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Theme Toggle (Dark / Light) with Spring & Rotation Animation like Classic */}
          {toggle && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggle}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              aria-label="Toggle theme"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                color: theme === "dark" ? "#f8fafc" : "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                outline: "none",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ff2e5b";
                e.currentTarget.style.boxShadow = "0 0 14px rgba(255, 46, 91, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <motion.div
                key={theme}
                initial={{ scale: 0.5, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0.5, rotate: 90, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              </motion.div>
            </motion.button>
          )}

          {/* Owner Login / Dashboard Button */}
          <button
            onClick={() => navigate && navigate(user ? "/dashboard" : "/login")}
            className="hidden-mobile"
            title={user ? "Open Dashboard" : "Owner Login"}
            style={{
              background: user ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 46, 91, 0.12)",
              border: user ? "1px solid #10b981" : "1px solid rgba(255, 46, 91, 0.45)",
              color: user ? "#34d399" : "#ffffff",
              fontSize: "0.78rem",
              fontWeight: 700,
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              boxShadow: user
                ? "0 0 10px rgba(16, 185, 129, 0.3)"
                : "0 0 10px rgba(255, 46, 91, 0.25)",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = user
                ? "0 0 18px rgba(16, 185, 129, 0.6)"
                : "0 0 18px rgba(255, 46, 91, 0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = user
                ? "0 0 10px rgba(16, 185, 129, 0.3)"
                : "0 0 10px rgba(255, 46, 91, 0.25)";
            }}
          >
            <span>{user ? "⚡" : "🔐"}</span>
            <span>{user ? "DASHBOARD" : "OWNER LOGIN"}</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 46, 91, 0.3)",
              color: "#ff2e5b",
              borderRadius: "6px",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: "#08080d",
            borderBottom: "1px solid rgba(255, 46, 91, 0.25)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNav(link.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "#e2e8f0",
                fontSize: "0.88rem",
                textAlign: "left",
                padding: "8px 0",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
              }}
            >
              // {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate && navigate(user ? "/dashboard" : "/login");
            }}
            style={{
              background: user ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 46, 91, 0.15)",
              border: user ? "1px solid #10b981" : "1px solid #ff2e5b",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "0.85rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <span>{user ? "⚡" : "🔐"}</span>
            <span>{user ? "GO TO DASHBOARD" : "OWNER LOGIN"}</span>
          </button>
          {toggle && (
            <button
              onClick={() => {
                toggle();
              }}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "6px",
                textAlign: "center",
                fontSize: "0.85rem",
                marginTop: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
              }}
            >
              <span>{theme === "dark" ? <SunIcon /> : <MoonIcon />}</span>
              <span>{theme === "dark" ? "SWITCH TO LIGHT" : "SWITCH TO DARK"}</span>
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-links {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
