import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { portfolioAPI, contactAPI } from "../services/api";
import PortfolioChat from "../components/PortfolioChat";

/* ── icons ── */
const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
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
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);
const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58C20.56 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
);
const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const ExternalIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const ArrowRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

/* ── default config ── */
export const DEFAULT_CONFIG = {
  hero: {
    name: "Shivakumar Bommineni",
    title: "Full Stack Developer",
    bio: "Building high-performance web applications with Node.js, React.js, and Next.js. Passionate about clean architecture, secure systems, and great developer experiences.",
    handle: "ShivaKumar_B",
    eyebrow: "Available to Work",
    avatarText: "SB",
    avatarUrl: "",
  },
  about: {
    paragraphs: [
      "Hey! I'm Shivakumar Bommineni, a full stack developer with a deep love for building scalable web applications. I specialize in the Node.js + React.js + Next.js ecosystem, with a strong focus on secure backend architectures and smooth frontend experiences.",
      "I enjoy working on challenging problems — from designing real-time systems with Socket.io to implementing robust JWT authentication flows with role-based access control. Every project is an opportunity to learn and ship something great.",
      "When I'm not coding, I'm actively preparing for interviews, tracking learning goals, and contributing to open source. I believe in writing code that's readable, maintainable, and built to last.",
    ],
    highlights: [
      {
        icon: "⚡",
        title: "Backend Engineering",
        desc: "REST APIs, authentication, database design with Node.js & Express.",
      },
      {
        icon: "🎨",
        title: "Frontend Development",
        desc: "Responsive, accessible UIs with React.js, Next.js, and modern CSS.",
      },
      {
        icon: "🔐",
        title: "Security First",
        desc: "JWT, bcrypt, rate limiting, RBAC — security is never an afterthought.",
      },
      {
        icon: "🗃️",
        title: "Database Design",
        desc: "PostgreSQL, MongoDB — schema design, indexing, and query optimization.",
      },
    ],
  },
  skills: [
    { icon: "🌐", name: "HTML5", level: "Expert", cat: "Frontend" },
    { icon: "🎨", name: "CSS3", level: "Expert", cat: "Frontend" },
    { icon: "⚡", name: "JavaScript", level: "Expert", cat: "Frontend" },
    { icon: "⚛️", name: "React.js", level: "Expert", cat: "Frontend" },
    { icon: "▲", name: "Next.js", level: "Advanced", cat: "Frontend" },
    { icon: "🔷", name: "TypeScript", level: "Advanced", cat: "Frontend" },
    { icon: "🟢", name: "Node.js", level: "Expert", cat: "Backend" },
    { icon: "📡", name: "REST APIs", level: "Expert", cat: "Backend" },
    { icon: "🔌", name: "Socket.io", level: "Advanced", cat: "Backend" },
    { icon: "🔐", name: "JWT / Auth", level: "Expert", cat: "Backend" },
    { icon: "🐘", name: "PostgreSQL", level: "Advanced", cat: "Database" },
    { icon: "🍃", name: "MongoDB", level: "Intermediate", cat: "Database" },
    { icon: "🐙", name: "Git/GitHub", level: "Expert", cat: "DevOps" },
    { icon: "🐋", name: "Docker", level: "Intermediate", cat: "DevOps" },
    { icon: "☁️", name: "AWS", level: "Intermediate", cat: "DevOps" },
  ],
  experience: [
    {
      company: "CHRP-INDIA",
      role: "Full Stack Developer",
      startDate: "2026",
      endDate: "Present",
      location: "Hyderabad",
      bullets: [
        "Project: Schneider Electric – Learning Management System (LMS) — Developed & maintained enterprise LMS using React.js, Node.js, Express.js, SQL/PostgreSQL, and REST APIs for Admin, Trainer, Learner, and Super Admin modules.",
        "Engineered backend APIs for courses, assessments, trainer management, notifications, feedback, reporting, dynamic analytics dashboards, and role-based access control with data isolation.",
        "Project: Internal HRIS Application — Built full-stack features using React.js & Node.js for Employee Management, Appraisals, Interview Scheduling, Leave Management, and responsive search/filtering interfaces.",
        "Project: Internal Applicant Tracking System (ATS) — Developed recruitment modules covering candidate management, walk-in validation, interview scheduling, inline DOCX/PDF resume preview, and RBAC visibility (HR Manager, Admin, Recruiter).",
        "Used Git/GitHub for version control and collaborated with development and QA teams following Agile/Scrum practices."
      ],
    },
    {
      company: "Perennial Code IT & Consultant Pvt. Ltd.",
      role: "Full Stack Web Developer",
      startDate: "2025",
      endDate: "2026",
      location: "Hyderabad",
      bullets: [
        "Developed full-stack web applications using React.js, Node.js, Express.js, SQL, MongoDB, HTML, CSS, and JavaScript.",
        "Developed responsive and reusable frontend components using React.js and Bootstrap; integrated frontend with backend REST APIs.",
        "Implemented secure authentication, CRUD operations, form validation, and complex SQL/MySQL and MongoDB database queries.",
        "Collaborated on production web platforms including hospital booking systems (BookMyOT) and e-commerce applications, deploying on Hostinger and cloud platforms.",
        "Tested REST APIs using Postman and managed source code with Git/GitHub following Agile delivery practices."
      ],
    },
    {
      company: "SRNR IT SOLUTIONS PVT LTD",
      role: "MERN Full Stack Intern",
      startDate: "Dec 2024",
      endDate: "Mar 2025",
      location: "Hyderabad, Telangana, India · On-site",
      bullets: [
        "Worked as a MERN Full Stack Intern, gaining hands-on experience in developing and maintaining web applications.",
        "Developed responsive user interfaces using React.js, JavaScript, HTML, CSS."
      ],
    },
    {
      company: "Quality Thought Infosystems",
      role: "MERN Full Stack Web Development Trainee",
      startDate: "Nov 2023",
      endDate: "Apr 2024",
      location: "Hyderabad, Telangana, India · On-site",
      bullets: [
        "Completed intensive MERN Full Stack Web Development training with hands-on experience in building web applications.",
        "Gained hands-on experience in building dynamic web applications using MongoDB, Express.js, React.js, and Node.js."
      ],
    }
  ],
  projects: [
    {
      num: "01",
      title: "BookMyOT – Hospital Booking Platform",
      desc: "Developed a hospital booking platform to streamline scheduling of anesthetists and surgeons for planned and emergency procedures. Built with responsive dashboards and deployed on Hostinger.",
      tags: ["React.js", "SQL", "Node.js", "Hospital Mgmt", "Hostinger"],
      github: "#",
      live: "#",
    },
    {
      num: "02",
      title: "Giivv – E-Commerce Website (PWA)",
      desc: "Developed a responsive e-commerce platform with progressive web app (PWA) features, including cart, wishlist, category filtering, and secure online payment workflows.",
      tags: ["React.js", "PWA", "JavaScript", "E-Commerce", "REST APIs"],
      github: "#",
      live: "#",
    },
    {
      num: "03",
      title: "Smart Visitor Management System with QR Code",
      desc: "Developed a contactless visitor management system using QR code technology. Generates unique visitor passes delivered via WhatsApp and Email for instant, secure gate check-in.",
      tags: ["React.js", "Node.js", "Express.js", "SQL", "QR Code", "WhatsApp API"],
      github: "#",
      live: "#",
    },
  ],
  contact: {
    email: "shivabommineni3@gmail.com",
    github: "https://github.com/shivakumar-bommineni",
    linkedin: "https://www.linkedin.com/in/shivakumar-bommineni-331406292/",
  },
  theme: { primary: "#2563eb", accent: "#7c3aed" },
};

