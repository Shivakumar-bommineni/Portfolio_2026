import React from "react";
import { SunIcon, MoonIcon } from "../components/Icons";

export default function Navbar({
  hero,
  navScrolled,
  theme,
  toggle,
  user,
  navigate,
  mobileNavOpen,
  setMobileNavOpen,
  scrollTo,
  onSwitchToAdvanced,
}) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "var(--nav-h)",
        background: navScrolled
          ? theme === "dark"
            ? "rgba(10,15,30,.92)"
            : "rgba(255,255,255,.92)"
          : "transparent",
        backdropFilter: navScrolled ? "blur(14px)" : "none",
        borderBottom: navScrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all .3s ease",
      }}
    >
      <div className="p-nav-inner">
        <a className="p-nav-brand" href="#hero">
          <div className="sb-mark">
            <span className="sb-mark-text">{hero.avatarText || "SB"}</span>
          </div>
          <div className="p-brand-text">
            <span className="p-brand-title">
              {hero.handle && hero.handle.includes("_") ? (
                <>
                  <span>{hero.handle.split("_")[0]}</span>
                  <span className="p-brand-accent">_{hero.handle.split("_").slice(1).join("_")}</span>
                </>
              ) : (
                <span>{hero.handle || "ShivaKumar_B"}</span>
              )}
            </span>
            <span className="p-brand-badge">
              <span className="p-brand-pulse" />
              <span>Full Stack Dev</span>
            </span>
          </div>
        </a>
        <div className="p-nav-links">
          {[
            ["About", "about"],
            ["Skills", "skills"],
            ["Experience", "experience"],
            ["Projects", "projects"],
            ["Contact", "contact"],
          ].map(([l, id]) => (
            <button
              key={id}
              className="nav-link-underline"
              onClick={() => scrollTo(id)}
              style={{
                padding: ".25rem 0",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontSize: ".855rem",
                fontWeight: 600,
                color: "var(--text-sec)",
                transition: "color .2s",
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="p-nav-actions">
          {onSwitchToAdvanced && (
            <button
              onClick={onSwitchToAdvanced}
              style={{
                background: "linear-gradient(135deg, #ff2e5b, #b51239)",
                border: "none",
                color: "#ffffff",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: ".75rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 12px rgba(255, 46, 91, 0.4)",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontFamily: "inherit",
              }}
              title="Switch to 3D Spotlight Mode"
            >
              <span>⚡</span>
              <span>3D Spotlight</span>
            </button>
          )}
          <button className="theme-btn" onClick={toggle} title="Toggle theme">
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="login-btn p-desktop-only" onClick={() => navigate(user ? "/dashboard" : "/login")}>
            {user ? "Dashboard" : "Owner Login"}
          </button>
          <button
            className="p-mobile-menu-btn"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div
          className="p-mobile-drawer"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            padding: "1.25rem 1.5rem",
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
            display: "flex",
            flexDirection: "column",
            gap: ".75rem",
          }}
        >
          {[
            ["About", "about"],
            ["Skills", "skills"],
            ["Experience", "experience"],
            ["Projects", "projects"],
            ["Contact", "contact"],
          ].map(([l, id]) => (
            <button
              key={id}
              onClick={() => {
                scrollTo(id);
                setMobileNavOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--border)",
                padding: ".65rem 0",
                textAlign: "left",
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text)",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {l}
            </button>
          ))}
          {onSwitchToAdvanced && (
            <button
              onClick={() => {
                onSwitchToAdvanced();
                setMobileNavOpen(false);
              }}
              style={{
                background: "linear-gradient(135deg, #ff2e5b, #b51239)",
                border: "none",
                color: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                fontSize: ".85rem",
                fontWeight: 700,
                cursor: "pointer",
                textAlign: "center",
                marginTop: "6px",
              }}
            >
              ⚡ Switch to 3D Spotlight Mode
            </button>
          )}
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginTop: ".5rem", padding: ".75rem" }}
            onClick={() => {
              setMobileNavOpen(false);
              navigate(user ? "/dashboard" : "/login");
            }}
          >
            {user ? "Go to Dashboard" : "Owner Login"}
          </button>
        </div>
      )}
    </nav>
  );
}
