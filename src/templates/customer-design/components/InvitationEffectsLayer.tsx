"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { InvitationEffects, ParticleEffectType } from "../types";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  color: string;
  opacity: number;
  phase: number;
  rise: boolean;
};

const PALETTES: Record<Exclude<ParticleEffectType, "none">, string[]> = {
  petals: ["#E8A0BF", "#F6C6D6", "#C45C7A", "#F3EDE3", "#D48AA8"],
  hearts: ["#C45C7A", "#E07A9A", "#D94B6A", "#F3B5C6"],
  snow: ["#FFFFFF", "#F3EDE3", "#EDE4D5"],
  confetti: ["#2D231F", "#C4B09A", "#C45C7A", "#E8C547", "#7BA3A0", "#F3EDE3"],
  sparkles: ["#F5E6C8", "#FFFFFF", "#E8C547"],
  leaves: ["#8B6B3A", "#C4A35A", "#6B8F4E", "#A67C52"],
  bubbles: ["rgba(255,255,255,0.55)", "rgba(243,237,227,0.45)"],
  stars: ["#F5E6C8", "#FFFFFF", "#EDE4D5"],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function spawn(type: Exclude<ParticleEffectType, "none">, w: number, h: number, fromTop = true): Particle {
  const rise = type === "bubbles" || type === "sparkles" || type === "stars";
  const sizeBase =
    type === "snow" ? 2.2 : type === "confetti" ? 5 : type === "hearts" ? 7 : type === "petals" ? 8 : 6;
  return {
    x: Math.random() * w,
    y: fromTop ? (rise ? h + Math.random() * h : -Math.random() * h) : Math.random() * h,
    vx: (Math.random() - 0.5) * (type === "confetti" ? 1.6 : 0.7),
    vy: rise ? -(0.4 + Math.random() * 0.9) : 0.5 + Math.random() * 1.1,
    size: sizeBase * (0.55 + Math.random() * 0.9),
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.08,
    color: pick(PALETTES[type]),
    opacity: 0.45 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    rise,
  };
}

function drawHeart(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(0, 0, -size, 0, -size, size * 0.35);
  ctx.bezierCurveTo(-size, size * 0.7, 0, size, 0, size);
  ctx.bezierCurveTo(0, size, size, size * 0.7, size, size * 0.35);
  ctx.bezierCurveTo(size, 0, 0, 0, 0, size * 0.3);
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
  }
  ctx.stroke();
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle, type: Exclude<ParticleEffectType, "none">) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.strokeStyle = p.color;
  if (type === "petals" || type === "leaves") {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === "hearts") {
    drawHeart(ctx, p.size);
  } else if (type === "confetti") {
    ctx.fillRect(-p.size * 0.4, -p.size * 0.7, p.size * 0.8, p.size * 1.4);
  } else if (type === "stars" || type === "sparkles") {
    ctx.lineWidth = 1.2;
    drawStar(ctx, p.size);
  } else if (type === "bubbles") {
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = p.opacity * 0.25;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function ParticleCanvas({
  type,
  density,
  width,
  height,
}: {
  type: Exclude<ParticleEffectType, "none">;
  density: number;
  width: number;
  height: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || width < 8 || height < 8) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round(density * (type === "confetti" ? 1.15 : type === "snow" ? 0.9 : 0.7));
    const particles = Array.from({ length: count }, () => spawn(type, width, height, true));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.phase += 0.02;
        p.x += p.vx + Math.sin(p.phase) * (type === "petals" || type === "leaves" ? 0.55 : 0.15);
        p.y += p.vy;
        p.rot += p.vr;
        if (type === "sparkles" || type === "stars") {
          p.opacity = 0.25 + Math.abs(Math.sin(p.phase * 2)) * 0.7;
        }
        if (p.rise) {
          if (p.y < -20) Object.assign(p, spawn(type, width, height, true));
        } else if (p.y > height + 20) {
          Object.assign(p, spawn(type, width, height, true));
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;
        drawParticle(ctx, p, type);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [type, density, width, height]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 24 }}
    />
  );
}

function IntroOverlay({
  effects,
  onDone,
}: {
  effects: InvitationEffects;
  onDone: () => void;
}) {
  const type = effects.intro.type;
  const duration = effects.intro.duration;
  const tap = effects.intro.trigger === "tap" || type === "envelope";
  const [opening, setOpening] = useState(false);

  const finish = useCallback(() => {
    setOpening(true);
    window.setTimeout(onDone, 700);
  }, [onDone]);

  useEffect(() => {
    if (tap) return;
    const startExitAt = Math.max(400, (duration - 0.7) * 1000);
    const t = window.setTimeout(finish, startExitAt);
    return () => clearTimeout(t);
  }, [tap, duration, finish]);

  if (type === "none") return null;

  return (
    <div
      className={`inv-intro inv-intro-${type}${opening ? " is-open" : ""}`}
      style={{ animationDuration: `${duration}s` }}
      onClick={tap ? finish : undefined}
    >
      {type === "envelope" && (
        <>
          <div className="inv-env-body" />
          <div className="inv-env-flap" />
          <div className="inv-env-seal">♥</div>
          <p className="inv-env-hint">{opening ? "" : "Chạm để mở thiệp"}</p>
        </>
      )}
      {type === "curtain" && (
        <>
          <div className="inv-curtain inv-curtain-l" />
          <div className="inv-curtain inv-curtain-r" />
        </>
      )}
      {type === "hearts" && (
        <div className="inv-hearts-burst">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ ["--i" as string]: i }}>
              ♥
            </span>
          ))}
        </div>
      )}
      {tap && type !== "envelope" && !opening && (
        <p className="inv-env-hint">Chạm để xem thiệp</p>
      )}
    </div>
  );
}

