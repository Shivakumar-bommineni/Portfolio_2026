import React, { useEffect, useRef } from "react";

export default function CyberCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let centerX = width / 2;
    let centerY = height / 2;
    let targetCenterX = centerX;
    let targetCenterY = centerY;

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      targetCenterX = centerX;
      targetCenterY = centerY;
    };
    window.addEventListener("resize", onResize);

    // Interactive mouse parallax steering
    const onMouseMove = (e) => {
      const offsetX = (e.clientX - width / 2) * 0.12;
      const offsetY = (e.clientY - height / 2) * 0.12;
      targetCenterX = width / 2 + offsetX;
      targetCenterY = height / 2 + offsetY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Scroll-driven warp speed acceleration physics
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Accelerate forward or backward on scroll
      scrollVelocity += delta * 0.22;
      if (scrollVelocity > 50) scrollVelocity = 50;
      if (scrollVelocity < -50) scrollVelocity = -50;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 3D Starfield Particles
    const STAR_COUNT = Math.min(Math.floor(width / 7), 160);
    const MAX_DEPTH = 1500;
    const stars = [];

    const colors = [
      "#ff2e5b", // Neon Crimson
      "#ff4d76", // Bright Scarlet
      "#ff7597", // Soft Ember Pink
      "#ffffff", // Core Star White
      "#e11d48", // Deep Wine Red
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * MAX_DEPTH + 1,
        baseRadius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // Ambient floating cosmic dust motes
    const MOTE_COUNT = 35;
    const motes = [];
    for (let i = 0; i < MOTE_COUNT; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? "#ff2e5b" : "#ff7597",
      });
    }

    // Deep cosmic nebulae clouds
    const nebulae = [
      { x: width * 0.25, y: height * 0.35, r: width * 0.4, angle: 0, speed: 0.001 },
      { x: width * 0.75, y: height * 0.65, r: width * 0.45, angle: Math.PI, speed: 0.0008 },
    ];

    const BASE_SPEED = 2.4;
    let currentSpeed = BASE_SPEED;

    const render = () => {
      try {
        ctx.clearRect(0, 0, width, height);

        // Smoothly steer center toward target (mouse parallax)
        centerX += (targetCenterX - centerX) * 0.05;
        centerY += (targetCenterY - centerY) * 0.05;

        // Smoothly dampen scroll velocity back to baseline cruising
        scrollVelocity *= 0.91;
        currentSpeed = BASE_SPEED + scrollVelocity;

        // ── 1. Deep Cosmic Nebula Glow ──
        for (let i = 0; i < nebulae.length; i++) {
          const neb = nebulae[i];
          if (!neb || neb.r <= 0) continue;
          neb.angle += neb.speed;
          const nx = neb.x + Math.cos(neb.angle) * 40;
          const ny = neb.y + Math.sin(neb.angle) * 40;
          const safeR = Math.max(10, neb.r);
          const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, safeR);
          grad.addColorStop(0, "rgba(255, 46, 91, 0.04)");
          grad.addColorStop(0.5, "rgba(180, 20, 60, 0.015)");
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(nx, ny, safeR, 0, Math.PI * 2);
          ctx.fill();
        }

        // ── 2. Ambient Floating Embers (Layer 1) ──
        for (let i = 0; i < motes.length; i++) {
          const m = motes[i];
          m.x += m.vx;
          m.y += m.vy - scrollVelocity * 0.12;

          if (m.y < -10) m.y = height + 10;
          if (m.y > height + 10) m.y = -10;
          if (m.x < -10) m.x = width + 10;
          if (m.x > width + 10) m.x = -10;

          const safeMoteR = Math.max(0.5, m.radius);
          ctx.save();
          ctx.beginPath();
          ctx.arc(m.x, m.y, safeMoteR, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.globalAlpha = Math.max(0.05, Math.min(1, m.alpha));
          ctx.shadowBlur = safeMoteR * 6;
          ctx.shadowColor = "#ff2e5b";
          ctx.fill();
          ctx.restore();
        }

        // ── 3. 3D Space Starfield Warp (Layer 2) ──
        const focalLength = width * 0.65;
        const isWarping = Math.abs(currentSpeed) > 6;

        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          const prevZ = s.z;

          s.z -= currentSpeed;
          s.twinkle += s.twinkleSpeed;

          if (s.z <= 1) {
            s.z = MAX_DEPTH;
            s.x = (Math.random() - 0.5) * width * 2.2;
            s.y = (Math.random() - 0.5) * height * 2.2;
            continue;
          } else if (s.z > MAX_DEPTH) {
            s.z = 2;
            s.x = (Math.random() - 0.5) * width * 2.2;
            s.y = (Math.random() - 0.5) * height * 2.2;
            continue;
          }

          const safeZ = Math.max(1, s.z);
          const k = focalLength / safeZ;
          const px = s.x * k + centerX;
          const py = s.y * k + centerY;

          if (px < -60 || px > width + 60 || py < -60 || py > height + 60) {
            continue;
          }

          const depthRatio = 1 - safeZ / MAX_DEPTH;
          const safeRadius = Math.max(0.2, Math.min(s.baseRadius * (k * 0.8) + 0.6, 5));
          const twinkleFactor = 0.85 + Math.sin(s.twinkle) * 0.15;
          const alpha = Math.min(1, Math.max(0.12, depthRatio * 1.2 * twinkleFactor));

          ctx.save();

          if (isWarping) {
            // Hyperspace Warp Streak when scrolling!
            const safePrevZ = Math.max(1, prevZ + (currentSpeed >= 0 ? currentSpeed * 1.5 : -15));
            const prevK = focalLength / safePrevZ;
            const prevPx = s.x * prevK + centerX;
            const prevPy = s.y * prevK + centerY;

            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = s.color;
            ctx.lineWidth = Math.min(safeRadius * 1.5, 3.5);
            ctx.globalAlpha = Math.min(1, alpha * 1.3);
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#ff2e5b";
            ctx.stroke();
          } else {
            // Cruising star
            ctx.beginPath();
            ctx.arc(px, py, safeRadius, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = alpha;
            ctx.shadowBlur = safeRadius * 7;
            ctx.shadowColor = s.color === "#ffffff" ? "rgba(255, 255, 255, 0.8)" : "#ff2e5b";
            ctx.fill();

            if (depthRatio > 0.65) {
              ctx.beginPath();
              ctx.arc(px, py, Math.max(0.2, safeRadius * 0.45), 0, Math.PI * 2);
              ctx.fillStyle = "#ffffff";
              ctx.globalAlpha = 0.9;
              ctx.fill();
            }
          }

          ctx.restore();
        }
      } catch (err) {
        // Fail-safe: ensure canvas error never halts render loop
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.92,
      }}
    />
  );
}
