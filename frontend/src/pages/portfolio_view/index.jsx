import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { portfolioAPI } from "../../services/api";
import PortfolioChat from "../../components/portfolio_chat";

// Config & Helpers
import { DEFAULT_CONFIG } from "./config/defaultConfig";
import { merge, scrollTo } from "./config/helpers";

// Styles
import PortfolioStyles from "./styles/PortfolioStyles";

// Sections
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";
import Footer from "./sections/Footer";

export { DEFAULT_CONFIG };

export default function PortfolioView() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cfg, setCfg] = useState(DEFAULT_CONFIG);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Shivakumar Bommineni · Full Stack Developer";
    portfolioAPI
      .getPublic()
      .then((res) => {
        if (res.data.config) setCfg(merge(DEFAULT_CONFIG, res.data.config));
      })
      .catch(() => {});

    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (cfg.theme?.primary) {
      document.documentElement.style.setProperty(
        "--primary",
        cfg.theme.primary,
      );
      document.documentElement.style.setProperty(
        "--primary-dk",
        cfg.theme.primary,
      );
      document.documentElement.style.setProperty(
        "--accent",
        cfg.theme.accent || "#7c3aed",
      );
      document.documentElement.style.setProperty(
        "--grad",
        `linear-gradient(135deg, ${cfg.theme.primary}, ${cfg.theme.accent || "#7c3aed"})`,
      );
    }
  }, [cfg.theme]);

  const { hero, about, skills, experience, projects, contact } = cfg;

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
    </div>
  );
}
