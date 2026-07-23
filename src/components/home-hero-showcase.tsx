"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const SHOWCASE = [
  {
    name: "Hawthorne",
    note: "Traditional statement",
    href: "/products/hawthorne",
    image: "/products/hawthorne.jpg",
  },
  {
    name: "Meridian",
    note: "Modern essential",
    href: "/products/meridian",
    image: "/products/meridian.jpg",
  },
  {
    name: "Summit",
    note: "Architectural scale",
    href: "/products/summit",
    image: "/products/summit.jpg",
  },
  {
    name: "Briarwood",
    note: "Quietly traditional",
    href: "/products/briarwood",
    image: "/products/briarwood.jpg",
  },
];

export function HomeHeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SHOWCASE[activeIndex];

  return (
    <div className="hero-showcase">
      <div className="hero-showcase-main">
        <Image
          key={active.image}
          src={active.image}
          alt={`${active.name} precast fireplace mantel`}
          fill
          priority
          className="hero-showcase-image"
          sizes="(max-width: 1024px) 100vw, 56vw"
        />
        <div className="hero-showcase-vignette" />
        <div className="hero-showcase-index">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(SHOWCASE.length).padStart(2, "0")}</span>
        </div>
        <div className="hero-showcase-caption">
          <div>
            <p className="eyebrow text-white/65">{active.note}</p>
            <p className="mt-1 font-serif text-3xl text-white">
              The {active.name}
            </p>
          </div>
          <Link
            href={active.href}
            className="round-link"
            aria-label={`View the ${active.name}`}
          >
            <ArrowRight />
          </Link>
        </div>
      </div>

      <div className="hero-showcase-rail" aria-label="Featured mantel profiles">
        {SHOWCASE.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className="hero-showcase-thumb"
            aria-label={`Show the ${item.name}`}
            aria-pressed={activeIndex === index}
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={item.image}
              alt=""
              fill
              className="object-cover"
              sizes="160px"
            />
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <div className="hero-showcase-badge">
        <span>Curated for trade</span>
        <strong>10 profiles</strong>
      </div>
    </div>
  );
}
