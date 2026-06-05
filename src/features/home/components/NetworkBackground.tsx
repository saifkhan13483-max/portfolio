import { useEffect, useRef } from "react";
import { useDarkMode } from "@/hooks/use-dark-mode";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  depth: number;        // 0 = far/dim, 1 = close/bright
  isHub: boolean;
  isMega: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  energy: number;
  energyDir: number;
  ringAngle: number;
  connectionCount: number;
}

interface Packet {
  from: number; to: number;
  t: number; speed: number;
  hue: number;
  size: number;
  trail: { x: number; y: number }[];
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number; depth: number; hue: number;
}

interface ScanLine {
  y: number; speed: number; alpha: number;
}

interface Hex {
  cx: number; cy: number;
  r: number; angle: number;
  rotSpeed: number; alpha: number; depth: number;
}

const TAU = Math.PI * 2;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hsla(h: number, s: number, l: number, a: number) {
  return `hsla(${h},${s}%,${l}%,${Math.max(0, Math.min(1, a))})`;
}

function rand(min = 0, max = 1) { return min + Math.random() * (max - min); }

function hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, angle: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = angle + (i / 6) * TAU;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDark = useDarkMode();
  const darkRef = useRef(isDark);
  useEffect(() => { darkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let W = 0, H = 0;
    let nodes: Node[] = [];
    let adj: number[][] = [];
    let packets: Packet[] = [];
    let particles: Particle[] = [];
    let scanLines: ScanLine[] = [];
    let hexes: Hex[] = [];
    let frame = 0;
    let raf = 0;

    // ── Colour palette ──────────────────────────────────────────────────────
    function pal(dark: boolean) {
      return {
        pH: dark ? 217 : 214,   pS: dark ? 91 : 82,   pL: dark ? 62 : 50,   // primary blue
        aH: dark ? 186 : 188,   aS: dark ? 90 : 78,   aL: dark ? 60 : 44,   // accent cyan
        vH: dark ? 262 : 258,   vS: dark ? 83 : 72,   vL: dark ? 62 : 52,   // violet
        gridA: dark ? 0.032 : 0.052,
        edgeA: dark ? 0.42  : 0.24,
        nodeA: dark ? 1.0   : 0.88,
        scanA: dark ? 0.022 : 0.012,
        waveA: dark ? 0.034 : 0.018,
        hexA:  dark ? 0.055 : 0.032,
        triA:  dark ? 0.035 : 0.016,
      };
    }

    // ── Initialise ──────────────────────────────────────────────────────────
    function init() {
      nodes = []; adj = []; packets = []; particles = []; scanLines = []; hexes = [];

      const count = Math.max(32, Math.min(62, Math.floor((W * H) / 13000)));

      for (let i = 0; i < count; i++) {
        const depth = Math.pow(rand(), 0.5);            // bias toward foreground
        const speed = rand(0.04, 0.08) + depth * 0.18;
        const angle = rand(0, TAU);
        // Cluster complexity toward right 70% and top-right corner
        const xBias = rand() < 0.72
          ? rand(W * 0.25, W * 1.05)
          : rand(0, W);
        nodes.push({
          x: xBias, y: rand(0, H),
          vx: Math.cos(angle) * speed - 0.12,
          vy: Math.sin(angle) * speed,
          depth, isHub: false, isMega: false,
          pulsePhase: rand(0, TAU),
          pulseSpeed: rand(0.010, 0.028),
          energy: rand(), energyDir: 1,
          ringAngle: rand(0, TAU),
          connectionCount: 0,
        });
      }

      buildGraph();

      // Decorative hexagons (static, depth-layered)
      const hexPositions = [
        { cx: W * 0.92, cy: H * 0.12, r: 55, depth: 0.7 },
        { cx: W * 0.82, cy: H * 0.72, r: 38, depth: 0.5 },
        { cx: W * 0.98, cy: H * 0.55, r: 70, depth: 0.35 },
        { cx: W * 0.65, cy: H * 0.08, r: 28, depth: 0.55 },
        { cx: W * 0.55, cy: H * 0.90, r: 42, depth: 0.45 },
      ];
      for (const h of hexPositions) {
        hexes.push({ ...h, angle: rand(0, TAU), rotSpeed: rand(0.0003, 0.0012), alpha: h.depth });
      }

      // Scan lines
      for (let i = 0; i < 5; i++) {
        scanLines.push({ y: rand(0, H), speed: rand(0.18, 0.55), alpha: rand(0.3, 1) });
      }

      // Initial packets
      for (let i = 0; i < 12; i++) spawnPacket();
    }

    function buildGraph() {
      const maxD = W * 0.23;
      adj = nodes.map(() => []);
      for (const n of nodes) n.connectionCount = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < maxD * maxD) {
            adj[i].push(j); adj[j].push(i);
            nodes[i].connectionCount++; nodes[j].connectionCount++;
          }
        }
      }
      for (const n of nodes) {
        n.isHub = n.connectionCount >= 4;
        n.isMega = n.connectionCount >= 7;
      }
    }

    function spawnPacket() {
      if (packets.length >= 22) return;
      for (let a = 0; a < 30; a++) {
        const from = Math.floor(rand(0, nodes.length));
        const nb = adj[from];
        if (!nb?.length) continue;
        const to = nb[Math.floor(rand(0, nb.length))];
        const hues = [217, 217, 186, 262, 186];
        packets.push({
          from, to, t: rand(),
          speed: rand(0.0025, 0.006),
          hue: hues[Math.floor(rand(0, hues.length))],
          size: rand(1.8, 3.4),
          trail: [],
        });
        return;
      }
    }

    function spawnParticle() {
      if (particles.length >= 80) return;
      const depth = rand(0.35, 1);
      particles.push({
        x: rand(W * 0.2, W * 1.1), y: rand(H * 0.05, H),
        vx: rand(-0.3, 0.3), vy: rand(-0.45, -0.1),
        life: 0, maxLife: rand(150, 280),
        size: rand(0.6, 2.0) * depth, depth,
        hue: rand() < 0.35 ? 186 : 217,
      });
    }

    // ── Main draw loop ───────────────────────────────────────────────────────
    function draw() {
      if (!canvas) return;
      ctx.clearRect(0, 0, W, H);
      frame++;
      const dark = darkRef.current;
      const p = pal(dark);

      // Spawn
      if (frame % 3 === 0)  spawnParticle();
      if (frame % 60 === 0) spawnPacket();

      // ── BG volumetric glows ─────────────────────────────────────────────
      if (dark) {
        // Top-right spotlight cone
        const sg = ctx.createRadialGradient(W * 0.88, -H * 0.05, 0, W * 0.88, -H * 0.05, H * 1.1);
        sg.addColorStop(0,   hsla(p.vH, 60, 45, 0.10));
        sg.addColorStop(0.3, hsla(p.pH, 70, 38, 0.06));
        sg.addColorStop(0.7, hsla(p.pH, 60, 32, 0.02));
        sg.addColorStop(1,   hsla(p.pH, 50, 28, 0));
        ctx.save(); ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H); ctx.restore();

        // Bottom-right warm pool
        const bg2 = ctx.createRadialGradient(W * 0.8, H * 0.9, 0, W * 0.8, H * 0.9, W * 0.55);
        bg2.addColorStop(0,   hsla(p.aH, 80, 32, 0.07));
        bg2.addColorStop(0.6, hsla(p.aH, 70, 28, 0.02));
        bg2.addColorStop(1,   hsla(p.aH, 60, 24, 0));
        ctx.save(); ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H); ctx.restore();
      }

      // ── Fine grid ───────────────────────────────────────────────────────
      {
        const gs = 52;
        ctx.save();
        ctx.strokeStyle = hsla(p.pH, p.pS, p.pL, p.gridA);
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        for (let x = 0; x <= W; x += gs) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
        for (let y = 0; y <= H; y += gs) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
        ctx.stroke();
        ctx.restore();

        // Diagonal accent line (top-right corner region)
        ctx.save();
        ctx.strokeStyle = hsla(p.aH, p.aS, p.aL, p.gridA * 0.6);
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        for (let x = 0; x <= W * 1.2; x += gs * 1.73) {
          ctx.moveTo(x, 0); ctx.lineTo(x - H * 0.4, H);
        }
        ctx.stroke();
        ctx.restore();
      }

      // ── Scan lines ─────────────────────────────────────────────────────
      for (const sl of scanLines) {
        sl.y += sl.speed;
        if (sl.y > H) sl.y = -2;
        const sg = ctx.createLinearGradient(0, sl.y - 1.5, 0, sl.y + 1.5);
        sg.addColorStop(0,   hsla(p.aH, 80, 60, 0));
        sg.addColorStop(0.5, hsla(p.aH, 90, 65, p.scanA * sl.alpha));
        sg.addColorStop(1,   hsla(p.aH, 80, 60, 0));
        ctx.save();
        ctx.fillStyle = sg;
        ctx.fillRect(W * 0.2, sl.y - 1.5, W * 0.85, 3);
        ctx.restore();
      }

      // ── Hexagonal decorative outlines ──────────────────────────────────
      for (const h of hexes) {
        h.angle += h.rotSpeed;
        ctx.save();
        hexPath(ctx, h.cx, h.cy, h.r, h.angle);
        ctx.strokeStyle = hsla(p.pH, p.pS, p.pL + 10, p.hexA * h.depth * (dark ? 1 : 0.7));
        ctx.lineWidth = 0.7;
        ctx.stroke();

        // inner hex
        hexPath(ctx, h.cx, h.cy, h.r * 0.6, h.angle + Math.PI / 6);
        ctx.strokeStyle = hsla(p.aH, p.aS, p.aL, p.hexA * h.depth * 0.5 * (dark ? 1 : 0.6));
        ctx.lineWidth = 0.4;
        ctx.stroke();
        ctx.restore();
      }

      // ── Wave pulses ─────────────────────────────────────────────────────
      for (let w = 0; w < 3; w++) {
        const prog = ((frame * 0.0020 + w * 0.335) % 1);
        const wx = W * 0.22 + prog * W * 0.9;
        const wa = Math.sin(prog * Math.PI) * p.waveA;
        const wH = w === 1 ? p.aH : p.pH;
        const wg = ctx.createRadialGradient(wx, H * 0.48, 0, wx, H * 0.48, H * 0.8);
        wg.addColorStop(0,   hsla(wH, 82, dark ? 60 : 52, wa));
        wg.addColorStop(0.45, hsla(wH, 72, dark ? 54 : 48, wa * 0.32));
        wg.addColorStop(1,   hsla(wH, 62, dark ? 48 : 44, 0));
        ctx.save(); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, H); ctx.restore();
      }

      // ── Move nodes ─────────────────────────────────────────────────────
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -70) n.x = W + 70;  if (n.x > W + 70) n.x = -70;
        if (n.y < -70) n.y = H + 70;  if (n.y > H + 70) n.y = -70;
        n.pulsePhase += n.pulseSpeed;
        n.energy += n.energyDir * 0.005;
        if (n.energy > 1 || n.energy < 0) n.energyDir *= -1;
        if (n.isMega || n.isHub) n.ringAngle += 0.004 * n.depth;
      }

      // ── Triangles (atmospheric fill between nearby triplets) ────────────
      const maxD2 = (W * 0.23) * (W * 0.23);
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        for (const j of adj[i]) {
          if (j <= i) continue;
          const nj = nodes[j];
          for (const k of adj[i]) {
            if (k <= j || !adj[j].includes(k)) continue;
            const nk = nodes[k];
            const depth = (ni.depth + nj.depth + nk.depth) / 3;
            if (depth < 0.3) continue;
            const alpha = depth * depth * p.triA;
            if (alpha < 0.004) continue;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y); ctx.lineTo(nj.x, nj.y); ctx.lineTo(nk.x, nk.y);
            ctx.closePath();
            ctx.fillStyle = hsla(p.pH, 70, dark ? 62 : 54, alpha);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // ── Edges (curved bezier) ───────────────────────────────────────────
      const maxD = W * 0.23;
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        for (const j of adj[i]) {
          if (j <= i) continue;
          const nj = nodes[j];
          const dx = ni.x - nj.x, dy = ni.y - nj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const prox = 1 - dist / maxD;
          const depth = (ni.depth + nj.depth) * 0.5;
          const alpha = prox * depth * p.edgeA;
          if (alpha < 0.008) continue;

          // Subtle bezier curve control point
          const mx = (ni.x + nj.x) * 0.5 + (nj.y - ni.y) * 0.08;
          const my = (ni.y + nj.y) * 0.5 - (nj.x - ni.x) * 0.08;

          const useAccent = ni.isHub && nj.isHub;
          const eH = useAccent ? p.aH : p.pH;
          const eL = dark ? p.pL + 2 : p.pL - 8;

          const gg = ctx.createLinearGradient(ni.x, ni.y, nj.x, nj.y);
          gg.addColorStop(0,   hsla(eH, p.pS + 5, eL + 6, alpha));
          gg.addColorStop(0.5, hsla(eH, p.pS,     eL + 10, alpha * 1.15));
          gg.addColorStop(1,   hsla(eH, p.pS - 8, eL - 4, alpha * 0.38));

          ctx.save();
          ctx.strokeStyle = gg;
          ctx.lineWidth = 0.35 + depth * 1.1;
          ctx.beginPath();
          ctx.moveTo(ni.x, ni.y);
          ctx.quadraticCurveTo(mx, my, nj.x, nj.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // ── Nodes ──────────────────────────────────────────────────────────
      for (const n of nodes) {
        const pulse = 0.55 + 0.45 * Math.sin(n.pulsePhase);
        const coreR = (n.isMega ? 4.5 : n.isHub ? 3.2 : 1.6) * (0.7 + 0.5 * n.depth);
        const glowR  = coreR * (dark ? 5 + 3 * pulse * n.energy : 4 + 2 * pulse);
        const alpha  = p.nodeA * (0.28 + 0.72 * n.depth * pulse);

        const hH = n.isMega ? p.vH : n.isHub ? p.aH : p.pH;
        const hS = n.isMega ? p.vS + 5 : n.isHub ? p.aS + 5 : p.pS;
        const hL = dark
          ? (n.isMega ? p.vL + 15 : n.isHub ? p.aL + 12 : p.pL + 8)
          : (n.isMega ? p.vL - 4  : n.isHub ? p.aL - 5  : p.pL - 8);

        // Wide aura
        const aura = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR * 2.5);
        aura.addColorStop(0,   hsla(hH, hS, hL, alpha * 0.20));
        aura.addColorStop(0.5, hsla(hH, hS, hL, alpha * 0.07));
        aura.addColorStop(1,   hsla(hH, hS, hL, 0));
        ctx.save(); ctx.fillStyle = aura;
        ctx.beginPath(); ctx.arc(n.x, n.y, glowR * 2.5, 0, TAU); ctx.fill(); ctx.restore();

        // Inner glow
        const ig = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        ig.addColorStop(0,   hsla(hH, hS, dark ? hL + 22 : hL + 2, alpha * 0.90));
        ig.addColorStop(0.5, hsla(hH, hS, hL, alpha * 0.48));
        ig.addColorStop(1,   hsla(hH, hS, hL, 0));
        ctx.save(); ctx.fillStyle = ig;
        ctx.beginPath(); ctx.arc(n.x, n.y, glowR, 0, TAU); ctx.fill(); ctx.restore();

        // Core dot
        ctx.save();
        ctx.fillStyle = hsla(hH, hS, dark ? hL + 28 : hL + 6, Math.min(1, alpha + 0.2));
        ctx.beginPath(); ctx.arc(n.x, n.y, coreR * pulse, 0, TAU); ctx.fill(); ctx.restore();

        // Hub: rotating dashed ring
        if (n.isHub) {
          ctx.save();
          ctx.strokeStyle = hsla(hH, hS, hL + 5, alpha * 0.42 * pulse);
          ctx.lineWidth = 0.75;
          ctx.setLineDash([3, 5]);
          ctx.lineDashOffset = -n.ringAngle * 30;
          ctx.beginPath(); ctx.arc(n.x, n.y, coreR * 2.8 * pulse, 0, TAU); ctx.stroke();
          ctx.restore();
        }

        // Mega: extra solid outer ring
        if (n.isMega) {
          ctx.save();
          ctx.strokeStyle = hsla(hH, hS, hL + 10, alpha * 0.28 * pulse);
          ctx.lineWidth = 0.9;
          ctx.setLineDash([5, 8]);
          ctx.lineDashOffset = n.ringAngle * 20;
          ctx.beginPath(); ctx.arc(n.x, n.y, coreR * 4.5 * pulse, 0, TAU); ctx.stroke();
          ctx.restore();
        }
      }

      // ── Packets (with glowing trails) ──────────────────────────────────
      packets = packets.filter(pk => {
        const nA = nodes[pk.from], nB = nodes[pk.to];
        if (!nA || !nB) return false;

        pk.t += pk.speed;
        const x = nA.x + (nB.x - nA.x) * pk.t;
        const y = nA.y + (nB.y - nA.y) * pk.t;

        pk.trail.unshift({ x, y });
        if (pk.trail.length > 20) pk.trail.length = 20;

        // Trail
        for (let ti = 1; ti < pk.trail.length; ti++) {
          const ta = (1 - ti / pk.trail.length);
          const width = pk.size * ta * 0.9;
          if (width < 0.1) continue;
          ctx.save();
          ctx.strokeStyle = hsla(pk.hue, 88, dark ? 68 : 58, ta * 0.55 * (dark ? 0.85 : 0.5));
          ctx.lineWidth = width;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(pk.trail[ti - 1].x, pk.trail[ti - 1].y);
          ctx.lineTo(pk.trail[ti].x,     pk.trail[ti].y);
          ctx.stroke();
          ctx.restore();
        }

        // Orb glow
        const oD = (nA.depth + nB.depth) * 0.5;
        const oG = ctx.createRadialGradient(x, y, 0, x, y, pk.size * 6);
        oG.addColorStop(0,   hsla(pk.hue, 92, dark ? 74 : 62, 0.72 * oD));
        oG.addColorStop(0.4, hsla(pk.hue, 82, dark ? 66 : 56, 0.25 * oD));
        oG.addColorStop(1,   hsla(pk.hue, 72, dark ? 58 : 50, 0));
        ctx.save(); ctx.fillStyle = oG;
        ctx.beginPath(); ctx.arc(x, y, pk.size * 6, 0, TAU); ctx.fill(); ctx.restore();

        // Orb core
        ctx.save();
        ctx.fillStyle = hsla(pk.hue, 96, dark ? 88 : 70, Math.min(1, 0.7 * oD + 0.3));
        ctx.beginPath(); ctx.arc(x, y, pk.size * 0.85, 0, TAU); ctx.fill(); ctx.restore();

        if (pk.t >= 1) {
          const next = adj[pk.to];
          if (next?.length) {
            pk.from = pk.to;
            pk.to   = next[Math.floor(rand(0, next.length))];
            pk.t    = 0; pk.trail = [];
          } else return false;
        }
        return true;
      });

      // ── Particles ──────────────────────────────────────────────────────
      particles = particles.filter(pt => pt.life < pt.maxLife);
      for (const pt of particles) {
        pt.x += pt.vx; pt.y += pt.vy; pt.life++;
        const t = pt.life / pt.maxLife;
        const fade = Math.min(1, t * 9) * (1 - Math.pow(t, 1.7));
        const al = fade * pt.depth * (dark ? 0.70 : 0.42);
        if (al < 0.01) continue;

        const cL = dark ? 68 : 55;
        const pg = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size * 3.5);
        pg.addColorStop(0,   hsla(pt.hue, 84, cL, al));
        pg.addColorStop(0.5, hsla(pt.hue, 76, cL - 4, al * 0.35));
        pg.addColorStop(1,   hsla(pt.hue, 68, cL - 8, 0));
        ctx.save(); ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size * 3.5, 0, TAU); ctx.fill();
        ctx.fillStyle = hsla(pt.hue, 92, dark ? cL + 20 : cL + 6, Math.min(1, al + 0.15));
        ctx.beginPath(); ctx.arc(pt.x, pt.y, pt.size * 0.6, 0, TAU); ctx.fill();
        ctx.restore();
      }

      // Periodic graph rebuild (nodes drift apart/together)
      if (frame % 280 === 0) buildGraph();

      raf = requestAnimationFrame(draw);
    }

    // ── Resize ─────────────────────────────────────────────────────────────
    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      W = el.offsetWidth; H = el.offsetHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width  = W * dpr;
      el.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: isDark ? 1 : 0.88 }}
      aria-hidden="true"
    />
  );
}
