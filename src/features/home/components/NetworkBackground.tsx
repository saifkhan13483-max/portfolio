import { useEffect, useRef } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  layer: number;
  connections: number[];
  energy: number;
  energyDir: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  layer: number;
}

interface EnergyStream {
  nodeA: number;
  nodeB: number;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useDarkMode();
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let nodes: Node[] = [];
    let particles: Particle[] = [];
    let streams: EnergyStream[] = [];
    let W = 0, H = 0;

    function resize() {
      if (!canvas) return;
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * window.devicePixelRatio;
      canvas.height = H * window.devicePixelRatio;
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio);
      init();
    }

    function init() {
      nodes = [];
      particles = [];
      streams = [];

      const count = Math.min(60, Math.floor((W * H) / 18000) + 20);

      for (let i = 0; i < count; i++) {
        const layer = Math.random();
        const xBias = Math.random() < 0.65
          ? W * 0.4 + Math.random() * W * 0.65
          : Math.random() * W;
        nodes.push({
          x: xBias,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25 * (0.4 + layer * 0.6),
          vy: (Math.random() - 0.5) * 0.2 * (0.4 + layer * 0.6),
          radius: 1.5 + Math.random() * 3 * layer,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.018,
          layer,
          connections: [],
          energy: Math.random(),
          energyDir: Math.random() > 0.5 ? 1 : -1,
        });
      }

      buildConnections();
      spawnStreams();
    }

    function buildConnections() {
      const maxDist = W * 0.22;
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].connections = [];
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            nodes[i].connections.push(j);
          }
        }
      }
    }

    function spawnStreams() {
      streams = [];
      const eligible: Array<[number, number]> = [];
      for (let i = 0; i < nodes.length; i++) {
        for (const j of nodes[i].connections) {
          if (nodes[i].layer > 0.3 || nodes[j].layer > 0.3) {
            eligible.push([i, j]);
          }
        }
      }
      const streamCount = Math.min(14, eligible.length);
      for (let k = 0; k < streamCount; k++) {
        const pair = eligible[Math.floor(Math.random() * eligible.length)];
        streams.push({
          nodeA: pair[0],
          nodeB: pair[1],
          progress: Math.random(),
          speed: 0.002 + Math.random() * 0.004,
          size: 1.5 + Math.random() * 2,
          opacity: 0.4 + Math.random() * 0.5,
        });
      }
    }

    function spawnParticle() {
      const startX = W * 0.3 + Math.random() * W * 0.75;
      const layer = 0.3 + Math.random() * 0.7;
      particles.push({
        x: startX,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.15 - Math.random() * 0.4,
        life: 0,
        maxLife: 120 + Math.random() * 200,
        size: 0.6 + Math.random() * 1.6 * layer,
        layer,
      });
    }

    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      const dark = isDarkRef.current;

      ctx.clearRect(0, 0, W, H);

      frame++;
      if (frame % 3 === 0 && particles.length < 80) spawnParticle();

      const primaryH = dark ? 221 : 217;
      const primaryS = dark ? 83 : 91;
      const primaryL = dark ? 53 : 60;
      const accentH = dark ? 180 : 195;
      const violetH = dark ? 265 : 255;

      function hsl(h: number, s: number, l: number, a: number) {
        return `hsla(${h},${s}%,${l}%,${a})`;
      }

      const gridOpacity = dark ? 0.025 : 0.04;
      const gridSize = 64;
      ctx.save();
      ctx.strokeStyle = hsl(primaryH, primaryS, primaryL, gridOpacity);
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += gridSize) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (let gy = 0; gy < H; gy += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }
      ctx.restore();

      const maxDist = W * 0.22;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        for (const j of n.connections) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = 1 - dist / maxDist;
          const depthFade = (n.layer + m.layer) / 2;

          const baseAlpha = dark
            ? proximity * depthFade * 0.35
            : proximity * depthFade * 0.18;

          if (baseAlpha < 0.01) continue;

          const grad = ctx.createLinearGradient(n.x, n.y, m.x, m.y);
          if (Math.random() < 0.002) {
            grad.addColorStop(0, hsl(accentH, 90, dark ? 65 : 55, baseAlpha * 2));
            grad.addColorStop(1, hsl(primaryH, primaryS, primaryL, baseAlpha));
          } else {
            grad.addColorStop(0, hsl(primaryH, primaryS, primaryL, baseAlpha));
            grad.addColorStop(1, hsl(primaryH, primaryS - 10, primaryL + 5, baseAlpha * 0.4));
          }

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = 0.5 + depthFade * 0.8;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      for (const st of streams) {
        st.progress += st.speed;
        if (st.progress > 1) {
          st.progress = 0;
          const eligible: Array<[number, number]> = [];
          for (let i = 0; i < nodes.length; i++) {
            for (const j of nodes[i].connections) {
              eligible.push([i, j]);
            }
          }
          if (eligible.length > 0) {
            const pair = eligible[Math.floor(Math.random() * eligible.length)];
            st.nodeA = pair[0];
            st.nodeB = pair[1];
          }
        }

        const nA = nodes[st.nodeA];
        const nB = nodes[st.nodeB];
        if (!nA || !nB) continue;

        const sx = nA.x + (nB.x - nA.x) * st.progress;
        const sy = nA.y + (nB.y - nA.y) * st.progress;
        const depthFade = (nA.layer + nB.layer) / 2;
        const alpha = st.opacity * depthFade * (dark ? 0.9 : 0.6);

        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, st.size * 4);
        const useAccent = st.progress < 0.5 ? accentH : primaryH;
        glow.addColorStop(0, hsl(useAccent, 90, dark ? 70 : 60, alpha));
        glow.addColorStop(0.4, hsl(useAccent, 80, dark ? 65 : 55, alpha * 0.5));
        glow.addColorStop(1, hsl(useAccent, 70, dark ? 60 : 50, 0));

        ctx.save();
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, st.size * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hsl(useAccent, 95, dark ? 80 : 70, alpha);
        ctx.beginPath();
        ctx.arc(sx, sy, st.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulsePhase += n.pulseSpeed;
        n.energy += n.energyDir * 0.004;
        if (n.energy > 1 || n.energy < 0) n.energyDir *= -1;

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -50) n.x = W + 50;
        if (n.x > W + 50) n.x = -50;
        if (n.y < -50) n.y = H + 50;
        if (n.y > H + 50) n.y = -50;

        const pulse = 0.6 + 0.4 * Math.sin(n.pulsePhase);
        const baseR = n.radius * (0.8 + 0.4 * n.layer);
        const glowR = baseR * (3 + 3 * pulse * n.energy);
        const alpha = (0.25 + 0.6 * n.layer * pulse) * (dark ? 1 : 0.7);

        const isHub = n.connections.length > 4;
        const nodeH = isHub ? accentH : primaryH;
        const nodeS = isHub ? 90 : primaryS;
        const nodeL = dark ? (isHub ? 70 : primaryL) : (isHub ? 55 : primaryL - 5);

        const outerGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR * 2);
        outerGlow.addColorStop(0, hsl(nodeH, nodeS, nodeL, alpha * 0.5));
        outerGlow.addColorStop(0.5, hsl(nodeH, nodeS - 10, nodeL, alpha * 0.15));
        outerGlow.addColorStop(1, hsl(nodeH, nodeS, nodeL, 0));

        ctx.save();
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const innerGlow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        innerGlow.addColorStop(0, hsl(nodeH, nodeS, dark ? nodeL + 15 : nodeL, alpha));
        innerGlow.addColorStop(0.6, hsl(nodeH, nodeS, nodeL, alpha * 0.5));
        innerGlow.addColorStop(1, hsl(nodeH, nodeS, nodeL, 0));

        ctx.save();
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.fillStyle = hsl(nodeH, nodeS, dark ? nodeL + 20 : nodeL + 5, Math.min(1, alpha + 0.3));
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseR * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      particles = particles.filter((p) => p.life < p.maxLife);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const t = p.life / p.maxLife;
        const fadeIn = Math.min(1, t * 6);
        const fadeOut = 1 - Math.pow(t, 2);
        const alpha = fadeIn * fadeOut * p.layer * (dark ? 0.7 : 0.4);

        const particleH = Math.random() < 0.3 ? accentH : primaryH;
        const particleL = dark ? 70 : 55;

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, hsl(particleH, 80, particleL, alpha));
        glow.addColorStop(1, hsl(particleH, 80, particleL, 0));

        ctx.save();
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hsl(particleH, 90, dark ? 85 : 65, alpha * 0.9);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const waveCount = dark ? 3 : 2;
      for (let w = 0; w < waveCount; w++) {
        const waveProgress = ((frame * 0.003 + w * 0.33) % 1);
        const waveX = W * 0.3 + waveProgress * W * 0.8;
        const waveAlpha = dark
          ? Math.sin(waveProgress * Math.PI) * 0.035
          : Math.sin(waveProgress * Math.PI) * 0.018;
        const waveH = w % 2 === 0 ? primaryH : accentH;

        ctx.save();
        const waveGrad = ctx.createRadialGradient(waveX, H * 0.5, 0, waveX, H * 0.5, H * 0.7);
        waveGrad.addColorStop(0, hsl(waveH, 80, dark ? 60 : 55, waveAlpha));
        waveGrad.addColorStop(0.5, hsl(waveH, 70, dark ? 55 : 50, waveAlpha * 0.4));
        waveGrad.addColorStop(1, hsl(waveH, 60, dark ? 50 : 45, 0));
        ctx.fillStyle = waveGrad;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (dark) {
        const cornerGlow = ctx.createRadialGradient(W, 0, 0, W, 0, W * 0.6);
        cornerGlow.addColorStop(0, hsl(violetH, 70, 40, 0.07));
        cornerGlow.addColorStop(0.5, hsl(primaryH, 80, 35, 0.04));
        cornerGlow.addColorStop(1, hsl(primaryH, 80, 30, 0));
        ctx.save();
        ctx.fillStyle = cornerGlow;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();

        const bottomGlow = ctx.createRadialGradient(W, H, 0, W, H, W * 0.5);
        bottomGlow.addColorStop(0, hsl(accentH, 80, 35, 0.05));
        bottomGlow.addColorStop(1, hsl(accentH, 80, 30, 0));
        ctx.save();
        ctx.fillStyle = bottomGlow;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      if (dark && frame % 180 === 0) {
        buildConnections();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: isDark ? 1 : 0.85 }}
      aria-hidden="true"
    />
  );
}
