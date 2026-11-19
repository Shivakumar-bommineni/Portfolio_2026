import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CyberStyles from "./CyberStyles";
import CyberCanvas from "./components/CyberCanvas";
import CyberPreloader from "./components/CyberPreloader";
import CyberNavbar from "./components/CyberNavbar";
import CyberHero from "./sections/CyberHero";
import CyberStats from "./sections/CyberStats";
import CyberProjects from "./sections/CyberProjects";
import CyberAbout from "./sections/CyberAbout";
import CyberServices from "./sections/CyberServices";
import CyberSkills from "./sections/CyberSkills";
import CyberExperience from "./sections/CyberExperience";
import CyberContact from "./sections/CyberContact";
import CyberFooter from "./sections/CyberFooter";
import PortfolioChat from "../../../components/portfolio_chat";

export default function AdvancedPortfolioView({ cfg, onSwitchToNormal, user, navigate, theme = "dark", toggle }) {
  // Enforce obsidian dark background on body so no white background can ever show in advanced view
  useEffect(() => {
    const prevBodyBg = document.body.style.backgroundColor;
    const prevHtmlBg = document.documentElement.style.backgroundColor;
    document.body.style.backgroundColor = "#06060a";
    document.documentElement.style.backgroundColor = "#06060a";
    return () => {
      document.body.style.backgroundColor = prevBodyBg;
      document.documentElement.style.backgroundColor = prevHtmlBg;
    };
  }, []);

  // Always trigger the dramatic 1-100 cinematic preloader on load
  const [showPreloader, setShowPreloader] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (~420px)
      setShowScrollTop(window.scrollY > 420);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePreloaderFinish = () => {
    setShowPreloader(false);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { hero = {}, about = {}, skills = [], experience = [], projects = [], contact = {} } = cfg || {};

  return (
    <div className="cyber-root">
      <CyberStyles />
      <CyberCanvas />

      {/* Cinematic 0-100 Shutter Split Preloader (Video 00:00 - 00:01) */}
      {showPreloader && <CyberPreloader onFinish={handlePreloaderFinish} />}

      {/* Cyber HUD Navbar with Owner Access, Theme Toggle & Dynamic Scroll-to-Top */}
      <CyberNavbar
        scrollTo={scrollTo}
        onSwitchToNormal={onSwitchToNormal}
        user={user}
        navigate={navigate}
        showScrollTop={showScrollTop}
        theme={theme}
        toggle={toggle}
      />

      {/* Hero Section with 3D Tilt Card & Scroll-Splitting Animation (Video 00:02 - 00:11) */}
      <CyberHero hero={hero} contact={contact} scrollTo={scrollTo} />

      {/* Stats Counter Strip (Revealed through the hero split) */}
      <CyberStats />

      {/* 3D Perspective Card Showcase & Projects Grid (Video 00:12 - 00:18) */}
      <CyberProjects projects={projects} />

      {/* About Me Section with Interactive Tabs */}
      <CyberAbout about={about} />

      {/* Services & Pricing Section (Video 00:25 - 00:28) */}
      <CyberServices scrollTo={scrollTo} />

      {/* Technical Skills & 3D Glass Tech Stack Cards (Video 00:29 - 00:32) */}
      <CyberSkills skills={skills} />

      {/* Experience Timeline */}
      <CyberExperience experience={experience} />

      {/* Cyber Contact Section (Video 00:33 - 00:38) */}
      <CyberContact contact={contact} hero={hero} />

      {/* Cyber Footer */}
      <CyberFooter onSwitchToNormal={onSwitchToNormal} />

      {/* Interactive Cyber AI Chatbot with Holographic Animations */}
      <PortfolioChat isCyber={true} />

      {/* Floating Animated Screen "▲ TOP" Button (Appears when scrolled past hero, like AI button) */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255, 46, 91, 0.85)" }}
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
              background: "rgba(18, 10, 20, 0.92)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 46, 91, 0.6)",
              borderRadius: "8px",
              padding: "7px 14px",
              color: "#ff2e5b",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(255, 46, 91, 0.35)",
              outline: "none",
            }}
          >
            <span style={{ fontSize: "0.7rem", color: "#ff2e5b" }}>▲</span>
            <span>TOP</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating HUD Controls on bottom-left */}
      <div
        style={{
          position: "fixed",
          bottom: "clamp(12px, 3vw, 24px)",
          left: "clamp(12px, 3vw, 24px)",
          maxWidth: "calc(100vw - 24px)",
          zIndex: 99,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(10, 8, 16, 0.92)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 46, 91, 0.45)",
          borderRadius: "999px",
          padding: "5px 12px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 46, 91, 0.3)",
          fontFamily: "'JetBrains Mono', monospace",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#ff2e5b",
            boxShadow: "0 0 10px #ff2e5b",
          }}
        />
        <span style={{ fontSize: "0.72rem", color: "#f8fafc", fontWeight: 800 }}>
          ⚡ 3D SPOTLIGHT
        </span>

        {/* Quick HUD TOP shortcut when scrolled */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, width: 0 }}
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              exit={{ opacity: 0, scale: 0.8, width: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title="Scroll to Top"
              style={{
                background: "rgba(255, 46, 91, 0.2)",
                border: "1px solid rgba(255, 46, 91, 0.6)",
                color: "#ff2e5b",
                borderRadius: "999px",
                padding: "3px 10px",
                fontSize: "0.68rem",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "0.65rem" }}>▲</span>
              <span>TOP</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Replay intro button */}
        <button
          onClick={() => setShowPreloader(true)}
          title="Replay 0-100 cinematic intro"
          style={{
            background: "rgba(255, 46, 91, 0.15)",
            border: "1px solid rgba(255, 46, 91, 0.4)",
            color: "#ff4d76",
            borderRadius: "999px",
            padding: "3px 8px",
            fontSize: "0.68rem",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          REPLAY ⟳
        </button>

        {/* Switch to normal mode */}
        <button
          onClick={onSwitchToNormal}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#ffffff",
            borderRadius: "999px",
            padding: "3px 10px",
            fontSize: "0.68rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ffffff";
            e.currentTarget.style.color = "#000000";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.color = "#ffffff";
          }}
        >
          CLASSIC ✦
        </button>
      </div>
    </div>
  );
}
