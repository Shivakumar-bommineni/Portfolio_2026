import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ value, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const numValue = parseFloat(value);
  const isFloat = value.includes(".");

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = numValue;
    const duration = 1400; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(isFloat ? parseFloat(start.toFixed(1)) : Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, numValue, isFloat]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function CyberStats() {
  const stats = [
    {
      num: "24",
      suffix: "+",
      label: "PROJECTS & MODULES",
      desc: "LMS, ATS, HRIS & Web Apps",
    },
    {
      num: "3",
      suffix: "+",
      label: "YEARS CODING",
      desc: "Production Full-Stack Experience",
    },
    {
      num: "15",
      suffix: "+",
      label: "TECH MASTERED",
      desc: "React, Node.js, SQL, Next.js, Docker",
    },
    {
      num: "99.9",
      suffix: "%",
      label: "SECURITY RATING",
      desc: "Multi-Session MDM & JWT Rotation",
    },
  ];

  return (
    <section
      style={{
        padding: "0 clamp(24px, 5.5vw, 64px) clamp(40px, 6vw, 60px)",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(135px, 22vw, 260px), 1fr))",
          gap: "clamp(12px, 2.5vw, 20px)",
        }}
      >
        {stats.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{
              y: -6,
              boxShadow: "0 12px 30px rgba(255, 46, 91, 0.35)",
              borderColor: "rgba(255, 46, 91, 0.8)",
            }}
            className="cyber-glass cyber-corner-box"
            style={{
              padding: "clamp(16px, 3vw, 24px) clamp(14px, 2.5vw, 20px)",
              borderRadius: "12px",
              borderTop: "2px solid #ff2e5b",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
            }}
          >
            {/* Ambient top red glow line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, transparent, #ff2e5b, transparent)",
                boxShadow: "0 0 10px #ff2e5b",
              }}
            />

            <div
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                fontWeight: 900,
                color: "#ffffff",
                fontFamily: "'JetBrains Mono', monospace",
                lineHeight: 1,
                marginBottom: "8px",
                display: "flex",
                alignItems: "baseline",
                gap: "2px",
              }}
            >
              <AnimatedCounter value={s.num} suffix={s.suffix} />
              <span style={{ fontSize: "1rem", color: "#ff2e5b" }}>•</span>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(0.68rem, 1.8vw, 0.78rem)",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: "#f1f5f9",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </div>

            <div
              style={{
                fontSize: "clamp(0.72rem, 1.6vw, 0.82rem)",
                color: "#94a3b8",
                lineHeight: 1.35,
              }}
            >
              {s.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
