'use client'

import { motion } from "framer-motion";

/** An open, empty cardboard-style box drawn in SVG, used on the 404 / error screens. */
export function EmptyBoxScene({ tone = "gold" }: { tone?: "gold" | "red" }) {
    const accent = tone === "red" ? "#f87171" : "#F6CF45";
    return (
        <svg viewBox="0 0 240 200" className="mx-auto h-auto w-56 overflow-visible sm:w-64" aria-hidden>
            <defs>
                <linearGradient id="ebs-front" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#1d1d1d" />
                    <stop offset="100%" stopColor="#0b0b0b" />
                </linearGradient>
                <radialGradient id="ebs-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>
            </defs>
            <ellipse cx="120" cy="182" rx="90" ry="12" fill="#000" opacity="0.7" />
            <ellipse cx="120" cy="96" rx="110" ry="70" fill="url(#ebs-glow)" />
            {/* inside of the box */}
            <polygon points="60,80 120,52 180,80 120,108" fill="#060606" stroke={accent} strokeOpacity="0.35" />
            {/* left & right walls */}
            <polygon points="60,80 120,108 120,176 60,148" fill="url(#ebs-front)" stroke={accent} strokeOpacity="0.4" />
            <polygon points="180,80 120,108 120,176 180,148" fill="#0a0a0a" stroke={accent} strokeOpacity="0.4" />
            {/* open flaps */}
            <motion.polygon
                points="60,80 120,108 92,128 32,100"
                fill="#151515"
                stroke={accent}
                strokeOpacity="0.5"
                style={{ originX: "60px", originY: "80px" }}
                animate={{ rotate: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.polygon
                points="180,80 120,108 148,128 208,100"
                fill="#121212"
                stroke={accent}
                strokeOpacity="0.5"
                animate={{ rotate: [0, 6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
            <polygon points="60,80 120,52 96,34 36,62" fill="#131313" stroke={accent} strokeOpacity="0.45" />
            <polygon points="180,80 120,52 144,34 204,62" fill="#101010" stroke={accent} strokeOpacity="0.45" />
            {/* label */}
            <g transform="translate(74 118) skewY(25)">
                <rect width="36" height="22" rx="2" fill="#f3efe4" />
                <rect x="4" y="13" width="28" height="5" fill="#111" opacity="0.8" />
            </g>
            {/* a little dust */}
            {[0, 1, 2].map((i) => (
                <motion.circle
                    key={i}
                    cx={108 + i * 12}
                    cy={72}
                    r={1.6}
                    fill={accent}
                    animate={{ y: [0, -26, -40], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7, ease: "easeOut" }}
                />
            ))}
        </svg>
    );
}
