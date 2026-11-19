import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CyberPreloader({ onFinish }) {
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsDone(true), 250);
          setTimeout(() => onFinish && onFinish(), 950);
          return 100;
        }
        const step = Math.floor(Math.random() * 7) + 3;
        return Math.min(100, prev + step);
      });
    }, 28);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: isDone ? "none" : "auto",
        fontFamily: "'JetBrains Mono', monospace",
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Top Shutter Door (Slides UP on complete) */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isDone ? "-100%" : 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "#060609",
          borderBottom: "2px solid #ff2e5b",
          boxShadow: isDone ? "none" : "0 4px 30px rgba(255, 46, 91, 0.7)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "8px",
        }}
      >
        {/* Top Left Counter */}
        <div
          style={{
            position: "absolute",
            top: "clamp(16px, 4vw, 36px)",
            left: "clamp(16px, 4vw, 36px)",
            display: "flex",
            alignItems: "baseline",
            gap: "4px",
          }}
        >
          <span
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-2px",
              color: "#ffffff",
              textShadow: "0 0 25px rgba(255, 46, 91, 0.5)",
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
              color: "#ff2e5b",
              fontWeight: 800,
            }}
          >
            %
          </span>
        </div>

        {/* Skip button top right */}
        <button
          onClick={() => {
            setIsDone(true);
            setTimeout(() => onFinish && onFinish(), 500);
          }}
          style={{
            position: "absolute",
            top: "clamp(16px, 4vw, 36px)",
            right: "clamp(16px, 4vw, 36px)",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            padding: "6px 14px",
            borderRadius: "999px",
            fontSize: "clamp(0.68rem, 1.8vw, 0.75rem)",
            letterSpacing: "1px",
            cursor: "pointer",
            transition: "all 0.2s",
            zIndex: 10,
          }}
        >
          SKIP ✕
        </button>

        {/* Top half center text */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "880px",
            padding: "0 16px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "clamp(0.68rem, 1.8vw, 0.82rem)",
              letterSpacing: "clamp(2px, 0.8vw, 4px)",
              color: "#ff2e5b",
              marginBottom: "8px",
              fontWeight: 700,
            }}
          >
            // LOADING SHIVAKUMAR_B · PORTFOLIO
          </div>
          <h1
            style={{
              fontSize: "clamp(1.3rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "1px",
              lineHeight: 1.25,
              textTransform: "uppercase",
              color: "#ffffff",
              margin: 0,
            }}
          >
            THE DEVELOPER WHO TURNS IDEAS
          </h1>
        </div>
      </motion.div>

      {/* Bottom Shutter Door (Slides DOWN on complete) */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: isDone ? "100%" : 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "#060609",
          borderTop: "2px solid #ff2e5b",
          boxShadow: isDone ? "none" : "0 -4px 30px rgba(255, 46, 91, 0.7)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: "8px",
        }}
      >
        {/* Bottom half center text with glowing red box around SOFTWARE */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "880px",
            padding: "0 16px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.3rem, 4vw, 2.8rem)",
              fontWeight: 900,
              letterSpacing: "1px",
              lineHeight: 1.25,
              textTransform: "uppercase",
              color: "#ffffff",
              margin: 0,
            }}
          >
            INTO{" "}
            <span
              style={{
                color: "#ffffff",
                background: "linear-gradient(135deg, #ff2e5b, #b51239)",
                padding: "2px 14px",
                borderRadius: "6px",
                boxShadow: "0 0 30px rgba(255, 46, 91, 0.8), inset 0 0 10px rgba(255,255,255,0.3)",
                display: "inline-block",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              SOFTWARE
            </span>
          </h1>

          <div
            style={{
              marginTop: "clamp(12px, 3vw, 20px)",
              fontSize: "clamp(0.68rem, 1.8vw, 0.78rem)",
              color: "#94a3b8",
              letterSpacing: "1px",
            }}
          >
            SYSTEM STATUS:{" "}
            <span style={{ color: count === 100 ? "#10b981" : "#ff2e5b" }}>
              {count === 100 ? "READY" : "LOADING PORTFOLIO..."}
            </span>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(340px, 85vw)",
            height: "4px",
            background: "rgba(255, 255, 255, 0.08)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${count}%`,
              background: "linear-gradient(90deg, #ff2e5b, #ff7192)",
              boxShadow: "0 0 15px #ff2e5b",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
