import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

// Social share card (Open Graph / Twitter), generated at build time.
export const runtime = "nodejs";
export const alt = "Cybox: know what you own, know what it's worth";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
    const logo = await readFile(path.join(process.cwd(), "public/brand/cybox-wordmark.png"));
    const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    position: "relative",
                    background: "#050505",
                    backgroundImage:
                        "radial-gradient(circle at 78% 55%, rgba(246,207,69,0.22), transparent 45%), radial-gradient(rgba(255,255,255,0.06) 1.5px, transparent 1.5px)",
                    backgroundSize: "100% 100%, 32px 32px",
                    color: "white",
                    fontFamily: "sans-serif",
                    padding: "64px 72px",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoSrc} alt="" width={198} height={52} />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "rgba(246,207,69,0.85)", textTransform: "uppercase", marginBottom: 22 }}>
                            Asset management, by department
                        </div>
                        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2 }}>Know what you own.</div>
                        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.04, letterSpacing: -2, color: "#F6CF45" }}>
                            Know what it&apos;s worth.
                        </div>
                    </div>
                    <div style={{ display: "flex", fontSize: 24, color: "rgba(255,255,255,0.55)" }}>
                        Rooms, roles and automatic depreciation · Try the live demo
                    </div>
                </div>

                {/* isometric box */}
                <svg width="380" height="420" viewBox="0 0 240 260" style={{ position: "absolute", right: 70, top: 110 }}>
                    <polygon points="120,30 220,80 120,130 20,80" fill="#F6CF45" />
                    <polygon points="20,80 120,130 120,250 20,200" fill="#161616" stroke="rgba(246,207,69,0.5)" />
                    <polygon points="220,80 120,130 120,250 220,200" fill="#0c0c0c" stroke="rgba(246,207,69,0.5)" />
                    <polygon points="96,42 144,66 44,116 0,92" fill="#050505" opacity="0.22" transform="translate(24 0)" />
                    <polygon points="40,140 96,168 96,196 40,168" fill="#f3efe4" />
                    <rect x="48" y="170" width="40" height="8" fill="#111" transform="skewY(26.5)" />
                    <polygon points="160,150 196,132 172,184 150,190" fill="#FFAE3F" />
                </svg>
            </div>
        ),
        size
    );
}
