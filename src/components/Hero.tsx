import { useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false });
  const moveSpotlight = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSpotlight({ x: event.clientX - rect.left, y: event.clientY - rect.top, visible: true });
  };
  const mask = `radial-gradient(circle at ${spotlight.x}px ${spotlight.y}px, #000 80px, transparent 145px)`;

  return <section className="otaku-hero" onPointerMove={moveSpotlight} onPointerEnter={() => setSpotlight((v) => ({ ...v, visible: true }))} onPointerLeave={() => setSpotlight((v) => ({ ...v, visible: false }))}>
    <div className="hero-dots" aria-hidden="true" />
    <div className="hero-spotlight" aria-hidden="true" style={{ opacity: spotlight.visible ? 1 : 0, maskImage: mask, WebkitMaskImage: mask }} />
    <div className="hero-orb hero-orb-left" aria-hidden="true" /><div className="hero-orb hero-orb-right" aria-hidden="true" />
    <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:py-28">
      <span className="eyebrow">🇰🇪 Kenya&apos;s fandom home</span>
      <h1 className="gradient-heading mt-5 text-6xl font-black tracking-[-0.05em] sm:text-8xl">Otaku254</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-[var(--otaku-muted)] sm:text-xl">Anime · Manga · K-pop — your culture, your community</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3"><a href="#discover" className="gradient-button">Explore now</a><Link to="/community" className="secondary-button">Join community</Link></div>
      <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">{[["12K+", "Members"], ["850+", "Stories"], ["24/7", "Updates"], ["NBO", "Made in Nairobi"]].map(([value, label]) => <div key={label}><strong className="gradient-heading block text-2xl font-extrabold">{value}</strong><span className="mt-1 block text-xs font-medium text-[var(--otaku-muted)]">{label}</span></div>)}</div>
    </div>
  </section>;
}
