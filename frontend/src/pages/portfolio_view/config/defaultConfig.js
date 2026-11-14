/* ── default portfolio config ── */
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

export const SKILL_CATS = ["Frontend", "Backend", "Database", "DevOps"];

export const CAT_COLORS = {
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

export const LEVEL_PCT = { Expert: 100, Advanced: 80, Intermediate: 60, Beginner: 40 };
