"use client";

import Link from "next/link";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { HERO_IMAGE } from "@/lib/data";

/**
 * The living-silk hero. In the reference this is not a WebGL cursor-lamp
 * shader, it is a full-bleed photo behind an SVG turbulence/displacement
 * filter (the ripple) plus a handful of CSS keyframe animations (flicker,
 * a diagonal light sweep, an ember glow). All of it already collapses
 * under prefers-reduced-motion via the global rule in globals.css; the
 * ripple filter class is additionally only applied here when motion is
 * allowed, and there is a fully static image as the base in all cases.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="mug-hero"
      style={{
        position: "relative",
        background:
          "radial-gradient(120% 130% at 64% 18%, #20131A 0%, #160A0F 64%, #100709 100%)",
        overflow: "hidden",
      }}
    >
      <svg width={0} height={0} style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="mugSilkRipple" x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.014"
              numOctaves={2}
              seed={7}
              result="n"
            />
            <feDisplacementMap in="SourceGraphic" in2="n" xChannelSelector="R" yChannelSelector="G" scale={9}>
              <animate attributeName="scale" values="6;13;6" dur="8s" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>

      <div
        className="mug-rays mug-hide-m"
        style={{
          position: "absolute",
          top: "-10%",
          left: "30%",
          width: "60%",
          height: "120%",
          background:
            "linear-gradient(102deg, rgba(233,199,102,0) 42%, rgba(233,199,102,.13) 50%, rgba(233,199,102,0) 58%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div className="mug-herosilk" style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "53%", overflow: "hidden", zIndex: 1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed hero art, not a Next/Image managed size */}
        <img
          className={reduced ? undefined : "mug-silk-ripple"}
          src={HERO_IMAGE}
          alt="Mugdha silk drape in lamplight"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
            filter: "saturate(1.22) contrast(1.05) brightness(1.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(82% 86% at 52% 46%, rgba(16,7,9,0) 0%, rgba(16,7,9,.14) 62%, rgba(16,7,9,.42) 100%)",
            zIndex: 2,
          }}
        />
        <div
          className="mug-flicker"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(54% 58% at 50% 44%, rgba(233,199,102,.34), rgba(224,138,30,.12) 52%, transparent 76%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
        <div
          className="mug-flicker"
          style={{
            position: "absolute",
            left: "38%",
            bottom: "6%",
            width: "60%",
            height: "42%",
            background: "radial-gradient(circle, rgba(224,138,30,.2), transparent 70%)",
            mixBlendMode: "screen",
            pointerEvents: "none",
            zIndex: 2,
            animationDelay: "2s",
          }}
        />
        <div
          className="mug-spec"
          style={{
            position: "absolute",
            top: "-20%",
            left: 0,
            width: "30%",
            height: "140%",
            background:
              "linear-gradient(90deg, rgba(233,199,102,0), rgba(233,199,102,.5), rgba(255,247,224,.18), rgba(233,199,102,0))",
            mixBlendMode: "screen",
            filter: "blur(7px)",
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
      </div>

      <div
        className="mug-flicker mug-hide-m"
        style={{
          position: "absolute",
          left: "8%",
          top: "24%",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "#E9C766",
          boxShadow: "0 0 24px 8px rgba(224,138,30,.5)",
          zIndex: 2,
        }}
      />
      <div
        className="mug-flicker mug-hide-m"
        style={{
          position: "absolute",
          left: "40%",
          top: "64%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "#E9C766",
          boxShadow: "0 0 20px 6px rgba(224,138,30,.45)",
          animationDelay: "1.4s",
          zIndex: 2,
        }}
      />

      <div
        className="mug-smoke"
        style={{
          position: "absolute",
          left: "-12%",
          bottom: "-30%",
          width: "46%",
          height: "80%",
          background: "radial-gradient(circle, rgba(120,86,40,.22), transparent 70%)",
          filter: "blur(26px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div
        className="mug-hide-m"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "47%",
          width: "1px",
          background: "linear-gradient(#C9A227,#7a5e1e)",
          zIndex: 4,
        }}
      />
      <span
        className="mug-hide-m"
        style={{
          position: "absolute",
          left: "47%",
          marginLeft: "-30px",
          top: "50%",
          transform: "translateY(-50%) rotate(180deg)",
          writingMode: "vertical-rl",
          fontSize: "10px",
          letterSpacing: ".44em",
          color: "#C9A227",
          textTransform: "uppercase",
          zIndex: 4,
        }}
      >
        Silk Mark · Pure Zari
      </span>

      <div
        className="mug-herowrap"
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: "none",
          margin: 0,
          padding: "56px 40px 56px clamp(24px,4vw,72px)",
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "30px" }}>
          <span
            style={{
              display: "inline-block",
              fontWeight: 500,
              fontSize: "11px",
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: "#A8884E",
            }}
          >
            Living silk · woven in house
          </span>
        </div>
        <div style={{ position: "relative", maxWidth: "52%" }}>
          <h1
            className="mug-hh1"
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontWeight: 400,
              fontSize: "clamp(38px,6.2vw,84px)",
              lineHeight: 1.06,
              letterSpacing: ".004em",
              color: "#F4EFE3",
              textWrap: "balance",
              textShadow: "0 2px 30px rgba(0,0,0,.55)",
            }}
          >
            Timeless South Indian{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              elegance
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: ".03em",
                  height: ".07em",
                  background: "#C9A227",
                }}
              />
            </span>
          </h1>
          <p
            style={{
              margin: "26px 0 0",
              maxWidth: "34ch",
              fontSize: "16px",
              lineHeight: 1.75,
              color: "rgba(244,239,227,.82)",
              textShadow: "0 1px 18px rgba(0,0,0,.6)",
            }}
          >
            Heritage silk, matched to you. Choose the silk, the colour and the motif, and we show
            you the Mugdha sarees that fit.
          </p>
          <Link
            href="/find"
            prefetch={false}
            style={{
              display: "inline-block",
              marginTop: "34px",
              border: "1px solid #C9A227",
              background: "rgba(201,162,39,.14)",
              color: "#F4EFE3",
              cursor: "pointer",
              fontWeight: 500,
              letterSpacing: ".06em",
              fontSize: "14px",
              padding: "16px 38px",
              borderRadius: "2px",
              backdropFilter: "blur(2px)",
              textDecoration: "none",
            }}
          >
            Find your drape
          </Link>
        </div>
      </div>
    </section>
  );
}