const merge = (def, override) => {
  if (!override) return def;
  const result = { ...def };
  for (const key of Object.keys(override)) {
    if (
      override[key] &&
      typeof override[key] === "object" &&
      !Array.isArray(override[key])
    ) {
      result[key] = merge(def[key] || {}, override[key]);
    } else if (
      override[key] !== undefined &&
      override[key] !== null &&
      override[key] !== ""
    ) {
      result[key] = override[key];
    }
  }
  return result;
};

const scrollTo = (id) =>
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

const SKILL_CATS = ["Frontend", "Backend", "Database", "DevOps"];
const CAT_COLORS = {
  Frontend: {
    bg: "rgba(96,165,250,.12)",
    border: "rgba(96,165,250,.25)",
    color: "#60a5fa",
  },
  Backend: {
    bg: "rgba(167,139,250,.12)",
    border: "rgba(167,139,250,.25)",
    color: "#a78bfa",
  },
  Database: {
    bg: "rgba(52,211,153,.12)",
    border: "rgba(52,211,153,.25)",
    color: "#34d399",
  },
  DevOps: {
    bg: "rgba(251,191,36,.12)",
    border: "rgba(251,191,36,.25)",
    color: "#fbbf24",
  },
};
const LEVEL_PCT = { Expert: 100, Advanced: 80, Intermediate: 60, Beginner: 40 };

