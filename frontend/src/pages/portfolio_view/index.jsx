import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { portfolioAPI } from "../../services/api";
import PortfolioChat from "../../components/portfolio_chat";
import ErrorBoundary from "../../components/ErrorBoundary";

// Config & Helpers
import { DEFAULT_CONFIG } from "./config/defaultConfig";
import { merge, scrollTo } from "./config/helpers";

// Normal Mode Styles & Sections (Intact & Undisturbed)
import PortfolioStyles from "./styles/PortfolioStyles";
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";
import Footer from "./sections/Footer";

// Advanced Spotlight / Cyber Mode
import AdvancedPortfolioView from "./advanced";

export { DEFAULT_CONFIG };

export default function PortfolioView() {
  const { theme = "dark", toggle } = useTheme() || {};
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [cfg, setCfg] = useState(DEFAULT_CONFIG);
  const [navScrolled, setNavScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Mode Selection: Default to "normal" (Classic Mode). Advanced mode loads on /advanced, ?mode=advanced, or user switch
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "normal";
    if (window.location.pathname === "/advanced") return "advanced";
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode");
    if (urlMode === "advanced") return "advanced";
    if (urlMode === "normal") return "normal";
    const saved = localStorage.getItem("portfolio_mode");
    if (saved === "advanced") return "advanced";
    return "normal";
  });

  const handleSetMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem("portfolio_mode", newMode);
  };

  useEffect(() => {
    if (location.pathname === "/advanced") {
      setMode("advanced");
      return;
    }
    const params = new URLSearchParams(location.search);
    const urlMode = params.get("mode");
    if (urlMode === "normal" || urlMode === "advanced") {
      setMode(urlMode);
    }
  }, [location.search, location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Shivakumar Bommineni · Full Stack Developer";
    portfolioAPI
      .getPublic()
      .then((res) => {
        if (res.data.config) setCfg(merge(DEFAULT_CONFIG, res.data.config));
      })
      .catch(() => {});

    const onScroll = () => {
      setNavScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 420);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mode === "normal" && cfg.theme?.primary) {
      document.documentElement.style.setProperty("--primary", cfg.theme.primary);
      document.documentElement.style.setProperty("--primary-dk", cfg.theme.primary);
      document.documentElement.style.setProperty("--accent", cfg.theme.accent || "#7c3aed");
      document.documentElement.style.setProperty(
        "--grad",
        `linear-gradient(135deg, ${cfg.theme.primary}, ${cfg.theme.accent || "#7c3aed"})`
      );
    }
  }, [cfg.theme, mode]);

  const { hero, about, skills, experience, projects, contact } = cfg;

  // ── ADVANCED SPOTLIGHT / CYBER MODE ──
  if (mode === "advanced") {
    return (
      <ErrorBoundary>
        <AdvancedPortfolioView
          cfg={cfg}
          onSwitchToNormal={() => handleSetMode("normal")}
          user={user}
          navigate={navigate}
          theme={theme}
          toggle={toggle}
        />
      </ErrorBoundary>
    );
  }

  // ── NORMAL / CLASSIC MODE (100% UNCHANGED & INTACT) ──
  return (
    <div>
      <PortfolioStyles />

      <Navbar
        hero={hero}
        navScrolled={navScrolled}
        theme={theme}
        toggle={toggle}
        user={user}
        navigate={navigate}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        scrollTo={scrollTo}
        onSwitchToAdvanced={() => handleSetMode("advanced")}
      />

      <HeroSection
        hero={hero}
        skills={skills}
        contact={contact}
        scrollTo={scrollTo}
      />

      <AboutSection about={about} />

      <SkillsSection skills={skills} />

      <ExperienceSection experience={experience} />

      <ProjectsSection projects={projects} />

      <ContactSection contact={contact} hero={hero} />

      <Footer hero={hero} contact={contact} scrollTo={scrollTo} />

      <PortfolioChat />

      {/* Floating Scroll to Top button for Normal Mode */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 420, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Scroll to Top"
            aria-label="Scroll to top"
            style={{
              position: "fixed",
              bottom: "calc(clamp(1.5rem, 3vw, 2rem) + 54px)",
              right: "clamp(1rem, 3vw, 2rem)",
              zIndex: 299,
              background: theme === "dark" ? "rgba(15, 23, 42, 0.92)" : "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: theme === "dark" ? "1px solid rgba(148, 163, 184, 0.25)" : "1px solid rgba(0, 0, 0, 0.12)",
              borderRadius: "8px",
              padding: "7px 14px",
              color: theme === "dark" ? "#38bdf8" : "#2563eb",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
              outline: "none",
            }}
          >
            <span style={{ fontSize: "0.7rem" }}>▲</span>
            <span>TOP</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating pill to switch to Advanced Cyber Mode */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(12px, 3vw, 24px)",
          left: "clamp(12px, 3vw, 24px)",
          maxWidth: "calc(100vw - 24px)",
          zIndex: 99,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(15, 23, 42, 0.92)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: "999px",
          padding: "5px 12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          fontFamily: "'JetBrains Mono', monospace",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          Classic Mode
        </span>
        <button
          onClick={() => handleSetMode("advanced")}
          style={{
            background: "linear-gradient(135deg, #ff2e5b, #b51239)",
            border: "none",
            color: "#ffffff",
            borderRadius: "999px",
            padding: "4px 12px",
            fontSize: "0.7rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 0 10px rgba(255, 46, 91, 0.4)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ⚡ SWITCH TO 3D SPOTLIGHT MODE
        </button>
      </div>
    </div>
  );
}