export default function InvitationEffectsLayer({
  effects,
  width,
  height,
  autoPlayIntro,
  replayKey = 0,
}: {
  effects: InvitationEffects;
  width: number;
  height: number;
  autoPlayIntro: boolean;
  replayKey?: number;
}) {
  const playIntro =
    effects.intro.type !== "none" && (autoPlayIntro || replayKey > 0);
  const [showIntro, setShowIntro] = useState(playIntro);

  useEffect(() => {
    setShowIntro(effects.intro.type !== "none" && (autoPlayIntro || replayKey > 0));
  }, [autoPlayIntro, replayKey, effects.intro.type]);

  if (effects.intro.type === "none" && effects.particles.type === "none") return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 9990 }}>
      {effects.particles.type !== "none" && width > 0 && height > 0 && (
        <ParticleCanvas
          type={effects.particles.type}
          density={effects.particles.density}
          width={width}
          height={height}
        />
      )}
      {showIntro && (
        <div key={replayKey} className="pointer-events-auto absolute inset-0" style={{ zIndex: 28 }}>
          <IntroOverlay effects={effects} onDone={() => setShowIntro(false)} />
        </div>
      )}
      <style>{INTRO_CSS}</style>
    </div>
  );
}

const INTRO_CSS = `
.inv-intro {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #EDE4D5;
  cursor: pointer;
}
.inv-intro-blur { backdrop-filter: blur(18px); background: rgba(237,228,213,.92); }
.inv-intro-hearts { background: #F3EDE3; }
.inv-intro-envelope, .inv-intro-curtain { background: transparent; }
.inv-intro-fade.is-open { animation: invFadeOut .7s ease forwards; }
.inv-intro-zoom.is-open { animation: invZoomCover .7s cubic-bezier(.2,.8,.2,1) forwards; }
.inv-intro-slide-up.is-open { animation: invSlideCover .7s cubic-bezier(.22,.8,.2,1) forwards; }
.inv-intro-blur.is-open { animation: invBlurCover .7s ease forwards; }
.inv-intro-hearts.is-open { animation: invFadeOut .7s ease forwards; }

.inv-env-body {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #EDE4D5 0%, #D9CDBE 100%);
}
.inv-env-flap {
  position: absolute; left: 0; right: 0; top: 0; height: 46%;
  background: linear-gradient(180deg, #C4B09A 0%, #EDE4D5 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top center;
  transition: transform .7s cubic-bezier(.2,.8,.2,1);
  z-index: 2;
}
.inv-intro-envelope.is-open .inv-env-flap { transform: rotateX(180deg); }
.inv-env-seal {
  position: relative; z-index: 3;
  width: 54px; height: 54px; border-radius: 50%;
  background: #2D231F; color: #F3EDE3;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; box-shadow: 0 8px 20px rgba(45,35,31,.25);
  transition: opacity .4s ease, transform .4s ease;
}
.inv-intro-envelope.is-open .inv-env-seal { opacity: 0; transform: scale(.6); }
.inv-env-hint {
  position: absolute; bottom: 18%; left: 0; right: 0;
  text-align: center; z-index: 3;
  color: #2D231F; font-size: 13px; letter-spacing: .12em;
  text-transform: uppercase; font-weight: 600;
}

.inv-curtain {
  position: absolute; top: 0; bottom: 0; width: 50%;
  background: linear-gradient(90deg, #2D231F, #5C4A3E);
  transition: transform .9s cubic-bezier(.22,.8,.2,1);
}
.inv-curtain-l { left: 0; }
.inv-curtain-r { right: 0; background: linear-gradient(270deg, #2D231F, #5C4A3E); }
.inv-intro-curtain.is-open .inv-curtain-l { transform: translateX(-105%); }
.inv-intro-curtain.is-open .inv-curtain-r { transform: translateX(105%); }
.inv-intro-envelope.is-open,
.inv-intro-curtain.is-open { animation: invFadeOut .45s ease .5s forwards; }
.inv-intro-envelope { perspective: 900px; }

.inv-hearts-burst {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none;
}
.inv-hearts-burst span {
  position: absolute;
  color: #C45C7A;
  font-size: 22px;
  animation: invHeartFly 1.6s ease-out forwards;
  animation-delay: calc(var(--i) * 70ms);
}

@keyframes invFadeOut { to { opacity: 0; visibility: hidden; } }
@keyframes invZoomCover { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.18); } }
@keyframes invSlideCover { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-18%); } }
@keyframes invBlurCover { from { opacity: 1; filter: blur(0); } to { opacity: 0; filter: blur(12px); } }
@keyframes invHeartFly {
  0% { transform: translate(0,0) scale(.4); opacity: 1; }
  100% { transform: translate(calc((var(--i) - 6) * 18px), -90px) scale(1.2); opacity: 0; }
}
`;