export default function Portfolio() {
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [cfg, setCfg] = useState(DEFAULT_CONFIG);
  const [navScrolled, setNavScrolled] = useState(false);

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
      <style>{`
        @keyframes blobFloat {
          0%,100%{ transform:translate(0,0) scale(1); }
          33%{ transform:translate(40px,-40px) scale(1.08); }
          66%{ transform:translate(-30px,25px) scale(.94); }
        }
        @keyframes avatarRing {
          0%,100%{ box-shadow:0 0 0 6px var(--primary-lt),0 0 0 12px rgba(37,99,235,.08); }
          50%{ box-shadow:0 0 0 10px var(--primary-lt),0 0 0 20px rgba(37,99,235,.04); }
        }
        @keyframes badgePulse {
          0%,100%{ opacity:1; transform:scale(1); }
          50%{ opacity:.7; transform:scale(.9); }
        }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(30px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes countUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .pf-hero-left  { animation: slideInLeft  .7s ease both; }
        .pf-hero-right { animation: slideInRight .7s .2s ease both; }
        .pf-stat       { animation: countUp .5s ease both; }
        .pf-stat:nth-child(2){ animation-delay:.1s }
        .pf-stat:nth-child(3){ animation-delay:.2s }
        .skill-card-v2:hover { transform:translateY(-5px)!important; box-shadow: 0 12px 28px -6px rgba(0,0,0,0.12)!important; }
        .proj-card-v2:hover  { transform:translateY(-6px)!important; box-shadow:var(--shadow-lg)!important; }
        .proj-card-v2:hover .proj-top-bar { opacity:1!important; }
        .contact-link-item:hover { transform:translateX(6px)!important; border-color:var(--primary)!important; }
        
        .nav-link-underline { position: relative; display: inline-block; }
        .nav-link-underline::after {
          content: ''; position: absolute; width: 100%; transform: scaleX(0);
          height: 2.5px; bottom: -2px; left: 0; background: var(--primary);
          transform-origin: bottom right; transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          border-radius: 4px;
        }
        .nav-link-underline:hover { color: var(--primary) !important; }
        .nav-link-underline:hover::after { transform: scaleX(1); transform-origin: bottom left; }

        .btn-hero-outline:hover { border-color:var(--primary)!important; background:var(--primary-lt)!important; color:var(--primary)!important; }
        .social-btn-v2:hover { border-color:var(--primary)!important; color:var(--primary)!important; transform:translateY(-3px)!important; }
        .highlight-card-v2:hover { border-color:var(--primary)!important; transform:translateY(-3px)!important; }

        /* ── Traveling Edge Progress Bar & Shimmer Motion ── */
        @keyframes edgeBeamSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes progressShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }

        .edge-beam-card {
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .card-border-beam {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 3;
          overflow: hidden;
          opacity: 0.85;
          transition: opacity 0.3s ease;
        }

        .card-border-beam::before {
          content: '';
          position: absolute;
          top: -150%;
          left: -150%;
          width: 400%;
          height: 400%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 270deg,
            var(--beam-color, var(--primary)) 330deg,
            #ffffff 355deg,
            var(--beam-color, var(--primary)) 360deg
          );
          animation: edgeBeamSpin 4.5s linear infinite;
          pointer-events: none;
        }

        .edge-beam-card:hover .card-border-beam {
          opacity: 1;
        }

        .edge-beam-card:hover .card-border-beam::before {
          animation-duration: 2.2s;
        }

        .progress-shimmer-highlight {
          position: absolute;
          inset: 0;
          width: 60%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.75) 50%,
            transparent 100%
          );
          animation: progressShimmer 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
        }

        .skill-card-v2:hover .skill-icon-badge {
          transform: scale(1.1) rotate(4deg);
        }

        /* ── Hero Centerpiece Animations ── */
        @keyframes sbCardFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(1.2deg);
          }
        }

        @keyframes auraGlow {
          0%, 100% {
            opacity: 0.35;
            transform: scale(1);
            filter: blur(35px);
          }
          50% {
            opacity: 0.68;
            transform: scale(1.12);
            filter: blur(48px);
          }
        }

        @keyframes radarPulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.75);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }

        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes badgeFloat1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }

        @keyframes badgeFloat2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(7px); }
        }

        .hero-grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(var(--border) 1.2px, transparent 1.2px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 85%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 85%);
          pointer-events: none;
          opacity: 0.65;
        }

        .hero-tech-pill {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-tech-pill:hover {
          transform: translateY(-3px) scale(1.05);
          border-color: var(--primary) !important;
          color: var(--primary) !important;
          box-shadow: 0 8px 18px -4px rgba(37,99,235,0.22);
        }

        .hero-stat-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--primary) !important;
          box-shadow: 0 10px 24px -6px rgba(37,99,235,0.25);
        }

        @media (prefers-reduced-motion: reduce) {
          .card-border-beam::before,
          .progress-shimmer-highlight,
          .pf-hero-right > div {
            animation: none !important;
          }
        }
      `}</style>

      {/* ─── NAV ─── */}
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
          <div
            className="p-nav-links"
            style={{ display: "flex", gap: "1.75rem" }}
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
            <button className="theme-btn" onClick={toggle} title="Toggle theme">
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="login-btn" onClick={() => navigate("/login")}>
              Owner Login
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        style={{
          minHeight: "100vh",
          paddingTop: "var(--nav-h)",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle developer grid pattern */}
        <div className="hero-grid-pattern" aria-hidden="true" />

        {/* Ambient top light beam */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: 400,
            top: 0,
            left: 0,
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(37,99,235,0.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Animated dynamic atmospheric blobs */}
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(37,99,235,.15), transparent 70%)",
            top: -200,
            right: -150,
            pointerEvents: "none",
            animation: "blobFloat 9s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 550,
            height: 550,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,58,237,.14), transparent 70%)",
            bottom: -100,
            left: -100,
            pointerEvents: "none",
            animation: "blobFloat 12s ease-in-out infinite reverse",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(16,185,129,.10), transparent 70%)",
            top: "40%",
            left: "35%",
            pointerEvents: "none",
            animation: "blobFloat 15s ease-in-out infinite",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1140,
            margin: "0 auto",
            padding: "4.5rem 2rem",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: "4rem",
            }}
          >
            {/* Left Column */}
            <div className="pf-hero-left">
              {/* Status badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".55rem",
                  background: "rgba(16,185,129,.12)",
                  border: "1px solid rgba(16,185,129,.3)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius: 100,
                  padding: ".4rem 1.1rem",
                  marginBottom: "1.5rem",
                  fontSize: ".78rem",
                  fontWeight: 700,
                  color: "var(--success)",
                  boxShadow: "0 2px 10px rgba(16,185,129,0.12)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--success)",
                    boxShadow: "0 0 10px var(--success)",
                    animation: "radarPulse 2s ease-in-out infinite",
                  }}
                />
                {hero.eyebrow}
              </div>

              {/* Name */}
              <h1
                style={{
                  fontSize: "clamp(2.5rem,5.5vw,4.25rem)",
                  fontWeight: 950,
                  letterSpacing: "-2px",
                  lineHeight: 1.06,
                  marginBottom: ".75rem",
                }}
              >
                {hero.name.includes(" ") ? (
                  <>
                    <span style={{ color: "var(--text)" }}>
                      {hero.name.split(" ")[0]}
                    </span>
                    <br />
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary) 0%, var(--accent) 60%, #ec4899 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {hero.name.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                ) : (
                  hero.name
                )}
              </h1>

              {/* Role */}
              <div
                style={{
                  fontSize: "clamp(1.15rem,2vw,1.45rem)",
                  fontWeight: 700,
                  color: "var(--text-sec)",
                  marginBottom: "1.25rem",
                  letterSpacing: "-.02em",
                }}
              >
                {hero.title}
              </div>

              {/* Authentic Developer Terminal Prompt */}
              <div
                style={{
                  fontFamily:
                    "'SF Mono','Fira Code','Cascadia Code',ui-monospace,monospace",
                  fontSize: ".875rem",
                  color: "var(--text-muted)",
                  marginBottom: "1.75rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".75rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: ".55rem 1rem",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  />
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />
                </div>
                <div
                  style={{ height: 14, width: 1, background: "var(--border)" }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".45rem",
                  }}
                >
                  <span style={{ color: "var(--success)", fontWeight: 700 }}>
                    ~
                  </span>
                  <span style={{ color: "var(--primary)" }}>$</span>
                  <span>whoami</span>
                  <span style={{ color: "var(--accent)", fontWeight: 700 }}>
                    {hero.handle}
                  </span>
                  <span
                    style={{
                      width: 2,
                      height: 14,
                      background: "var(--primary)",
                      display: "inline-block",
                      animation: "cursorBlink 1s infinite",
                    }}
                  />
                </div>
              </div>

              <p
                style={{
                  fontSize: "1.05rem",
                  color: "var(--text-sec)",
                  maxWidth: 520,
                  lineHeight: 1.8,
                  marginBottom: "2.25rem",
                }}
              >
                {hero.bio}
              </p>

              {/* CTAs */}
              <div
                style={{
                  display: "flex",
                  gap: ".875rem",
                  flexWrap: "wrap",
                  marginBottom: "2.5rem",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => scrollTo("projects")}
                  style={{
                    padding: ".85rem 2.25rem",
                    fontSize: ".95rem",
                    boxShadow: "0 8px 24px -4px rgba(37,99,235,0.45)",
                  }}
                >
                  View My Work <ArrowRight />
                </button>
                <button
                  className="btn-hero-outline"
                  onClick={() => scrollTo("contact")}
                  style={{
                    padding: ".85rem 2.25rem",
                    fontSize: ".95rem",
                    fontWeight: 700,
                    border: "2px solid var(--border)",
                    borderRadius: "var(--radius)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    cursor: "pointer",
                    transition: "all .2s cubic-bezier(0.16, 1, 0.3, 1)",
                    fontFamily: "inherit",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  Let's Talk
                </button>
              </div>

              {/* Stats row with interactive cards */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {[
                  { num: "3+", label: "Years Coding" },
                  { num: "10+", label: "Projects Built" },
                  { num: "5+", label: "Tech Mastered" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="hero-stat-card edge-beam-card pf-stat"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 14,
                      padding: ".85rem 1.25rem",
                      minWidth: 115,
                      position: "relative",
                      "--beam-color": "var(--primary)",
                    }}
                  >
                    <div className="card-border-beam" aria-hidden="true" />
                    <div
                      style={{
                        fontSize: "1.65rem",
                        fontWeight: 950,
                        letterSpacing: "-.5px",
                        background: "var(--grad)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        lineHeight: 1.1,
                        marginBottom: ".25rem",
                      }}
                    >
                      {s.num}
                    </div>
                    <div
                      style={{
                        fontSize: ".74rem",
                        color: "var(--text-muted)",
                        fontWeight: 700,
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column — Animated Centerpiece Avatar */}
            <div
              className="pf-hero-right"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.65rem",
                position: "relative",
              }}
            >
              {/* Floating Main Avatar Assembly */}
              <div
                style={{
                  position: "relative",
                  animation: "sbCardFloat 6s ease-in-out infinite",
                }}
              >
                {/* Animated Radial Aura Glow */}
                <div
                  style={{
                    position: "absolute",
                    inset: -24,
                    borderRadius: 50,
                    background: "var(--grad)",
                    animation: "auraGlow 5s ease-in-out infinite",
                    zIndex: 0,
                  }}
                />

                {/* Floating Satellite Chip 1 (Top Left): "⚡ Fast & Scalable" */}
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    left: -32,
                    zIndex: 10,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    padding: ".35rem .75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: ".4rem",
                    fontSize: ".72rem",
                    fontWeight: 800,
                    color: "var(--text)",
                    boxShadow: "var(--shadow)",
                    animation: "badgeFloat1 4s ease-in-out infinite",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span style={{ color: "#f59e0b" }}>⚡</span> High Performance
                </div>

                {/* Floating Satellite Chip 2 (Bottom Left): "🔐 JWT & RBAC" */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: -40,
                    zIndex: 10,
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    padding: ".35rem .75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: ".4rem",
                    fontSize: ".72rem",
                    fontWeight: 800,
                    color: "var(--text)",
                    boxShadow: "var(--shadow)",
                    animation: "badgeFloat2 5s ease-in-out infinite",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  <span style={{ color: "var(--primary)" }}>🔐</span> JWT & RBAC
                </div>

                {/* The SB Card Itself */}
                <div
                  className="edge-beam-card"
                  style={{
                    width: 250,
                    height: 250,
                    borderRadius: 36,
                    background:
                      "linear-gradient(145deg, #1d4ed8 0%, #2563eb 35%, #7c3aed 70%, #9333ea 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 2,
                    overflow: "hidden",
                    boxShadow:
                      "0 24px 60px -12px rgba(37,99,235,0.45), 0 0 0 1px rgba(255,255,255,0.18) inset",
                    "--beam-color": "#ffffff",
                  }}
                >
                  {/* Traveling edge border beam */}
                  <div className="card-border-beam" aria-hidden="true" />

                  {/* Specular glass reflection diagonal sheen */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.02) 45%, transparent 100%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Decorative developer watermark in card corner */}
                  <div
                    style={{
                      position: "absolute",
                      top: 14,
                      left: 18,
                      fontFamily: "monospace",
                      fontSize: ".7rem",
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.35)",
                      letterSpacing: ".08em",
                    }}
                  >
                    {"<dev:portfolio />"}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 16,
                      left: 18,
                      fontFamily: "monospace",
                      fontSize: ".65rem",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    {"v2026.1"}
                  </div>

                  {hero.avatarUrl ? (
                    <img
                      src={hero.avatarUrl}
                      alt={hero.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: "5.5rem",
                        fontWeight: 950,
                        letterSpacing: "-2px",
                        color: "#ffffff",
                        userSelect: "none",
                        textShadow: "0 8px 30px rgba(0,0,0,0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                      }}
                    >
                      {hero.avatarText || "SB"}
                    </div>
                  )}

                  {/* "Open to Work" Live Beacon Pill */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 14,
                      right: 14,
                      zIndex: 4,
                      background: "rgba(15, 23, 42, 0.85)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(16, 185, 129, 0.45)",
                      borderRadius: 100,
                      padding: ".3rem .75rem",
                      display: "flex",
                      alignItems: "center",
                      gap: ".45rem",
                      fontSize: ".72rem",
                      fontWeight: 800,
                      color: "#34d399",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#10b981",
                        animation: "radarPulse 2s ease-in-out infinite",
                      }}
                    />
                    Open to Work
                  </div>
                </div>
              </div>

              {/* Social Links Row */}
              <div
                style={{
                  display: "flex",
                  gap: ".875rem",
                  marginTop: ".25rem",
                }}
              >
                {[
                  {
                    href: contact.github,
                    icon: <GithubIcon />,
                    title: "GitHub",
                  },
                  {
                    href: contact.linkedin,
                    icon: <LinkedInIcon />,
                    title: "LinkedIn",
                  },
                  {
                    href: `mailto:${contact.email}`,
                    icon: <MailIcon />,
                    title: "Email",
                  },
                ].map((s) => (
                  <a
                    key={s.title}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-btn-v2"
                    title={s.title}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      border: "1.5px solid var(--border)",
                      background: "var(--surface)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-sec)",
                      textDecoration: "none",
                      transition: "all .2s cubic-bezier(0.16, 1, 0.3, 1)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>

              {/* Interactive Tech Stack Capsules */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: ".45rem",
                  justifyContent: "center",
                  maxWidth: 290,
                }}
              >
                {skills.slice(0, 6).map((s) => (
                  <span
                    key={s.name}
                    className="hero-tech-pill"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      padding: ".3rem .7rem",
                      fontSize: ".75rem",
                      fontWeight: 700,
                      color: "var(--text-sec)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: ".35rem",
                      cursor: "default",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                    }}
                  >
                    <span>{s.icon}</span> {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".35rem",
            color: "var(--text-muted)",
            fontSize: ".72rem",
            fontWeight: 600,
            animation: "blobFloat 2.5s ease-in-out infinite",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
            }}
          >
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
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

      {/* ─── SKILLS ─── */}
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
            const catSkills = skills.filter((s) => s.cat === cat);
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
                    gap: "1rem",
                  }}
                >
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

      {/* ─── EXPERIENCE ─── */}
      {experience?.length > 0 && (
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
      )}

      {/* ─── PROJECTS ─── */}
      <section className="section" id="projects">
        <div className="container">
          <div className="sec-head">
            <div className="sec-tag">Projects</div>
            <h2 className="sec-title">Featured Work</h2>
            <p className="sec-sub">
              Selected projects showcasing my skills in full stack development.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))",
              gap: "1.5rem",
            }}
          >
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

      {/* ─── CONTACT ─── */}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "start",
            }}
          >
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

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
          padding: "2.5rem 0",
        }}
      >
        <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            <a
              href="#hero"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                textDecoration: "none",
                color: "inherit",
              }}
              className="p-nav-brand"
            >
              <div
                className="sb-mark"
                style={{
                  width: 42,
                  height: 42,
                  fontSize: ".9rem",
                  borderRadius: 12,
                }}
              >
                <span className="sb-mark-text">{hero.avatarText || "SB"}</span>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".55rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: "1.06rem",
                      letterSpacing: "-0.3px",
                      color: "var(--text)",
                    }}
                  >
                    ShivaKumar<span className="p-brand-accent">_B</span>
                  </span>
                  <span className="p-brand-badge" style={{ fontSize: ".68rem", padding: "2px 8px" }}>
                    <span className="p-brand-pulse" />
                    Full Stack Dev
                  </span>
                </div>
                <div
                  style={{
                    fontSize: ".76rem",
                    color: "var(--text-muted)",
                    marginTop: ".2rem",
                    fontWeight: 500,
                  }}
                >
                  {hero.name} · Full Stack Developer · {new Date().getFullYear()}
                </div>
              </div>
            </a>
            <div
              style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
            >
              {[
                ["About", "about"],
                ["Skills", "skills"],
                ["Projects", "projects"],
                ["Contact", "contact"],
              ].map(([l, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: ".8rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    transition: "color .15s",
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: ".625rem" }}>
              {[contact.github, contact.linkedin].map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    border: "1.5px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "all .15s",
                  }}
                >
                  {i === 0 ? <GithubIcon /> : <LinkedInIcon />}
                </a>
              ))}
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: ".75rem",
            }}
          >
            <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} {hero.name}. All rights reserved.
            </span>
            <span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>
              Built with React.js + Node.js · Powered by Ollama AI
            </span>
          </div>
        </div>
      </footer>

      <PortfolioChat />
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");
    try {
      await contactAPI.send(form);
      setStatus("sent");
    } catch (err) {
      setErrMsg(
        err?.response?.data?.message || "Failed to send. Please try again.",
      );
      setStatus("error");
    }
  };

  if (status === "sent")
    return (
      <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: ".75rem" }}>✅</div>
        <div
          style={{ fontWeight: 900, fontSize: "1.1rem", marginBottom: ".4rem" }}
        >
          Message sent!
        </div>
        <div
          style={{
            fontSize: ".875rem",
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Thanks for reaching out. I'll get back to you at{" "}
          <strong>{form.email}</strong> soon.
        </div>
        <button
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", email: "", message: "" });
          }}
          className="btn btn-ghost"
          style={{ marginTop: "1.25rem" }}
        >
          Send another →
        </button>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: ".875rem" }}
    >
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Your Name</label>
        <input
          className="form-input"
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          className="form-input"
          placeholder="john@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Message</label>
        <textarea
          className="form-textarea"
          placeholder="Tell me about your project or opportunity…"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>
      {status === "error" && (
        <div
          style={{
            background: "rgba(239,68,68,.1)",
            color: "#ef4444",
            borderRadius: 8,
            padding: ".625rem .875rem",
            fontSize: ".82rem",
            fontWeight: 600,
          }}
        >
          {errMsg}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
        style={{ width: "100%", padding: ".8rem", fontSize: ".925rem" }}
      >
        {status === "sending" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}
